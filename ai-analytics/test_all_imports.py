#!/usr/bin/env python3
"""
Comprehensive test to verify all import issues are resolved
"""

import sys
import os

def test_dotenv_imports():
    """Test dotenv-related imports"""
    print("🧪 Testing dotenv imports...")
    
    try:
        from dotenv import load_dotenv
        print("✅ dotenv import successful")
        
        # Test loading (should not fail even if no .env file)
        load_dotenv()
        print("✅ load_dotenv() executed successfully")
        
    except ImportError as e:
        print(f"❌ dotenv import failed: {e}")
        return False
    except Exception as e:
        print(f"⚠️  dotenv loaded with warning: {e}")
    
    return True

def test_config_system():
    """Test the configuration system"""
    print("\n🧪 Testing configuration system...")
    
    try:
        # Add current directory to path
        sys.path.insert(0, os.path.dirname(__file__))
        
        from config import Config, get_env_var
        print("✅ Config system import successful")
        
        # Test getting environment variables
        test_val = get_env_var('TEST_VAR', 'default_test_value')
        print(f"✅ Environment variable access working: {test_val}")
        
        # Test configuration class
        api_port = Config.API_PORT
        print(f"✅ Configuration class working: API_PORT = {api_port}")
        
    except Exception as e:
        print(f"❌ Config system failed: {e}")
        return False
    
    return True

def test_data_integration():
    """Test data integration imports"""
    print("\n🧪 Testing data integration...")
    
    try:
        sys.path.insert(0, os.path.dirname(__file__))
        
        from data_integration import DataStreamManager
        print("✅ DataStreamManager import successful")
        
        # Test creating instance
        manager = DataStreamManager()
        print("✅ DataStreamManager instance created")
        
        # Test data generation
        data = manager.simulator.generate_campus_data()
        print(f"✅ Data generation working: {data['total_metrics']}")
        
    except Exception as e:
        print(f"❌ Data integration failed: {e}")
        return False
    
    return True

def test_original_campus_simulator():
    """Test original campus simulator"""
    print("\n🧪 Testing original campus simulator...")
    
    try:
        # Add iot-simulation path
        iot_path = os.path.join(os.path.dirname(__file__), '..', 'iot-simulation')
        sys.path.insert(0, iot_path)
        
        from campus_simulator import CampusDataSimulator
        print("✅ Original CampusDataSimulator import successful")
        
        # Test creating instance
        simulator = CampusDataSimulator()
        print("✅ Original CampusDataSimulator instance created")
        
    except Exception as e:
        print(f"❌ Original campus simulator failed: {e}")
        return False
    
    return True

def main():
    """Run all import tests"""
    print("🔍 EcoVerse Import Resolution Verification")
    print("=" * 50)
    
    tests = [
        test_dotenv_imports,
        test_config_system,
        test_data_integration,
        test_original_campus_simulator
    ]
    
    passed = 0
    total = len(tests)
    
    for test in tests:
        if test():
            passed += 1
        print()  # Add spacing between tests
    
    print("=" * 50)
    print(f"📊 Test Results: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 All import issues resolved successfully!")
        print("✅ EcoVerse platform ready for deployment")
    else:
        print("⚠️  Some import issues remain")
        print("❌ Please check the failed tests above")
    
    return passed == total

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
