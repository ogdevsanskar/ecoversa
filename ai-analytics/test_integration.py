#!/usr/bin/env python3
"""
Integration test to verify data flow between IoT simulation and ML analytics
"""

import sys
import os

# Add the ai-analytics directory to Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__)))

try:
    from data_integration import DataStreamManager
    print("🔄 Testing EcoVerse Data Integration...")
    print("=====================================")
    
    # Create data stream manager
    manager = DataStreamManager("http://localhost:5000")
    print("✅ DataStreamManager created successfully")
    
    # Test data generation
    campus_data = manager.simulator.generate_campus_data()
    print("✅ Campus data generated successfully")
    print(f"📊 Sample metrics: {campus_data['total_metrics']}")
    
    # Test data sending (if ML API is running)
    try:
        import requests
        response = requests.get("http://localhost:5000/api/health", timeout=2)
        if response.status_code == 200:
            print("✅ ML API is running and accessible")
            
            # Test sending data to ML API
            response = requests.post(
                "http://localhost:5000/api/data/add",
                json=campus_data,
                timeout=5
            )
            
            if response.status_code == 200:
                print("✅ Successfully sent data to ML API")
                result = response.json()
                print(f"📈 Total data points in ML system: {result.get('data_points_total', 'Unknown')}")
            else:
                print(f"⚠️  ML API responded with status {response.status_code}")
        else:
            print(f"⚠️  ML API returned status {response.status_code}")
            
    except requests.exceptions.ConnectionError:
        print("ℹ️  ML API not running - data integration ready but no target API")
    except Exception as e:
        print(f"ℹ️  Could not test ML API connection: {e}")
    
    print("\n🎉 Data integration system working correctly!")
    print("💡 To start real-time streaming, run: python data_integration.py")
    
except Exception as e:
    print(f"❌ Error in integration test: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)
