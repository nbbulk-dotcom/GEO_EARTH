"""Pydantic models for validation and testing"""

from typing import Dict, List, Optional

from pydantic import BaseModel, Field


class SystemStatus(BaseModel):
    system_version: str = Field(..., description="System version")
    status: str = Field(..., description="System status")
    space_variables_status: Dict = Field(..., description="Space variables status")
    ml_status: Dict = Field(..., description="ML status")
    system_validation: Dict = Field(..., description="System validation")
    upgrade_completion: Dict = Field(..., description="Upgrade completion status")
    framework_compliance: str = Field(..., description="Framework compliance")
    timestamp: str = Field(..., description="Timestamp")


class SystemStatusResponse(BaseModel):
    status: str = Field(..., description="Response status")
    system_status: SystemStatus = Field(..., description="System status")
    framework: str = Field(..., description="Framework")


class UpgradeValidation(BaseModel):
    priority_1_space_calculator: Dict = Field(..., description="Priority 1 validation")
    priority_2_full_system: Dict = Field(..., description="Priority 2 validation")
    overall_upgrade_status: str = Field(..., description="Overall upgrade status")
    system_version: str = Field(..., description="System version")
    upgrade_date: str = Field(..., description="Upgrade date")


class UpgradeValidationResponse(BaseModel):
    status: str = Field(..., description="Response status")
    upgrade_validation: UpgradeValidation = Field(..., description="Upgrade validation")
    framework: str = Field(..., description="Framework")


class SpaceVariablesTest(BaseModel):
    chamber_resonance_test: Dict = Field(..., description="Chamber resonance test")
    constructive_interference_test: Dict = Field(..., description="Constructive interference test")
    space_correction_test: Dict = Field(..., description="Space correction test")
    overall_test_status: str = Field(..., description="Overall test status")
    space_variables_functional: bool = Field(..., description="Space variables functional")


class SpaceVariablesTestResponse(BaseModel):
    status: str = Field(..., description="Response status")
    test_results: SpaceVariablesTest = Field(..., description="Test results")
    framework: str = Field(..., description="Framework")


class HealthStatus(BaseModel):
    system: str = Field(..., description="System name")
    status: str = Field(..., description="Health status")
    components: Dict[str, str] = Field(..., description="Component statuses")
    upgrade_status: Dict = Field(..., description="Upgrade status")
    framework_compliance: str = Field(..., description="Framework compliance")
    timestamp: str = Field(..., description="Timestamp")


class HealthCheckResponse(BaseModel):
    status: str = Field(..., description="Response status")
    health_status: HealthStatus = Field(..., description="Health status")
    framework: str = Field(..., description="Framework")
