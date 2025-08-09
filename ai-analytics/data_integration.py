import threading
import time
import json
import requests
from datetime import datetime
import os
import sys
import random
import math

# Simple CampusDataSimulator class to avoid import issues
class CampusDataSimulator:
    """Simplified campus data simulator for integration testing"""
    
    def __init__(self):
        self.buildings = ['Engineering', 'Science', 'Library', 'Dormitory_A', 'Dormitory_B', 'Admin', 'Cafeteria']
        
    def generate_campus_data(self):
        """Generate realistic campus usage data"""
        now = datetime.now()
        hour = now.hour
        
        # Time-based factors
        if 8 <= hour <= 18:
            time_factor = random.uniform(0.8, 1.3)  # Peak usage
        elif 19 <= hour <= 21:
            time_factor = random.uniform(0.6, 0.9)  # Evening
        else:
            time_factor = random.uniform(0.3, 0.6)  # Night
        
        # Base values with daily cycles
        base_electricity = 2000 + 800 * math.sin(2 * math.pi * hour / 24)
        base_water = 8000 + 2000 * math.sin(2 * math.pi * hour / 24)
        base_waste = 300 + 100 * math.sin(2 * math.pi * hour / 24)
        
        # Apply time factor and add randomness
        electricity = max(100, (base_electricity * time_factor) + random.uniform(-300, 300))
        water = max(500, (base_water * time_factor) + random.uniform(-800, 800))
        waste = max(10, (base_waste * time_factor) + random.uniform(-50, 50))
        
        return {
            'timestamp': now.isoformat(),
            'total_metrics': {
                'electricity': round(electricity, 2),
                'water': round(water, 2),
                'waste': round(waste, 2)
            },
            'building_data': self._generate_building_data(electricity, water, waste),
            'environmental': {
                'temperature': round(random.uniform(18, 28), 1),
                'humidity': round(random.uniform(40, 70), 1),
                'air_quality': round(random.uniform(50, 200), 1)
            }
        }
    
    def _generate_building_data(self, total_elec, total_water, total_waste):
        """Generate individual building data"""
        building_data = {}
        
        # Distribute total usage across buildings
        elec_per_building = total_elec / len(self.buildings)
        water_per_building = total_water / len(self.buildings)
        waste_per_building = total_waste / len(self.buildings)
        
        for building in self.buildings:
            # Add variation per building
            variation = random.uniform(0.7, 1.3)
            building_data[building] = {
                'electricity': round(elec_per_building * variation, 2),
                'water': round(water_per_building * variation, 2),
                'waste': round(waste_per_building * variation, 2)
            }
        
        return building_data

class DataStreamManager:
    """Manages the continuous data stream between IoT simulation and ML analytics"""
    
    def __init__(self, ml_api_url="http://localhost:5000"):
        self.ml_api_url = ml_api_url
        self.simulator = CampusDataSimulator()
        self.running = False
        self.stream_interval = 30  # Send data every 30 seconds
        
    def start_data_stream(self):
        """Start the continuous data streaming"""
        self.running = True
        
        print("🔄 Starting EcoVerse Data Stream Manager")
        print("======================================")
        print(f"📡 Streaming data every {self.stream_interval} seconds")
        print(f"🎯 Target ML API: {self.ml_api_url}")
        
        # Start streaming in separate thread
        stream_thread = threading.Thread(target=self._stream_loop)
        stream_thread.daemon = True
        stream_thread.start()
        
        return stream_thread
    
    def stop_data_stream(self):
        """Stop the data streaming"""
        self.running = False
        print("⏹️ Data stream stopped")
    
    def _stream_loop(self):
        """Main streaming loop"""
        while self.running:
            try:
                # Generate new campus data
                campus_data = self.simulator.generate_campus_data()
                
                # Send to ML API
                self._send_to_ml_api(campus_data)
                
                # Wait for next interval
                time.sleep(self.stream_interval)
                
            except Exception as e:
                print(f"❌ Error in data stream: {e}")
                time.sleep(5)  # Wait before retrying
    
    def _send_to_ml_api(self, data):
        """Send data to ML API"""
        try:
            response = requests.post(
                f"{self.ml_api_url}/api/data/add",
                json=data,
                timeout=10
            )
            
            if response.status_code == 200:
                print(f"✅ Data sent successfully at {data['timestamp']}")
                self._log_metrics(data)
            else:
                print(f"⚠️ API responded with status {response.status_code}")
                
        except requests.exceptions.ConnectionError:
            print("🔌 ML API not available - data cached locally")
            self._cache_data_locally(data)
        except Exception as e:
            print(f"❌ Error sending data: {e}")
    
    def _log_metrics(self, data):
        """Log key metrics for monitoring"""
        metrics = data['total_metrics']
        print(f"📊 Campus Metrics - E: {metrics['electricity']:.0f}kWh | W: {metrics['water']:.0f}L | Waste: {metrics['waste']:.1f}kg")
    
    def _cache_data_locally(self, data):
        """Cache data locally when API is unavailable"""
        cache_file = "data_cache.json"
        
        try:
            # Load existing cache
            if os.path.exists(cache_file):
                with open(cache_file, 'r') as f:
                    cache = json.load(f)
            else:
                cache = []
            
            # Add new data
            cache.append(data)
            
            # Keep only recent data (last 100 points)
            if len(cache) > 100:
                cache = cache[-100:]
            
            # Save back to file
            with open(cache_file, 'w') as f:
                json.dump(cache, f, indent=2)
                
            print(f"💾 Data cached locally ({len(cache)} points)")
            
        except Exception as e:
            print(f"❌ Error caching data: {e}")
    
    def get_real_time_predictions(self):
        """Get real-time predictions from ML API"""
        try:
            predictions = {}
            
            for metric in ['electricity', 'water', 'waste']:
                response = requests.get(
                    f"{self.ml_api_url}/api/predict/{metric}",
                    timeout=5
                )
                
                if response.status_code == 200:
                    predictions[metric] = response.json()
            
            return predictions
            
        except Exception as e:
            print(f"❌ Error getting predictions: {e}")
            return {}
    
    def check_for_anomalies(self, current_data):
        """Check current data for anomalies"""
        try:
            anomalies = {}
            metrics = current_data['total_metrics']
            
            for metric, value in metrics.items():
                response = requests.post(
                    f"{self.ml_api_url}/api/anomaly/check",
                    json={
                        'metric': metric,
                        'value': value,
                        'timestamp': current_data['timestamp']
                    },
                    timeout=5
                )
                
                if response.status_code == 200:
                    anomaly_result = response.json()
                    if anomaly_result['anomaly_detection']['is_anomaly']:
                        anomalies[metric] = anomaly_result
                        print(f"🚨 ANOMALY DETECTED in {metric}: {value} (confidence: {anomaly_result['anomaly_detection']['confidence']:.2f})")
            
            return anomalies
            
        except Exception as e:
            print(f"❌ Error checking anomalies: {e}")
            return {}
    
    def get_system_insights(self):
        """Get comprehensive system insights"""
        try:
            response = requests.get(
                f"{self.ml_api_url}/api/insights",
                timeout=10
            )
            
            if response.status_code == 200:
                insights = response.json()
                self._display_insights(insights)
                return insights
            
        except Exception as e:
            print(f"❌ Error getting insights: {e}")
            return {}
    
    def _display_insights(self, insights):
        """Display insights in a readable format"""
        print("\n📈 SYSTEM INSIGHTS")
        print("==================")
        
        if 'insights' in insights:
            data = insights['insights']
            
            # Usage patterns
            print("🔋 Energy Usage:")
            if 'usage_patterns' in data:
                patterns = data['usage_patterns']
                for metric, pattern in patterns.items():
                    print(f"  {metric.title()}: Trend {pattern.get('trend', 'stable')}")
            
            # Efficiency scores
            if 'efficiency_scores' in data:
                print("\n⚡ Efficiency Scores:")
                scores = data['efficiency_scores']
                for metric, score in scores.items():
                    print(f"  {metric.title()}: {score:.1f}%")
            
            # Predictions
            if 'predictions_next_hour' in insights:
                print("\n🔮 Next Hour Predictions:")
                preds = insights['predictions_next_hour']
                for metric, value in preds.items():
                    unit = 'kWh' if metric == 'electricity' else 'L' if metric == 'water' else 'kg'
                    print(f"  {metric.title()}: {value:.1f} {unit}")
        
        print("==================\n")

def main():
    """Main function to run the data integration system"""
    print("🌱 EcoVerse Data Integration System")
    print("===================================")
    
    # Initialize data stream manager
    stream_manager = DataStreamManager()
    
    try:
        # Start data streaming
        stream_thread = stream_manager.start_data_stream()
        
        print("\n📋 Available Commands:")
        print("  'insights' - Get system insights")
        print("  'predictions' - Get real-time predictions")
        print("  'status' - Check system status")
        print("  'quit' - Stop the system")
        print("\nSystem is running... Press Ctrl+C to stop\n")
        
        # Interactive command loop
        while stream_manager.running:
            try:
                command = input("EcoVerse> ").strip().lower()
                
                if command == 'quit':
                    break
                elif command == 'insights':
                    stream_manager.get_system_insights()
                elif command == 'predictions':
                    predictions = stream_manager.get_real_time_predictions()
                    if predictions:
                        print("\n🔮 Real-time Predictions:")
                        for metric, pred in predictions.items():
                            print(f"  {metric.title()}: {pred['predicted_value']:.1f} {pred['unit']}")
                        print()
                elif command == 'status':
                    try:
                        response = requests.get(f"{stream_manager.ml_api_url}/api/status", timeout=5)
                        if response.status_code == 200:
                            status = response.json()
                            print(f"\n🟢 System Status: {status['system_status']}")
                            print(f"🤖 ML Models: {'Trained' if status['ml_models_trained'] else 'Training'}")
                            print(f"📊 Data Points: {status['total_data_points']}")
                            print()
                    except:
                        print("❌ Cannot connect to ML API")
                elif command == 'help':
                    print("\n📋 Available Commands:")
                    print("  'insights' - Get system insights")
                    print("  'predictions' - Get real-time predictions")
                    print("  'status' - Check system status")
                    print("  'quit' - Stop the system")
                    print()
                elif command:
                    print("❓ Unknown command. Type 'help' for available commands.")
                    
            except EOFError:
                break
                
    except KeyboardInterrupt:
        print("\n⏹️ Stopping system...")
    finally:
        stream_manager.stop_data_stream()
        print("👋 EcoVerse Data Integration System stopped")

if __name__ == "__main__":
    main()
