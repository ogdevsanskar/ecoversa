import random
import time
import json
import requests
from datetime import datetime, timedelta
import numpy as np
from typing import Dict, List
import threading
import os

# Optional dotenv import - graceful fallback if not available
try:
    from dotenv import load_dotenv
    load_dotenv()
    print("✅ Environment variables loaded from .env file")
except ImportError:
    print("ℹ️  python-dotenv not installed, using system environment variables")
    def load_dotenv():
        pass

class CampusDataSimulator:
    """
    EcoVerse IoT Data Simulator
    Generates realistic campus resource usage data
    """
    
    def __init__(self):
        self.firebase_url = os.getenv('FIREBASE_URL', 'https://ecoverse-default-rtdb.firebaseio.com')
        self.buildings = ['Engineering', 'Science', 'Library', 'Dormitory_A', 'Dormitory_B', 'Admin', 'Cafeteria']
        self.running = False
        
        # Base consumption patterns (hourly averages)
        self.building_profiles = {
            'Engineering': {'electricity': 800, 'water': 1200, 'waste': 50},
            'Science': {'electricity': 600, 'water': 800, 'waste': 30},
            'Library': {'electricity': 300, 'water': 200, 'waste': 10},
            'Dormitory_A': {'electricity': 400, 'water': 2000, 'waste': 80},
            'Dormitory_B': {'electricity': 420, 'water': 2100, 'waste': 85},
            'Admin': {'electricity': 250, 'water': 300, 'waste': 15},
            'Cafeteria': {'electricity': 500, 'water': 1500, 'waste': 120}
        }
    
    def get_time_factor(self) -> float:
        """Generate time-based usage variation (24-hour cycle)"""
        hour = datetime.now().hour
        
        # Peak hours: 8-18, Low hours: 22-6
        if 8 <= hour <= 18:
            return random.uniform(0.8, 1.3)  # Peak usage
        elif 19 <= hour <= 21:
            return random.uniform(0.6, 0.9)  # Evening
        else:
            return random.uniform(0.3, 0.6)  # Night
    
    def get_seasonal_factor(self) -> float:
        """Generate seasonal variation"""
        month = datetime.now().month
        
        # Summer months need more cooling
        if month in [6, 7, 8]:
            return random.uniform(1.1, 1.4)
        # Winter months need more heating
        elif month in [12, 1, 2]:
            return random.uniform(1.0, 1.3)
        else:
            return random.uniform(0.9, 1.1)
    
    def generate_electricity_data(self, building: str) -> float:
        """Generate realistic electricity consumption (kWh)"""
        base = self.building_profiles[building]['electricity']
        time_factor = self.get_time_factor()
        seasonal_factor = self.get_seasonal_factor()
        random_factor = random.uniform(0.85, 1.15)
        
        consumption = base * time_factor * seasonal_factor * random_factor
        return round(consumption, 2)
    
    def generate_water_data(self, building: str) -> float:
        """Generate realistic water consumption (Liters)"""
        base = self.building_profiles[building]['water']
        time_factor = self.get_time_factor()
        random_factor = random.uniform(0.8, 1.2)
        
        # Water usage less affected by seasons but more by occupancy
        consumption = base * time_factor * random_factor
        return round(consumption, 2)
    
    def generate_waste_data(self, building: str) -> float:
        """Generate realistic waste production (kg)"""
        base = self.building_profiles[building]['waste']
        time_factor = self.get_time_factor()
        random_factor = random.uniform(0.7, 1.3)
        
        waste = base * time_factor * random_factor
        return round(waste, 2)
    
    def generate_air_quality_data(self) -> Dict:
        """Generate air quality metrics (AQI, pollutants)"""
        # Simulate realistic AQI values
        base_aqi = random.uniform(50, 150)
        
        # Add some correlation with time of day (higher during rush hours)
        hour = datetime.now().hour
        if hour in [7, 8, 9, 17, 18, 19]:  # Rush hours
            base_aqi += random.uniform(10, 30)
        
        aqi = min(300, max(0, base_aqi))
        
        return {
            'aqi': round(aqi, 1),
            'pm25': round(aqi * 0.5 + random.uniform(-10, 10), 1),
            'pm10': round(aqi * 0.8 + random.uniform(-15, 15), 1),
            'co2': round(400 + random.uniform(-50, 100), 1),
            'temperature': round(20 + random.uniform(-5, 15), 1),
            'humidity': round(50 + random.uniform(-20, 30), 1)
        }
    
    def send_to_firebase(self, data: Dict) -> bool:
        """Send data to Firebase Realtime Database"""
        try:
            # For now, we'll just print the data (Firebase integration can be added)
            print(f"📊 Sending data to Firebase: {json.dumps(data, indent=2)}")
            
            # Uncomment when Firebase is configured:
            # response = requests.put(f"{self.firebase_url}/sensor_data/{data['timestamp']}.json", 
            #                        json=data)
            # return response.status_code == 200
            return True
            
        except Exception as e:
            print(f"❌ Error sending data to Firebase: {e}")
            return False
    
    def generate_campus_snapshot(self) -> Dict:
        """Generate complete campus data snapshot"""
        timestamp = datetime.now().isoformat()
        
        campus_data = {
            'timestamp': timestamp,
            'buildings': {},
            'campus_air_quality': self.generate_air_quality_data(),
            'total_metrics': {
                'electricity': 0,
                'water': 0,
                'waste': 0
            }
        }
        
        # Generate data for each building
        for building in self.buildings:
            building_data = {
                'electricity_kwh': self.generate_electricity_data(building),
                'water_liters': self.generate_water_data(building),
                'waste_kg': self.generate_waste_data(building)
            }
            
            campus_data['buildings'][building] = building_data
            
            # Add to totals
            campus_data['total_metrics']['electricity'] += building_data['electricity_kwh']
            campus_data['total_metrics']['water'] += building_data['water_liters']
            campus_data['total_metrics']['waste'] += building_data['waste_kg']
        
        # Round totals
        for metric in campus_data['total_metrics']:
            campus_data['total_metrics'][metric] = round(campus_data['total_metrics'][metric], 2)
        
        return campus_data
    
    def simulate_realtime_data(self, interval_seconds: int = 300):
        """Start real-time data simulation (every 5 minutes by default)"""
        print(f"🚀 Starting EcoVerse IoT Simulation...")
        print(f"📡 Generating data every {interval_seconds} seconds")
        print(f"🏢 Monitoring buildings: {', '.join(self.buildings)}")
        
        self.running = True
        
        while self.running:
            try:
                # Generate and send data
                campus_data = self.generate_campus_snapshot()
                success = self.send_to_firebase(campus_data)
                
                if success:
                    print(f"✅ Data sent successfully at {campus_data['timestamp']}")
                    print(f"⚡ Total Electricity: {campus_data['total_metrics']['electricity']} kWh")
                    print(f"💧 Total Water: {campus_data['total_metrics']['water']} L")
                    print(f"🗑️ Total Waste: {campus_data['total_metrics']['waste']} kg")
                    print(f"🌬️ Campus AQI: {campus_data['campus_air_quality']['aqi']}")
                else:
                    print("❌ Failed to send data")
                
                print("-" * 50)
                
                # Wait for next interval
                time.sleep(interval_seconds)
                
            except KeyboardInterrupt:
                print("\n🛑 Simulation stopped by user")
                self.running = False
                break
            except Exception as e:
                print(f"❌ Error in simulation loop: {e}")
                time.sleep(10)  # Wait before retrying
    
    def stop(self):
        """Stop the simulation"""
        self.running = False

def main():
    """Main function to run the IoT simulator"""
    simulator = CampusDataSimulator()
    
    print("🌱 EcoVerse Campus IoT Data Simulator")
    print("=====================================")
    
    try:
        # Start real-time simulation (every 5 minutes)
        simulator.simulate_realtime_data(interval_seconds=300)
    except KeyboardInterrupt:
        print("\n🔄 Shutting down simulator...")
        simulator.stop()

if __name__ == "__main__":
    main()
