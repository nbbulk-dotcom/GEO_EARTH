"""
ML Eruption Forecaster using PyTorch CNN-LSTM Hybrid
Transfer learning model for probabilistic eruption prediction
"""
import torch
import torch.nn as nn
import numpy as np
from typing import Dict, List, Tuple
from datetime import datetime, timedelta
import json
import logging

class EruptionForecaster(nn.Module):
    def __init__(self, input_features=30, sequence_length=21):
        super(EruptionForecaster, self).__init__()
        self.sequence_length = sequence_length
        
        self.conv1d = nn.Conv1d(input_features, 64, kernel_size=3, padding=1)
        self.conv1d_2 = nn.Conv1d(64, 128, kernel_size=3, padding=1)
        self.pool = nn.MaxPool1d(2)
        
        self.lstm = nn.LSTM(128, 256, batch_first=True, num_layers=2, dropout=0.2)
        
        self.fc1 = nn.Linear(256, 128)
        self.fc2 = nn.Linear(128, 64)
        self.fc3 = nn.Linear(64, 1)  # Probability output (0-1)
        self.dropout = nn.Dropout(0.3)
        self.sigmoid = nn.Sigmoid()
        
    def forward(self, x):
        x = x.transpose(1, 2)  # (batch, features, sequence)
        x = torch.relu(self.conv1d(x))
        x = self.pool(x)
        x = torch.relu(self.conv1d_2(x))
        x = x.transpose(1, 2)  # back to (batch, sequence, features)
        
        lstm_out, _ = self.lstm(x)
        x = lstm_out[:, -1, :]  # Take last output
        
        x = torch.relu(self.fc1(x))
        x = self.dropout(x)
        x = torch.relu(self.fc2(x))
        x = self.fc3(x)
        return self.sigmoid(x)

class VolcanicMLPredictor:
    def __init__(self):
        self.model = EruptionForecaster()
        self.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        self.model.to(self.device)
        self.logger = logging.getLogger(__name__)
        
        self._initialize_model()
        
    def _initialize_model(self):
        """Initialize model with synthetic pre-training data"""
        try:
            synthetic_data = self._generate_synthetic_data(1000)
            self._pretrain_model(synthetic_data)
            self.logger.info("Model initialized with synthetic pre-training")
        except Exception as e:
            self.logger.warning(f"Model initialization failed: {e}")
            
    def _generate_synthetic_data(self, num_samples: int) -> List[Dict]:
        """Generate synthetic volcanic data for pre-training"""
        synthetic_samples = []
        
        for _ in range(num_samples):
            seismic_trend = np.random.exponential(2.0, 21)  # Increasing seismic activity
            gas_emissions = np.random.lognormal(4.0, 1.0, 21)  # Log-normal gas distribution
            thermal_anomaly = np.random.gamma(2.0, 2.0, 21)  # Thermal increases
            deformation = np.random.normal(0, 5, 21).cumsum()  # Cumulative deformation
            
            features = np.column_stack([
                seismic_trend, gas_emissions, thermal_anomaly, deformation,
                np.random.normal(0, 1, (21, 26))  # Additional synthetic features
            ])
            
            eruption_prob = min(1.0, np.mean(seismic_trend) * 0.1 + np.mean(gas_emissions) * 0.05)
            
            synthetic_samples.append({
                'features': features,
                'probability': eruption_prob
            })
            
        return synthetic_samples
        
    def _pretrain_model(self, synthetic_data: List[Dict]):
        """Pre-train model on synthetic data"""
        self.model.train()
        optimizer = torch.optim.Adam(self.model.parameters(), lr=0.001)
        criterion = nn.BCELoss()
        
        features = torch.FloatTensor([sample['features'] for sample in synthetic_data])
        targets = torch.FloatTensor([sample['probability'] for sample in synthetic_data])
        
        for epoch in range(50):
            optimizer.zero_grad()
            outputs = self.model(features).squeeze()
            loss = criterion(outputs, targets)
            loss.backward()
            optimizer.step()
            
        self.model.eval()
        
    def predict_eruption(self, sensor_data: Dict) -> float:
        """Predict eruption probability incorporating RGB/CMYK overlap"""
        try:
            features = self._extract_features(sensor_data)
            
            rgb_vec = np.array(sensor_data.get('rgb_values', [1.0, 1.0, 1.0]))
            cmyk_vec = np.array(sensor_data.get('cmyk_values', [0.0, 0.0, 0.0, 1.0]))
            
            overlap = np.dot(rgb_vec, cmyk_vec[:3])  # Use RGB components of CMYK
            
            with torch.no_grad():
                tensor_input = torch.FloatTensor(features).unsqueeze(0).to(self.device)
                probability = self.model(tensor_input).item()
                
            amplified_prob = probability * (1.0 + overlap * 0.5)
            return min(1.0, max(0.0, amplified_prob))
            
        except Exception as e:
            self.logger.error(f"Prediction failed: {e}")
            return 0.5  # Default probability
            
    def _extract_features(self, sensor_data: Dict) -> np.ndarray:
        """Extract and normalize features from sensor data"""
        sequence_length = 21
        num_features = 30
        
        features = np.zeros((sequence_length, num_features))
        
        seismic_data = sensor_data.get('seismic_data', [2.0] * sequence_length)
        gas_data = sensor_data.get('gas_data', [100.0] * sequence_length)
        thermal_data = sensor_data.get('thermal_data', [300.0] * sequence_length)
        deformation_data = sensor_data.get('deformation_data', [0.0] * sequence_length)
        
        for i in range(sequence_length):
            idx = min(i, len(seismic_data) - 1)
            features[i, 0] = seismic_data[idx] / 10.0  # Normalize seismic magnitude
            features[i, 1] = gas_data[idx] / 1000.0    # Normalize gas concentration
            features[i, 2] = thermal_data[idx] / 500.0  # Normalize temperature
            features[i, 3] = deformation_data[idx] / 100.0  # Normalize deformation
            
            features[i, 4:] = np.random.normal(0, 0.1, num_features - 4)
            
        return features
        
    def fine_tune(self, real_data: List[Dict]):
        """Fine-tune model with real volcanic data"""
        if not real_data:
            return
            
        self.model.train()
        optimizer = torch.optim.Adam(self.model.parameters(), lr=0.0001)
        criterion = nn.BCELoss()
        
        features = torch.FloatTensor([self._extract_features(sample) for sample in real_data])
        targets = torch.FloatTensor([sample.get('eruption_occurred', 0.0) for sample in real_data])
        
        for epoch in range(20):
            optimizer.zero_grad()
            outputs = self.model(features).squeeze()
            loss = criterion(outputs, targets)
            loss.backward()
            optimizer.step()
            
        self.model.eval()
        self.logger.info(f"Model fine-tuned on {len(real_data)} real samples")
