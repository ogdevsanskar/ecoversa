from flask import Flask, jsonify, request
from flask_cors import CORS
import json
import os
import sys
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from simple_ml_engine import SimpleMLEngine
from datetime import datetime, timedelta
import threading
import time
import random
import math

app = Flask(__name__)
CORS(app)

# Initialize ML Engine
ml_engine = SimpleMLEngine()

# Global data storage (in production, use proper database)
campus_data_history = []
ml_models_trained = False

def generate_sample_data():
    """Generate realistic sample data for demonstration"""
    sample_data = []
    
    for hours_ago in range(168, 0, -1):  # 7 days * 24 hours
        timestamp = (datetime.now() - timedelta(hours=hours_ago)).isoformat()
        hour = (datetime.now() - timedelta(hours=hours_ago)).hour
        
        # Generate realistic patterns with daily cycles
        base_electricity = 2000 + 800 * math.sin(2 * math.pi * hour / 24) + random.uniform(-300, 300)
        base_water = 8000 + 2000 * math.sin(2 * math.pi * hour / 24) + random.uniform(-800, 800)
        base_waste = 300 + 100 * math.sin(2 * math.pi * hour / 24) + random.uniform(-50, 50)
        
        sample_point = {
            'timestamp': timestamp,
            'total_metrics': {
                'electricity': max(100, base_electricity),
                'water': max(500, base_water),
                'waste': max(10, base_waste)
            }
        }
        
        sample_data.append(sample_point)
    
    return sample_data

def load_sample_data():
    """Load sample data to train initial models"""
    global campus_data_history, ml_models_trained
    
    print("🔄 Loading sample data for ML training...")
    
    # Generate sample data
    campus_data_history = generate_sample_data()
    
    # Train models
    print("🤖 Training initial ML models...")
    for metric in ['electricity', 'water', 'waste']:
        ml_engine.train_usage_forecasting_model(campus_data_history, metric)
        ml_engine.train_anomaly_detector(campus_data_history, metric)
    
    ml_models_trained = True
    print("✅ ML models trained successfully!")

@app.route('/', methods=['GET'])
def root():
    """Root endpoint with API information"""
    return jsonify({
        'service': 'EcoVerse AI/ML Analytics API',
        'status': 'running',
        'version': '1.0.0',
        'description': 'AI-powered sustainability analytics for smart campus management',
        'endpoints': {
            'health': '/api/health',
            'predictions': '/api/predict/<metric>',
            'anomaly_detection': '/api/anomaly/check',
            'sustainability_insights': '/api/insights',
            'carbon_footprint': '/api/carbon-footprint',
            'suggestions': '/api/suggestions',
            'status': '/api/status',
            'demo': '/api/demo/simulate'
        },
        'documentation': '/api/status'
    })

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'ml_models_trained': ml_models_trained,
        'data_points': len(campus_data_history),
        'timestamp': datetime.now().isoformat(),
        'engine': 'SimpleMLEngine',
        'version': '1.0.0'
    })

@app.route('/api/predict/<metric>', methods=['GET'])
def predict_usage(metric):
    """Predict future usage for a specific metric"""
    try:
        # Get timestamp from query params or use current time + 1 hour
        timestamp = request.args.get('timestamp')
        if not timestamp:
            timestamp = (datetime.now() + timedelta(hours=1)).isoformat()
        
        if not ml_models_trained:
            return jsonify({'error': 'ML models not trained yet'}), 400
        
        prediction = ml_engine.predict_usage(timestamp, metric)
        
        return jsonify({
            'metric': metric,
            'timestamp': timestamp,
            'predicted_value': round(prediction, 2),
            'unit': 'kWh' if metric == 'electricity' else 'L' if metric == 'water' else 'kg',
            'confidence': 0.85  # Simulated confidence score
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/anomaly/check', methods=['POST'])
def check_anomaly():
    """Check if current usage is anomalous"""
    try:
        data = request.get_json()
        
        if not data or 'metric' not in data or 'value' not in data:
            return jsonify({'error': 'Missing required fields: metric, value'}), 400
        
        metric = data['metric']
        value = data['value']
        timestamp = data.get('timestamp', datetime.now().isoformat())
        
        if not ml_models_trained:
            return jsonify({'error': 'ML models not trained yet'}), 400
        
        anomaly_result = ml_engine.detect_anomaly(timestamp, value, metric)
        
        return jsonify({
            'metric': metric,
            'value': value,
            'timestamp': timestamp,
            'anomaly_detection': anomaly_result
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/suggestions', methods=['POST'])
def get_suggestions():
    """Get personalized eco-friendly suggestions"""
    try:
        data = request.get_json()
        
        if not data or 'user_metrics' not in data:
            return jsonify({'error': 'Missing user_metrics'}), 400
        
        user_metrics = data['user_metrics']
        
        # Calculate campus average from recent data
        if campus_data_history:
            recent_data = campus_data_history[-24:]  # Last 24 hours
            campus_avg = {
                'electricity': sum(d['total_metrics']['electricity'] for d in recent_data) / len(recent_data),
                'water': sum(d['total_metrics']['water'] for d in recent_data) / len(recent_data),
                'waste': sum(d['total_metrics']['waste'] for d in recent_data) / len(recent_data)
            }
        else:
            campus_avg = {'electricity': 2000, 'water': 8000, 'waste': 300}
        
        suggestions = ml_engine.generate_personalized_suggestions(user_metrics, campus_avg)
        
        return jsonify({
            'suggestions': suggestions,
            'user_metrics': user_metrics,
            'campus_average': campus_avg,
            'timestamp': datetime.now().isoformat()
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/carbon-footprint', methods=['POST'])
def calculate_carbon_footprint():
    """Calculate carbon footprint from resource usage"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'Missing usage data'}), 400
        
        electricity = data.get('electricity', 0)
        water = data.get('water', 0)
        waste = data.get('waste', 0)
        
        carbon_data = ml_engine.calculate_carbon_footprint(electricity, water, waste)
        
        return jsonify({
            'usage': {
                'electricity_kwh': electricity,
                'water_liters': water,
                'waste_kg': waste
            },
            'carbon_footprint': carbon_data,
            'timestamp': datetime.now().isoformat()
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/insights', methods=['GET'])
def get_insights():
    """Get comprehensive analytics insights"""
    try:
        # Get recent data (last 24 hours or available data)
        hours = int(request.args.get('hours', 24))
        recent_data = campus_data_history[-hours:] if len(campus_data_history) >= hours else campus_data_history
        
        insights = ml_engine.get_insights_summary(recent_data)
        
        # Add predictions for next few hours
        predictions = {}
        for metric in ['electricity', 'water', 'waste']:
            if ml_models_trained:
                next_hour = (datetime.now() + timedelta(hours=1)).isoformat()
                predictions[metric] = ml_engine.predict_usage(next_hour, metric)
        
        return jsonify({
            'insights': insights,
            'predictions_next_hour': predictions,
            'data_period_hours': hours,
            'total_data_points': len(campus_data_history),
            'timestamp': datetime.now().isoformat()
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/data/add', methods=['POST'])
def add_data_point():
    """Add new data point for model training"""
    try:
        data = request.get_json()
        
        if not data or 'total_metrics' not in data:
            return jsonify({'error': 'Missing total_metrics'}), 400
        
        # Add timestamp if not provided
        if 'timestamp' not in data:
            data['timestamp'] = datetime.now().isoformat()
        
        # Add to history
        campus_data_history.append(data)
        
        # Keep only recent data (last 1000 points)
        if len(campus_data_history) > 1000:
            campus_data_history[:] = campus_data_history[-1000:]
        
        # Update models periodically
        if len(campus_data_history) % 50 == 0:
            print("🔄 Updating ML models with new data...")
            threading.Thread(target=ml_engine.update_models, args=(campus_data_history,)).start()
        
        return jsonify({
            'status': 'success',
            'data_points_total': len(campus_data_history),
            'timestamp': data['timestamp']
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/status', methods=['GET'])
def get_status():
    """Get system status and statistics"""
    try:
        # Calculate recent statistics
        recent_24h = campus_data_history[-24:] if len(campus_data_history) >= 24 else campus_data_history
        
        if recent_24h:
            avg_electricity = sum(d['total_metrics']['electricity'] for d in recent_24h) / len(recent_24h)
            avg_water = sum(d['total_metrics']['water'] for d in recent_24h) / len(recent_24h)
            avg_waste = sum(d['total_metrics']['waste'] for d in recent_24h) / len(recent_24h)
        else:
            avg_electricity = avg_water = avg_waste = 0
        
        return jsonify({
            'system_status': 'operational',
            'ml_engine': 'SimpleMLEngine',
            'ml_models_trained': ml_models_trained,
            'total_data_points': len(campus_data_history),
            'recent_24h_averages': {
                'electricity': round(avg_electricity, 2),
                'water': round(avg_water, 2),
                'waste': round(avg_waste, 2)
            },
            'available_endpoints': [
                '/api/health',
                '/api/predict/<metric>',
                '/api/anomaly/check',
                '/api/suggestions',
                '/api/carbon-footprint',
                '/api/insights',
                '/api/data/add',
                '/api/status'
            ],
            'timestamp': datetime.now().isoformat()
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/demo/simulate', methods=['POST'])
def simulate_data():
    """Generate and add simulated campus data for demonstration"""
    try:
        count = int(request.args.get('count', 1))
        
        new_data_points = []
        for i in range(count):
            timestamp = (datetime.now() + timedelta(minutes=i)).isoformat()
            hour = datetime.now().hour
            
            # Generate realistic data with some variation
            base_electricity = 2000 + 800 * math.sin(2 * math.pi * hour / 24) + random.uniform(-300, 300)
            base_water = 8000 + 2000 * math.sin(2 * math.pi * hour / 24) + random.uniform(-800, 800)
            base_waste = 300 + 100 * math.sin(2 * math.pi * hour / 24) + random.uniform(-50, 50)
            
            data_point = {
                'timestamp': timestamp,
                'total_metrics': {
                    'electricity': max(100, base_electricity),
                    'water': max(500, base_water),
                    'waste': max(10, base_waste)
                }
            }
            
            campus_data_history.append(data_point)
            new_data_points.append(data_point)
        
        return jsonify({
            'status': 'success',
            'generated_points': count,
            'total_data_points': len(campus_data_history),
            'sample_data': new_data_points[:3],  # Return first 3 as sample
            'timestamp': datetime.now().isoformat()
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

def initialize_system():
    """Initialize the ML system with sample data"""
    load_sample_data()

if __name__ == '__main__':
    print("🚀 Starting EcoVerse AI/ML Analytics API")
    print("=====================================")
    print("🔗 API will be available at: http://localhost:5000")
    print("📚 API Documentation: http://localhost:5000/api/status")
    print("🧪 Demo endpoints available for testing")
    print("")
    
    # Initialize system in a separate thread
    threading.Thread(target=initialize_system).start()
    
    # Start Flask app
    app.run(host='0.0.0.0', port=5000, debug=True)
