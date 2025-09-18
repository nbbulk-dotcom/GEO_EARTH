"""Create volcanic monitoring tables

Revision ID: 001
Revises: 
Create Date: 2025-09-18 08:52:44.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision = '001'
down_revision = None
branch_labels = None
depends_on = None

def upgrade():
    op.execute("""
        CREATE TABLE volcano_readings (
            id SERIAL PRIMARY KEY,
            volcano_id VARCHAR(50) NOT NULL,
            timestamp TIMESTAMPTZ NOT NULL,
            latitude FLOAT NOT NULL,
            longitude FLOAT NOT NULL,
            seismic_magnitude FLOAT,
            gas_so2_ppm FLOAT,
            gas_co2_ppm FLOAT,
            thermal_anomaly FLOAT,
            deformation_mm FLOAT,
            eruption_probability FLOAT,
            resonance_frequency FLOAT,
            chamber_pressure FLOAT,
            interference_factor FLOAT,
            sun_zenith_angle FLOAT,
            risk_level VARCHAR(20),
            magnitude_estimate FLOAT,
            confidence FLOAT,
            created_at TIMESTAMPTZ DEFAULT NOW()
        );
    """)
    
    op.execute("SELECT create_hypertable('volcano_readings', 'timestamp');")
    
    op.execute("CREATE INDEX idx_volcano_readings_volcano_id ON volcano_readings(volcano_id);")
    op.execute("CREATE INDEX idx_volcano_readings_timestamp ON volcano_readings(timestamp DESC);")
    op.execute("CREATE INDEX idx_volcano_readings_risk_level ON volcano_readings(risk_level);")
    
    op.execute("""
        CREATE TABLE volcanic_alerts (
            id SERIAL PRIMARY KEY,
            volcano_id VARCHAR(50) NOT NULL,
            alert_type VARCHAR(50) NOT NULL,
            severity VARCHAR(20) NOT NULL,
            message TEXT,
            triggered_at TIMESTAMPTZ NOT NULL,
            resolved_at TIMESTAMPTZ,
            is_active BOOLEAN DEFAULT TRUE,
            created_at TIMESTAMPTZ DEFAULT NOW()
        );
    """)
    
    op.execute("CREATE INDEX idx_volcanic_alerts_volcano_id ON volcanic_alerts(volcano_id);")
    op.execute("CREATE INDEX idx_volcanic_alerts_active ON volcanic_alerts(is_active);")
    op.execute("CREATE INDEX idx_volcanic_alerts_severity ON volcanic_alerts(severity);")
    
    op.execute("""
        CREATE TABLE volcanic_forecasts (
            id SERIAL PRIMARY KEY,
            volcano_id VARCHAR(50) NOT NULL,
            forecast_date TIMESTAMPTZ NOT NULL,
            day_offset INTEGER NOT NULL,
            probability FLOAT NOT NULL,
            risk_level VARCHAR(20) NOT NULL,
            magnitude_estimate FLOAT,
            confidence FLOAT,
            interference_factor FLOAT,
            sun_zenith_angle FLOAT,
            temporal_factor FLOAT,
            created_at TIMESTAMPTZ DEFAULT NOW()
        );
    """)
    
    op.execute("SELECT create_hypertable('volcanic_forecasts', 'forecast_date');")
    
    op.execute("CREATE INDEX idx_volcanic_forecasts_volcano_id ON volcanic_forecasts(volcano_id);")
    op.execute("CREATE INDEX idx_volcanic_forecasts_date ON volcanic_forecasts(forecast_date DESC);")

def downgrade():
    op.drop_table('volcanic_forecasts')
    op.drop_table('volcanic_alerts')
    op.drop_table('volcano_readings')
