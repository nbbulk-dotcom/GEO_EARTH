#!/usr/bin/env python3
"""
Verification script for LIVE systems integration with 24 earth + 12 space variables
"""

import sys
import os
sys.path.append('/home/ubuntu/repos/GEO_EARTH/backend')

def test_variable_storage_service():
    """Test VariableStorageService has correct variable counts"""
    print("=== Variable Architecture Validation ===")
    try:
        from app.services.variable_storage_service import VariableStorageService
        service = VariableStorageService()
        validation = service.validate_variable_integrity()
        counts = service.get_variable_counts()
        
        print(f"Earth variables: {validation['earth_count']} (expected: 24) - Valid: {validation['earth_variables_valid']}")
        print(f"Space variables: {validation['space_count']} (expected: 12) - Valid: {validation['space_variables_valid']}")
        print(f"Overall status: {validation['overall_status']}")
        print(f"Earth layer names: {counts['earth_layer_names']}")
        print(f"Space variable names: {counts['space_variable_names']}")
        
        return validation['overall_status'] == 'VALID'
    except Exception as e:
        print(f"ERROR in VariableStorageService test: {e}")
        return False

def test_brett_engine_integration():
    """Test BrettCoreEngine integration with variable architecture"""
    print("\n=== BrettCoreEngine Integration Test ===")
    try:
        from app.core.brett_engine import BrettCoreEngine
        from datetime import datetime
        
        engine = BrettCoreEngine()
        location = (40.7128, -74.0060)  # New York coordinates
        result = engine.predict_earthquake_probability(location, datetime.utcnow())
        
        print(f"Framework: {result.get('framework', 'N/A')}")
        print(f"Earth variables count: {result.get('earth_variables_count', 'N/A')}")
        print(f"Space variables count: {result.get('space_variables_count', 'N/A')}")
        print(f"Success: {result.get('success', False)}")
        print(f"Prediction probability: {result.get('earthquake_probability', 'N/A')}")
        
        framework_valid = '24E/12S Variables' in result.get('framework', '')
        variables_present = (result.get('earth_variables_count', 0) > 0 and 
                           result.get('space_variables_count', 0) > 0)
        
        return framework_valid and variables_present and result.get('success', False)
    except Exception as e:
        print(f"ERROR in BrettCoreEngine test: {e}")
        return False

def test_volcanic_system_integration():
    """Test Volcanic system integration with earthquake variables"""
    print("\n=== Volcanic System Integration Test ===")
    try:
        from app.core.volcanic_locator import VolcanicLocator
        
        locator = VolcanicLocator()
        location = (19.4, -155.6)  # Kilauea coordinates
        earth_vars = locator.get_seismic_variables_from_earthquake_system(location)
        
        print(f"Volcanic system can access earthquake variables: {earth_vars is not None}")
        print(f"Space angle: {locator.space_angle}°")
        print(f"Earth angle: {locator.earth_angle}°")
        print(f"Regional modifiers available: {len(locator.regional_modifiers)}")
        
        space_angle_valid = abs(locator.space_angle - 26.565) < 0.001
        earth_angle_valid = abs(locator.earth_angle - 54.74) < 0.001
        
        return space_angle_valid and earth_angle_valid and earth_vars is not None
    except Exception as e:
        print(f"ERROR in Volcanic system test: {e}")
        return False

def main():
    """Run all verification tests"""
    print("LIVE Systems Integration Verification")
    print("=" * 50)
    
    tests = [
        ("Variable Storage Service", test_variable_storage_service),
        ("BrettCoreEngine Integration", test_brett_engine_integration), 
        ("Volcanic System Integration", test_volcanic_system_integration)
    ]
    
    results = []
    for test_name, test_func in tests:
        try:
            result = test_func()
            results.append((test_name, result))
            print(f"\n{test_name}: {'PASS' if result else 'FAIL'}")
        except Exception as e:
            results.append((test_name, False))
            print(f"\n{test_name}: FAIL - {e}")
    
    print("\n" + "=" * 50)
    print("VERIFICATION SUMMARY:")
    all_passed = True
    for test_name, result in results:
        status = "PASS" if result else "FAIL"
        print(f"  {test_name}: {status}")
        if not result:
            all_passed = False
    
    print(f"\nOverall Status: {'ALL TESTS PASSED' if all_passed else 'SOME TESTS FAILED'}")
    return 0 if all_passed else 1

if __name__ == "__main__":
    sys.exit(main())
