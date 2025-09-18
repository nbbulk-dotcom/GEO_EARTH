"""
Tests for ML eruption forecaster
"""
import pytest
import torch
import numpy as np
from unittest.mock import patch, Mock

from app.ml.eruption_forecaster import EruptionForecaster, VolcanicMLPredictor

class TestEruptionForecaster:
    def test_model_architecture(self):
        model = EruptionForecaster(input_features=30, sequence_length=21)
        
        assert hasattr(model, 'conv1d')
        assert hasattr(model, 'lstm')
        assert hasattr(model, 'fc1')
        assert hasattr(model, 'fc2')
        assert hasattr(model, 'fc3')
        
        batch_size = 2
        sequence_length = 21
        input_features = 30
        
        x = torch.randn(batch_size, sequence_length, input_features)
        output = model(x)
        
        assert output.shape == (batch_size, 1)
        assert torch.all(output >= 0) and torch.all(output <= 1)  # Sigmoid output
        
    def test_model_parameters(self):
        model = EruptionForecaster()
        
        total_params = sum(p.numel() for p in model.parameters())
        trainable_params = sum(p.numel() for p in model.parameters() if p.requires_grad)
        
        assert total_params > 0
        assert trainable_params == total_params  # All parameters should be trainable
        
    def test_different_input_sizes(self):
        model_small = EruptionForecaster(input_features=10, sequence_length=7)
        model_large = EruptionForecaster(input_features=50, sequence_length=30)
        
        x_small = torch.randn(1, 7, 10)
        x_large = torch.randn(1, 30, 50)
        
        output_small = model_small(x_small)
        output_large = model_large(x_large)
        
        assert output_small.shape == (1, 1)
        assert output_large.shape == (1, 1)

class TestVolcanicMLPredictor:
    def test_predictor_initialization(self):
        predictor = VolcanicMLPredictor()
        
        assert predictor.model is not None
        assert predictor.device is not None
        assert isinstance(predictor.model, EruptionForecaster)
        
    def test_feature_extraction_basic(self):
        predictor = VolcanicMLPredictor()
        
        sensor_data = {
            'seismic_data': [2.1, 2.3, 1.9],
            'gas_data': [150, 160, 145],
            'thermal_data': [300, 305, 298],
            'deformation_data': [0.1, 0.2, 0.15]
        }
        
        features = predictor._extract_features(sensor_data)
        
        assert features.shape == (21, 30)  # 21 days, 30 features
        assert not np.isnan(features).any()
        assert not np.isinf(features).any()
        
    def test_feature_extraction_missing_data(self):
        predictor = VolcanicMLPredictor()
        
        sensor_data = {
            'seismic_data': [2.1]  # Only one data point
        }
        
        features = predictor._extract_features(sensor_data)
        
        assert features.shape == (21, 30)
        assert not np.isnan(features).any()
        
    def test_feature_extraction_empty_data(self):
        predictor = VolcanicMLPredictor()
        
        sensor_data = {}
        
        features = predictor._extract_features(sensor_data)
        
        assert features.shape == (21, 30)
        assert not np.isnan(features).any()
        
    def test_rgb_cmyk_overlap_calculation(self):
        predictor = VolcanicMLPredictor()
        
        sensor_data_overlap = {
            'seismic_data': [2.0] * 5,
            'gas_data': [150] * 5,
            'rgb_values': [1.0, 0.0, 0.0],  # Pure red
            'cmyk_values': [0.0, 1.0, 1.0, 0.0]  # Magenta + Yellow = Red
        }
        
        prob_overlap = predictor.predict_eruption(sensor_data_overlap)
        
        sensor_data_no_overlap = {
            'seismic_data': [2.0] * 5,
            'gas_data': [150] * 5,
            'rgb_values': [1.0, 0.0, 0.0],  # Red
            'cmyk_values': [1.0, 0.0, 0.0, 0.0]  # Cyan
        }
        
        prob_no_overlap = predictor.predict_eruption(sensor_data_no_overlap)
        
        assert 0 <= prob_overlap <= 1
        assert 0 <= prob_no_overlap <= 1
        
    def test_prediction_consistency(self):
        predictor = VolcanicMLPredictor()
        
        sensor_data = {
            'seismic_data': [2.1, 2.3, 1.9, 2.0, 2.2],
            'gas_data': [150, 160, 145, 155, 148],
            'thermal_data': [300, 305, 298, 302, 301],
            'deformation_data': [0.1, 0.2, 0.15, 0.18, 0.22],
            'rgb_values': [0.8, 0.2, 0.1],
            'cmyk_values': [0.2, 0.8, 0.9, 0.0]
        }
        
        prob1 = predictor.predict_eruption(sensor_data)
        prob2 = predictor.predict_eruption(sensor_data)
        prob3 = predictor.predict_eruption(sensor_data)
        
        assert abs(prob1 - prob2) < 0.01  # Should be very close
        assert abs(prob2 - prob3) < 0.01
        
    def test_prediction_bounds(self):
        predictor = VolcanicMLPredictor()
        
        extreme_high_data = {
            'seismic_data': [9.0] * 21,  # Very high seismic activity
            'gas_data': [10000] * 21,    # Very high gas emissions
            'thermal_data': [1000] * 21, # Very high temperature
            'deformation_data': [100] * 21, # Very high deformation
            'rgb_values': [1.0, 1.0, 1.0],
            'cmyk_values': [1.0, 1.0, 1.0, 0.0]
        }
        
        extreme_low_data = {
            'seismic_data': [0.1] * 21,
            'gas_data': [1] * 21,
            'thermal_data': [200] * 21,
            'deformation_data': [0.001] * 21,
            'rgb_values': [0.0, 0.0, 0.0],
            'cmyk_values': [0.0, 0.0, 0.0, 1.0]
        }
        
        prob_high = predictor.predict_eruption(extreme_high_data)
        prob_low = predictor.predict_eruption(extreme_low_data)
        
        assert 0 <= prob_high <= 1
        assert 0 <= prob_low <= 1
        
    def test_synthetic_data_generation(self):
        predictor = VolcanicMLPredictor()
        
        synthetic_data = predictor._generate_synthetic_data(100)
        
        assert len(synthetic_data) == 100
        
        for sample in synthetic_data[:5]:  # Check first 5 samples
            assert 'features' in sample
            assert 'probability' in sample
            assert sample['features'].shape == (21, 30)
            assert 0 <= sample['probability'] <= 1
            
    def test_model_pretraining(self):
        predictor = VolcanicMLPredictor()
        
        synthetic_data = predictor._generate_synthetic_data(50)
        
        predictor._pretrain_model(synthetic_data)
        
        assert not predictor.model.training
        
    def test_fine_tuning(self):
        predictor = VolcanicMLPredictor()
        
        real_data = [
            {
                'seismic_data': [2.1, 2.3],
                'gas_data': [150, 160],
                'eruption_occurred': 1.0
            },
            {
                'seismic_data': [1.5, 1.6],
                'gas_data': [100, 105],
                'eruption_occurred': 0.0
            }
        ]
        
        predictor.fine_tune(real_data)
        
        assert not predictor.model.training
        
    def test_error_handling(self):
        predictor = VolcanicMLPredictor()
        
        malformed_data = {
            'seismic_data': 'not_a_list',
            'gas_data': None,
            'rgb_values': [1, 2, 3, 4, 5],  # Too many values
            'cmyk_values': [1]  # Too few values
        }
        
        prob = predictor.predict_eruption(malformed_data)
        assert 0 <= prob <= 1
        
    def test_device_handling(self):
        predictor = VolcanicMLPredictor()
        
        assert next(predictor.model.parameters()).device == predictor.device
        
        sensor_data = {
            'seismic_data': [2.0] * 5,
            'gas_data': [150] * 5
        }
        
        prob = predictor.predict_eruption(sensor_data)
        assert 0 <= prob <= 1

class TestModelTraining:
    def test_model_gradient_flow(self):
        model = EruptionForecaster()
        
        x = torch.randn(2, 21, 30, requires_grad=True)
        target = torch.tensor([0.3, 0.7])
        
        output = model(x).squeeze()
        
        criterion = torch.nn.BCELoss()
        loss = criterion(output, target)
        
        loss.backward()
        
        for param in model.parameters():
            assert param.grad is not None
            assert not torch.isnan(param.grad).any()
            
    def test_model_optimization_step(self):
        model = EruptionForecaster()
        optimizer = torch.optim.Adam(model.parameters(), lr=0.001)
        
        initial_params = [param.clone() for param in model.parameters()]
        
        x = torch.randn(2, 21, 30)
        target = torch.tensor([0.3, 0.7])
        
        optimizer.zero_grad()
        output = model(x).squeeze()
        loss = torch.nn.BCELoss()(output, target)
        loss.backward()
        optimizer.step()
        
        for initial, current in zip(initial_params, model.parameters()):
            assert not torch.equal(initial, current)
            
    def test_model_convergence_simple(self):
        model = EruptionForecaster(input_features=5, sequence_length=5)
        optimizer = torch.optim.Adam(model.parameters(), lr=0.01)
        criterion = torch.nn.BCELoss()
        
        x = torch.randn(10, 5, 5)
        target = torch.tensor([0.8] * 10)  # High probability target
        
        initial_loss = None
        final_loss = None
        
        for epoch in range(50):
            optimizer.zero_grad()
            output = model(x).squeeze()
            loss = criterion(output, target)
            
            if epoch == 0:
                initial_loss = loss.item()
            if epoch == 49:
                final_loss = loss.item()
                
            loss.backward()
            optimizer.step()
            
        assert final_loss < initial_loss

if __name__ == "__main__":
    pytest.main([__file__, "-v"])
