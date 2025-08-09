import json
import numpy as np
from datetime import datetime, timedelta
import random
import math

class SimpleMLEngine:
    """Simplified ML engine without heavy dependencies for demonstration"""
    
    def __init__(self):
        self.models = {}
        self.data_cache = []
        print("✅ Simple ML Engine initialized successfully!")
    
    def train_usage_forecasting_model(self, data, metric):
        """Simple forecasting using moving averages"""
        try:
            values = [d['total_metrics'][metric] for d in data if metric in d.get('total_metrics', {})]
            if len(values) >= 5:
                # Store simple statistics
                self.models[f'{metric}_forecast'] = {
                    'mean': np.mean(values),
                    'std': np.std(values),
                    'trend': np.mean(np.diff(values[-10:])) if len(values) >= 10 else 0,
                    'trained_at': datetime.now().isoformat()
                }
                print(f"📈 Forecasting model trained for {metric}")
                return True
            return False
        except Exception as e:
            print(f"❌ Error training forecasting model: {e}")
            return False
    
    def train_anomaly_detector(self, data, metric):
        """Simple anomaly detection using statistical thresholds"""
        try:
            values = [d['total_metrics'][metric] for d in data if metric in d.get('total_metrics', {})]
            if len(values) >= 10:
                mean_val = np.mean(values)
                std_val = np.std(values)
                self.models[f'{metric}_anomaly'] = {
                    'mean': mean_val,
                    'std': std_val,
                    'threshold': 2.5,  # 2.5 standard deviations
                    'trained_at': datetime.now().isoformat()
                }
                print(f"🚨 Anomaly detector trained for {metric}")
                return True
            return False
        except Exception as e:
            print(f"❌ Error training anomaly detector: {e}")
            return False
    
    def predict_usage(self, timestamp, metric):
        """Predict future usage using simple trend analysis"""
        try:
            model_key = f'{metric}_forecast'
            if model_key not in self.models:
                return self._get_default_prediction(metric)
            
            model = self.models[model_key]
            
            # Parse timestamp
            target_time = datetime.fromisoformat(timestamp.replace('Z', '+00:00'))
            hour = target_time.hour
            
            # Base prediction with daily cycle
            base_value = model['mean']
            daily_variation = base_value * 0.3 * math.sin(2 * math.pi * hour / 24)
            trend_effect = model['trend'] * 24  # 24 hours ahead
            
            prediction = base_value + daily_variation + trend_effect
            
            # Add some realistic noise
            noise = random.uniform(-0.1, 0.1) * model['std']
            prediction += noise
            
            return max(0, prediction)  # Ensure non-negative
            
        except Exception as e:
            print(f"❌ Error predicting usage: {e}")
            return self._get_default_prediction(metric)
    
    def detect_anomaly(self, timestamp, value, metric):
        """Detect anomalies using statistical thresholds"""
        try:
            model_key = f'{metric}_anomaly'
            if model_key not in self.models:
                return {'is_anomaly': False, 'confidence': 0.0, 'reason': 'Model not trained'}
            
            model = self.models[model_key]
            
            # Calculate z-score
            z_score = abs(value - model['mean']) / model['std'] if model['std'] > 0 else 0
            
            is_anomaly = z_score > model['threshold']
            confidence = min(z_score / model['threshold'], 1.0) if is_anomaly else 0.0
            
            reason = f"Value {value:.1f} is {z_score:.2f} standard deviations from mean {model['mean']:.1f}"
            
            return {
                'is_anomaly': is_anomaly,
                'confidence': confidence,
                'reason': reason,
                'z_score': z_score,
                'threshold': model['threshold']
            }
            
        except Exception as e:
            print(f"❌ Error detecting anomaly: {e}")
            return {'is_anomaly': False, 'confidence': 0.0, 'reason': f'Error: {e}'}
    
    def generate_personalized_suggestions(self, user_metrics, campus_avg):
        """Generate personalized eco-friendly suggestions"""
        suggestions = []
        
        try:
            for metric, user_value in user_metrics.items():
                campus_value = campus_avg.get(metric, 0)
                
                if user_value > campus_value * 1.2:  # 20% above average
                    suggestions.extend(self._get_suggestions_for_metric(metric, 'high'))
                elif user_value < campus_value * 0.8:  # 20% below average
                    suggestions.extend(self._get_suggestions_for_metric(metric, 'low'))
                else:
                    suggestions.extend(self._get_suggestions_for_metric(metric, 'average'))
            
            # Add general suggestions
            suggestions.extend([
                {
                    'category': 'general',
                    'title': 'Daily Eco Challenge',
                    'description': 'Take small daily actions to reduce your environmental impact',
                    'impact': 'medium',
                    'difficulty': 'easy'
                }
            ])
            
            return suggestions[:5]  # Return top 5 suggestions
            
        except Exception as e:
            print(f"❌ Error generating suggestions: {e}")
            return []
    
    def calculate_carbon_footprint(self, electricity_kwh, water_liters, waste_kg):
        """Calculate carbon footprint from resource usage"""
        try:
            # Carbon emission factors (rough estimates)
            electricity_factor = 0.5  # kg CO2 per kWh
            water_factor = 0.001     # kg CO2 per liter
            waste_factor = 2.5       # kg CO2 per kg waste
            
            electricity_co2 = electricity_kwh * electricity_factor
            water_co2 = water_liters * water_factor
            waste_co2 = waste_kg * waste_factor
            
            total_co2 = electricity_co2 + water_co2 + waste_co2
            
            return {
                'total_co2_kg': round(total_co2, 2),
                'breakdown': {
                    'electricity': round(electricity_co2, 2),
                    'water': round(water_co2, 2),
                    'waste': round(waste_co2, 2)
                },
                'equivalent': {
                    'trees_needed': round(total_co2 / 22, 1),  # Trees to offset per year
                    'car_miles': round(total_co2 / 0.4, 1)     # Equivalent car miles
                }
            }
            
        except Exception as e:
            print(f"❌ Error calculating carbon footprint: {e}")
            return {'total_co2_kg': 0, 'breakdown': {}, 'equivalent': {}}
    
    def get_insights_summary(self, data):
        """Generate insights summary from recent data"""
        try:
            if not data:
                return {'message': 'No data available for insights'}
            
            # Calculate basic statistics
            metrics = ['electricity', 'water', 'waste']
            insights = {
                'usage_patterns': {},
                'efficiency_scores': {},
                'trends': {},
                'summary': 'Based on recent campus data analysis'
            }
            
            for metric in metrics:
                values = [d['total_metrics'][metric] for d in data if metric in d.get('total_metrics', {})]
                
                if len(values) >= 2:
                    current = values[-1]
                    previous = np.mean(values[:-1])
                    
                    trend = 'increasing' if current > previous * 1.05 else 'decreasing' if current < previous * 0.95 else 'stable'
                    efficiency = max(0, min(100, 100 - (current - previous) / previous * 100)) if previous > 0 else 50
                    
                    insights['usage_patterns'][metric] = {
                        'current': round(current, 2),
                        'average': round(previous, 2),
                        'trend': trend
                    }
                    
                    insights['efficiency_scores'][metric] = round(efficiency, 1)
                    insights['trends'][metric] = trend
            
            return insights
            
        except Exception as e:
            print(f"❌ Error generating insights: {e}")
            return {'error': str(e)}
    
    def update_models(self, data):
        """Update all models with new data"""
        try:
            metrics = ['electricity', 'water', 'waste']
            for metric in metrics:
                self.train_usage_forecasting_model(data, metric)
                self.train_anomaly_detector(data, metric)
            print("🔄 Models updated successfully")
        except Exception as e:
            print(f"❌ Error updating models: {e}")
    
    def _get_default_prediction(self, metric):
        """Return default prediction when model is not available"""
        defaults = {
            'electricity': 2000,
            'water': 8000,
            'waste': 300
        }
        return defaults.get(metric, 1000)
    
    def _get_suggestions_for_metric(self, metric, performance):
        """Get suggestions based on metric and performance level"""
        suggestions_db = {
            'electricity': {
                'high': [
                    {
                        'category': 'electricity',
                        'title': 'Reduce Peak Hour Usage',
                        'description': 'Shift non-essential activities to off-peak hours',
                        'impact': 'high',
                        'difficulty': 'medium'
                    }
                ],
                'average': [
                    {
                        'category': 'electricity',
                        'title': 'LED Light Upgrade',
                        'description': 'Replace remaining incandescent bulbs with LED alternatives',
                        'impact': 'medium',
                        'difficulty': 'easy'
                    }
                ],
                'low': [
                    {
                        'category': 'electricity',
                        'title': 'Share Best Practices',
                        'description': 'Help others learn from your energy-saving success',
                        'impact': 'community',
                        'difficulty': 'easy'
                    }
                ]
            },
            'water': {
                'high': [
                    {
                        'category': 'water',
                        'title': 'Fix Water Leaks',
                        'description': 'Check and repair any leaky faucets or pipes',
                        'impact': 'high',
                        'difficulty': 'medium'
                    }
                ],
                'average': [
                    {
                        'category': 'water',
                        'title': 'Shorter Showers',
                        'description': 'Reduce shower time by 2-3 minutes',
                        'impact': 'medium',
                        'difficulty': 'easy'
                    }
                ],
                'low': [
                    {
                        'category': 'water',
                        'title': 'Water Conservation Champion',
                        'description': 'Mentor others in water-saving techniques',
                        'impact': 'community',
                        'difficulty': 'easy'
                    }
                ]
            },
            'waste': {
                'high': [
                    {
                        'category': 'waste',
                        'title': 'Implement Composting',
                        'description': 'Start composting organic waste',
                        'impact': 'high',
                        'difficulty': 'medium'
                    }
                ],
                'average': [
                    {
                        'category': 'waste',
                        'title': 'Reduce Single-Use Items',
                        'description': 'Use reusable containers and utensils',
                        'impact': 'medium',
                        'difficulty': 'easy'
                    }
                ],
                'low': [
                    {
                        'category': 'waste',
                        'title': 'Zero Waste Mentor',
                        'description': 'Guide others in waste reduction strategies',
                        'impact': 'community',
                        'difficulty': 'easy'
                    }
                ]
            }
        }
        
        return suggestions_db.get(metric, {}).get(performance, [])
