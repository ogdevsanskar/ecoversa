#!/usr/bin/env python3
"""
Test script to verify the campus simulator import fix
"""

import sys
import os

# Add the ai-analytics directory to Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__)))

try:
    from data_integration import DataStreamManager
    print("✅ Successfully imported DataStreamManager")
    
    # Test creating an instance
    manager = DataStreamManager()
    print("✅ Successfully created DataStreamManager instance")
    
    # Test generating data
    data = manager.simulator.generate_campus_data()
    print("✅ Successfully generated campus data")
    print(f"📊 Sample data: {data['total_metrics']}")
    
    print("\n🎉 All imports and functionality working correctly!")
    
except ImportError as e:
    print(f"❌ Import error: {e}")
    sys.exit(1)
except Exception as e:
    print(f"❌ Error: {e}")
    sys.exit(1)
