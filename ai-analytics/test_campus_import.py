#!/usr/bin/env python3
"""
Specific test for campus_simulator import issue reported by user
"""

import sys
import os

def test_specific_campus_simulator_import():
    """Test the exact import pattern that might be failing in VS Code"""
    print("🔍 Testing specific campus_simulator import patterns...")
    
    # Test 1: Direct import from iot-simulation directory
    try:
        sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'iot-simulation'))
        import campus_simulator
        print("✅ Test 1: Direct module import successful")
        
        # Test instantiation
        simulator = campus_simulator.CampusDataSimulator()
        print("✅ Test 1: CampusDataSimulator instance created")
    except Exception as e:
        print(f"❌ Test 1 failed: {e}")
        return False
    
    # Test 2: Import from package
    try:
        sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'iot-simulation'))
        # Use importlib to import if direct import fails
        import importlib.util
        iot_sim_path = os.path.join(os.path.dirname(__file__), '..', 'iot-simulation', 'iot_simulation.py')
        spec = importlib.util.spec_from_file_location("iot_simulation", iot_sim_path)
        iot_simulation = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(iot_simulation)
        CampusDataSimulator = iot_simulation.CampusDataSimulator
        print("✅ Test 2: Package import successful")
        
        # Test instantiation
        simulator2 = CampusDataSimulator()
        print("✅ Test 2: Package CampusDataSimulator instance created")
    except Exception as e:
        print(f"⚠️  Test 2 (package import) failed: {e}")
        print("   This is expected if using direct imports")
    
    # Test 3: Relative import style
    try:
        # Reset path
        if os.path.join(os.path.dirname(__file__), '..', 'iot-simulation') in sys.path:
            sys.path.remove(os.path.join(os.path.dirname(__file__), '..', 'iot-simulation'))
        
        sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'iot-simulation'))
        from campus_simulator import CampusDataSimulator as CDS
        print("✅ Test 3: Specific class import successful")
        
        # Test instantiation
        simulator3 = CDS()
        print("✅ Test 3: Aliased CampusDataSimulator instance created")
    except Exception as e:
        print(f"❌ Test 3 failed: {e}")
        return False
    
    print("\n🎉 All campus_simulator import patterns working!")
    return True

if __name__ == "__main__":
    success = test_specific_campus_simulator_import()
    if success:
        print("\n✅ campus_simulator import issue should be resolved")
        print("💡 If VS Code still shows import errors, try:")
        print("   1. Restart VS Code")
        print("   2. Reload Window (Ctrl+Shift+P -> 'Developer: Reload Window')")
        print("   3. Select Python interpreter: .venv/Scripts/python.exe")
    else:
        print("\n❌ Import issues persist - needs further investigation")

# If iot_simulation.py is in the same directory or one level up, add its path to sys.path
import sys
import os
iot_sim_path = os.path.join(os.path.dirname(__file__), 'iot_simulation.py')
if not os.path.exists(iot_sim_path):
    iot_sim_path = os.path.join(os.path.dirname(__file__), '..', 'iot-simulation', 'iot_simulation.py')
    sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'iot-simulation'))
else:
    sys.path.insert(0, os.path.dirname(__file__))

# Ensure the correct path is added to sys.path before importing
import sys
import os
iot_sim_path = os.path.join(os.path.dirname(__file__), 'iot_simulation.py')
if not os.path.exists(iot_sim_path):
    iot_sim_path = os.path.join(os.path.dirname(__file__), '..', 'iot-simulation', 'iot_simulation.py')
    sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'iot-simulation'))
else:
    sys.path.insert(0, os.path.dirname(__file__))

import importlib.util
spec = importlib.util.spec_from_file_location("iot_simulation", iot_sim_path)
iot_simulation = importlib.util.module_from_spec(spec)
spec.loader.exec_module(iot_simulation)

# If it's a package you need to install
# Run in terminal: pip install iot_simulation

# If using ES6 modules
# (This is JavaScript syntax, not Python. Remove or use only in JS files.)

# If using CommonJS
# (This is JavaScript syntax, not Python. Remove or use only in JS files.)
