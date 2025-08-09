import numpy as np
import pandas as pd
from sklearn.ensemble import IsolationForest
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, mean_squared_error
import joblib
from datetime import datetime, timedelta
import json
import random
from typing import Dict, List, Tuple
import warnings
warnings.filterwarnings('ignore')

class EcoVerseMlEngine:
    """
    AI/ML Analytics Engine for EcoVerse
    Provides usage forecasting, anomaly detection, and personalized eco-suggestions
    """
    
    def __init__(self):
        self.models = {}
        self.scalers = {}
        self.anomaly_detectors = {}
        self.historical_data = []
        
        # Eco-friendly suggestions database
        self.eco_suggestions = {
            'high_electricity': [
                "💡 Turn off lights in unused rooms - saves up to 10% energy",
                "🌡️ Raise AC temperature by 2°C - reduces consumption by 8%",
                "🔌 Unplug devices when not in use - eliminates phantom load",
                "💻 Use power-saving mode on computers and monitors",
                "🏢 Close windows and doors when AC is running"
            ],
            'high_water': [
                "🚿 Take shorter showers - save 25 gallons per day",
                "🚰 Fix leaky faucets immediately - prevents 3000 gal/year waste",
                "🪣 Use water-efficient appliances and fixtures",
                "🌱 Water plants with recycled/rainwater when possible",
                "🦷 Turn off tap while brushing teeth - saves 8 gallons per day"
            ],
            'high_waste': [
                "♻️ Separate recyclables properly - reduces landfill by 30%",
                "🥤 Use reusable bottles and containers",
                "📄 Print double-sided and only when necessary",
                "🍎 Compost organic waste in designated areas",
                "📱 Go digital - use apps instead of paper forms"
            ],
            'good_performance': [
                "🌟 Great job! You're in the top 20% of eco-warriors",
                "🏆 Keep up the excellent sustainability practices!",
                "🌱 Your actions are making a real environmental impact",
                "💚 Share your eco-tips with friends to multiply the impact"
            ]
        }
    
    def prepare_time_features(self, timestamps: List[str]) -> np.ndarray:
        """Extract time-based features from timestamps"""
        features = []
        
        for ts in timestamps:
            dt = datetime.fromisoformat(ts.replace('Z', '+00:00'))
            
            # Extract temporal features
            hour = dt.hour
            day_of_week = dt.weekday()
            month = dt.month
            
            # Cyclical encoding for time features
            hour_sin = np.sin(2 * np.pi * hour / 24)
            hour_cos = np.cos(2 * np.pi * hour / 24)
            
            day_sin = np.sin(2 * np.pi * day_of_week / 7)
            day_cos = np.cos(2 * np.pi * day_of_week / 7)
            
            month_sin = np.sin(2 * np.pi * month / 12)
            month_cos = np.cos(2 * np.pi * month / 12)
            
            features.append([hour, day_of_week, month, hour_sin, hour_cos, 
                           day_sin, day_cos, month_sin, month_cos])
        
        return np.array(features)
    
    def train_usage_forecasting_model(self, data: List[Dict], metric: str = 'electricity'):
        """Train a forecasting model for resource usage prediction"""
        if len(data) < 10:
            print(f"⚠️ Not enough data to train {metric} model (need at least 10 samples)")
            return False
        
        try:
            # Prepare data
            timestamps = [item['timestamp'] for item in data]
            values = [item['total_metrics'][metric] for item in data]
            
            # Create features
            X = self.prepare_time_features(timestamps)
            y = np.array(values)
            
            # Split data
            X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
            
            # Scale features
            scaler = StandardScaler()
            X_train_scaled = scaler.fit_transform(X_train)
            X_test_scaled = scaler.transform(X_test)
            
            # Train model
            model = LinearRegression()
            model.fit(X_train_scaled, y_train)
            
            # Evaluate
            y_pred = model.predict(X_test_scaled)
            mae = mean_absolute_error(y_test, y_pred)
            rmse = np.sqrt(mean_squared_error(y_test, y_pred))
            
            # Store model and scaler
            self.models[metric] = model
            self.scalers[metric] = scaler
            
            print(f"✅ {metric.title()} forecasting model trained successfully")
            print(f"📊 MAE: {mae:.2f}, RMSE: {rmse:.2f}")
            
            return True
            
        except Exception as e:
            print(f"❌ Error training {metric} model: {e}")
            return False
    
    def predict_usage(self, timestamp: str, metric: str = 'electricity') -> float:
        """Predict resource usage for a given timestamp"""
        try:
            if metric not in self.models:
                print(f"⚠️ No trained model for {metric}")
                return 0.0
            
            # Prepare features
            X = self.prepare_time_features([timestamp])
            X_scaled = self.scalers[metric].transform(X)
            
            # Make prediction
            prediction = self.models[metric].predict(X_scaled)[0]
            
            return max(0, prediction)  # Ensure non-negative prediction
            
        except Exception as e:
            print(f"❌ Error predicting {metric} usage: {e}")
            return 0.0
    
    def train_anomaly_detector(self, data: List[Dict], metric: str = 'electricity'):
        """Train anomaly detection model for unusual consumption patterns"""
        if len(data) < 20:
            print(f"⚠️ Not enough data to train {metric} anomaly detector (need at least 20 samples)")
            return False
        
        try:
            # Prepare data
            timestamps = [item['timestamp'] for item in data]
            values = [item['total_metrics'][metric] for item in data]
            
            # Create features (include value and time features)
            time_features = self.prepare_time_features(timestamps)
            X = np.column_stack([np.array(values).reshape(-1, 1), time_features])
            
            # Train isolation forest
            detector = IsolationForest(contamination=0.1, random_state=42)
            detector.fit(X)
            
            self.anomaly_detectors[metric] = detector
            
            print(f"✅ {metric.title()} anomaly detector trained successfully")
            return True
            
        except Exception as e:
            print(f"❌ Error training {metric} anomaly detector: {e}")
            return False
    
    def detect_anomaly(self, timestamp: str, value: float, metric: str = 'electricity') -> Dict:
        """Detect if current usage is anomalous"""
        try:
            if metric not in self.anomaly_detectors:
                return {'is_anomaly': False, 'confidence': 0.0}
            
            # Prepare features
            time_features = self.prepare_time_features([timestamp])
            X = np.column_stack([np.array([value]).reshape(-1, 1), time_features])
            
            # Predict anomaly
            prediction = self.anomaly_detectors[metric].predict(X)[0]
            score = self.anomaly_detectors[metric].score_samples(X)[0]
            
            is_anomaly = prediction == -1
            confidence = abs(score)
            
            return {
                'is_anomaly': is_anomaly,
                'confidence': round(confidence, 3),
                'severity': 'High' if confidence > 0.5 else 'Medium' if confidence > 0.2 else 'Low'
            }
            
        except Exception as e:
            print(f"❌ Error detecting anomaly for {metric}: {e}")
            return {'is_anomaly': False, 'confidence': 0.0}
    
    def generate_personalized_suggestions(self, user_data: Dict, campus_average: Dict) -> List[str]:
        """Generate personalized eco-friendly suggestions based on user behavior"""
        suggestions = []
        
        try:
            # Compare user metrics with campus average
            for metric in ['electricity', 'water', 'waste']:
                user_value = user_data.get(metric, 0)
                avg_value = campus_average.get(metric, 0)
                
                if avg_value > 0:
                    ratio = user_value / avg_value
                    
                    if ratio > 1.2:  # 20% above average
                        # Add specific suggestions for high usage
                        metric_suggestions = self.eco_suggestions.get(f'high_{metric}', [])
                        if metric_suggestions:
                            suggestions.append(random.choice(metric_suggestions))
                    elif ratio < 0.8:  # 20% below average
                        # Positive reinforcement for good performance
                        good_suggestions = self.eco_suggestions.get('good_performance', [])
                        if good_suggestions:
                            suggestions.append(random.choice(good_suggestions))
            
            # If no specific suggestions, add general tips
            if not suggestions:
                all_tips = []
                for category in ['high_electricity', 'high_water', 'high_waste']:
                    all_tips.extend(self.eco_suggestions[category])
                suggestions.append(random.choice(all_tips))
            
            # Limit to 3 suggestions maximum
            return suggestions[:3]
            
        except Exception as e:
            print(f"❌ Error generating suggestions: {e}")
            return ["🌱 Keep up the great work on sustainability!"]
    
    def calculate_carbon_footprint(self, electricity_kwh: float, water_liters: float, waste_kg: float) -> Dict:
        """Calculate estimated carbon footprint from resource usage"""
        try:
            # Carbon conversion factors (kg CO2 equivalent)
            electricity_factor = 0.5  # kg CO2 per kWh (varies by region)
            water_factor = 0.001      # kg CO2 per liter
            waste_factor = 0.5        # kg CO2 per kg waste
            
            carbon_electricity = electricity_kwh * electricity_factor
            carbon_water = water_liters * water_factor
            carbon_waste = waste_kg * waste_factor
            
            total_carbon = carbon_electricity + carbon_water + carbon_waste
            
            return {
                'total_co2_kg': round(total_carbon, 2),
                'electricity_co2': round(carbon_electricity, 2),
                'water_co2': round(carbon_water, 2),
                'waste_co2': round(carbon_waste, 2),
                'trees_equivalent': round(total_carbon / 21.8, 1)  # Trees needed to offset
            }
            
        except Exception as e:
            print(f"❌ Error calculating carbon footprint: {e}")
            return {'total_co2_kg': 0, 'trees_equivalent': 0}
    
    def update_models(self, new_data: List[Dict]):
        """Update models with new data"""
        try:
            # Add new data to historical data
            self.historical_data.extend(new_data)
            
            # Keep only recent data (last 1000 samples)
            if len(self.historical_data) > 1000:
                self.historical_data = self.historical_data[-1000:]
            
            # Retrain models if we have enough data
            if len(self.historical_data) >= 50:
                print("🔄 Updating ML models with new data...")
                
                for metric in ['electricity', 'water', 'waste']:
                    self.train_usage_forecasting_model(self.historical_data, metric)
                    self.train_anomaly_detector(self.historical_data, metric)
                
                print("✅ Model update completed")
            
        except Exception as e:
            print(f"❌ Error updating models: {e}")
    
    def get_insights_summary(self, recent_data: List[Dict]) -> Dict:
        """Generate comprehensive insights from recent data"""
        try:
            if not recent_data:
                return {}
            
            # Calculate trends
            electricity_trend = [item['total_metrics']['electricity'] for item in recent_data]
            water_trend = [item['total_metrics']['water'] for item in recent_data]
            waste_trend = [item['total_metrics']['waste'] for item in recent_data]
            
            # Calculate statistics
            insights = {
                'electricity': {
                    'current': electricity_trend[-1] if electricity_trend else 0,
                    'average': round(np.mean(electricity_trend), 2),
                    'trend': 'increasing' if len(electricity_trend) > 1 and electricity_trend[-1] > electricity_trend[0] else 'decreasing'
                },
                'water': {
                    'current': water_trend[-1] if water_trend else 0,
                    'average': round(np.mean(water_trend), 2),
                    'trend': 'increasing' if len(water_trend) > 1 and water_trend[-1] > water_trend[0] else 'decreasing'
                },
                'waste': {
                    'current': waste_trend[-1] if waste_trend else 0,
                    'average': round(np.mean(waste_trend), 2),
                    'trend': 'increasing' if len(waste_trend) > 1 and waste_trend[-1] > waste_trend[0] else 'decreasing'
                },
                'timestamp': datetime.now().isoformat()
            }
            
            return insights
            
        except Exception as e:
            print(f"❌ Error generating insights: {e}")
            return {}

def main():
    """Test the ML engine with sample data"""
    print("🤖 EcoVerse AI/ML Analytics Engine")
    print("==================================")
    
    # Initialize ML engine
    ml_engine = EcoVerseMlEngine()
    
    # Generate sample training data
    print("📊 Generating sample training data...")
    sample_data = []
    
    for i in range(100):
        timestamp = (datetime.now() - timedelta(hours=i)).isoformat()
        
        # Simulate realistic patterns
        hour = (datetime.now() - timedelta(hours=i)).hour
        base_electricity = 2000 + 500 * np.sin(2 * np.pi * hour / 24) + random.uniform(-200, 200)
        base_water = 8000 + 1000 * np.sin(2 * np.pi * hour / 24) + random.uniform(-500, 500)
        base_waste = 300 + 50 * np.sin(2 * np.pi * hour / 24) + random.uniform(-30, 30)
        
        sample_data.append({
            'timestamp': timestamp,
            'total_metrics': {
                'electricity': max(0, base_electricity),
                'water': max(0, base_water),
                'waste': max(0, base_waste)
            }
        })
    
    # Train models
    print("\n🔬 Training ML models...")
    for metric in ['electricity', 'water', 'waste']:
        ml_engine.train_usage_forecasting_model(sample_data, metric)
        ml_engine.train_anomaly_detector(sample_data, metric)
    
    # Test predictions
    print("\n🔮 Testing predictions...")
    test_timestamp = datetime.now().isoformat()
    
    for metric in ['electricity', 'water', 'waste']:
        prediction = ml_engine.predict_usage(test_timestamp, metric)
        print(f"Predicted {metric}: {prediction:.2f}")
    
    # Test anomaly detection
    print("\n🚨 Testing anomaly detection...")
    normal_value = 2000
    anomaly_value = 5000
    
    normal_result = ml_engine.detect_anomaly(test_timestamp, normal_value, 'electricity')
    anomaly_result = ml_engine.detect_anomaly(test_timestamp, anomaly_value, 'electricity')
    
    print(f"Normal value anomaly: {normal_result}")
    print(f"Anomalous value anomaly: {anomaly_result}")
    
    # Test suggestions
    print("\n💡 Testing personalized suggestions...")
    user_data = {'electricity': 2500, 'water': 9000, 'waste': 350}
    campus_avg = {'electricity': 2000, 'water': 8000, 'waste': 300}
    
    suggestions = ml_engine.generate_personalized_suggestions(user_data, campus_avg)
    for suggestion in suggestions:
        print(f"- {suggestion}")
    
    print("\n✅ ML Engine testing completed!")

if __name__ == "__main__":
    main()
