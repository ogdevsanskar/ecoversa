"""
EcoVerse IoT Simulation API
Flask web service for IoT data simulation and management
"""

from flask import Flask, jsonify, request
from flask_cors import CORS
import threading
import time
import json
from datetime import datetime
import os
from campus_simulator import CampusDataSimulator

app = Flask(__name__)
CORS(app)

# Global simulator instance
simulator = None
simulation_thread = None
simulation_active = False

@app.route('/', methods=['GET'])
def root():
    """Root endpoint with API information"""
    return jsonify({
        'service': 'EcoVerse IoT Simulation API',
        'status': 'running',
        'version': '1.0.0',
        'description': 'IoT data simulation service for smart campus resource monitoring',
        'endpoints': {
            'health': '/api/health',
            'start_simulation': '/api/simulation/start',
            'stop_simulation': '/api/simulation/stop',
            'status': '/api/simulation/status',
            'current_data': '/api/data/current',
            'generate_snapshot': '/api/data/snapshot',
            'buildings': '/api/buildings'
        },
        'simulation_status': 'active' if simulation_active else 'inactive'
    })

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'service': 'EcoVerse IoT Simulation API',
        'timestamp': datetime.now().isoformat(),
        'simulation_active': simulation_active
    })

@app.route('/api/buildings', methods=['GET'])
def get_buildings():
    """Get list of monitored buildings"""
    global simulator
    if not simulator:
        simulator = CampusDataSimulator()
    
    return jsonify({
        'buildings': simulator.buildings,
        'building_profiles': simulator.building_profiles,
        'total_buildings': len(simulator.buildings)
    })

@app.route('/api/data/snapshot', methods=['GET'])
def generate_data_snapshot():
    """Generate a single data snapshot"""
    global simulator
    if not simulator:
        simulator = CampusDataSimulator()
    
    try:
        campus_data = simulator.generate_campus_snapshot()
        return jsonify({
            'success': True,
            'data': campus_data,
            'generated_at': datetime.now().isoformat()
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e),
            'timestamp': datetime.now().isoformat()
        }), 500

@app.route('/api/data/current', methods=['GET'])
def get_current_data():
    """Get current simulation data"""
    global simulator
    if not simulator:
        return jsonify({
            'success': False,
            'error': 'Simulator not initialized'
        }), 400
    
    if not simulation_active:
        return jsonify({
            'success': False,
            'error': 'Simulation not active. Start simulation first.'
        }), 400
    
    # Generate fresh data
    campus_data = simulator.generate_campus_snapshot()
    return jsonify({
        'success': True,
        'data': campus_data,
        'simulation_active': simulation_active
    })

@app.route('/api/simulation/start', methods=['POST'])
def start_simulation():
    """Start the IoT data simulation"""
    global simulator, simulation_thread, simulation_active
    
    if simulation_active:
        return jsonify({
            'success': False,
            'message': 'Simulation already running',
            'status': 'active'
        }), 400
    
    try:
        # Get interval from request (default 300 seconds = 5 minutes)
        data = request.get_json() or {}
        interval = data.get('interval_seconds', 300)
        
        if not simulator:
            simulator = CampusDataSimulator()
        
        # Start simulation in background thread
        def run_simulation():
            global simulation_active
            simulation_active = True
            simulator.simulate_realtime_data(interval_seconds=interval)
            simulation_active = False
        
        simulation_thread = threading.Thread(target=run_simulation, daemon=True)
        simulation_thread.start()
        
        return jsonify({
            'success': True,
            'message': 'IoT simulation started successfully',
            'interval_seconds': interval,
            'buildings_monitored': len(simulator.buildings),
            'status': 'active'
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e),
            'timestamp': datetime.now().isoformat()
        }), 500

@app.route('/api/simulation/stop', methods=['POST'])
def stop_simulation():
    """Stop the IoT data simulation"""
    global simulator, simulation_active
    
    if not simulation_active:
        return jsonify({
            'success': False,
            'message': 'Simulation not running',
            'status': 'inactive'
        }), 400
    
    try:
        if simulator:
            simulator.stop()
            simulation_active = False
        
        return jsonify({
            'success': True,
            'message': 'IoT simulation stopped successfully',
            'status': 'inactive',
            'timestamp': datetime.now().isoformat()
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e),
            'timestamp': datetime.now().isoformat()
        }), 500

@app.route('/api/simulation/status', methods=['GET'])
def simulation_status():
    """Get simulation status and statistics"""
    global simulator, simulation_active
    
    status_info = {
        'simulation_active': simulation_active,
        'simulator_initialized': simulator is not None,
        'timestamp': datetime.now().isoformat()
    }
    
    if simulator:
        status_info.update({
            'buildings_monitored': len(simulator.buildings),
            'buildings': simulator.buildings,
            'firebase_url': simulator.firebase_url
        })
    
    return jsonify(status_info)

@app.route('/api/demo/start', methods=['POST'])
def start_demo():
    """Start a short demo simulation (30-second intervals for 5 minutes)"""
    global simulator, simulation_thread, simulation_active
    
    if simulation_active:
        return jsonify({
            'success': False,
            'message': 'Simulation already running',
            'status': 'active'
        }), 400
    
    try:
        if not simulator:
            simulator = CampusDataSimulator()
        
        # Demo: 30-second intervals for 5 minutes (10 data points)
        def run_demo():
            global simulation_active
            simulation_active = True
            demo_count = 0
            max_demo_cycles = 10
            
            while simulation_active and demo_count < max_demo_cycles:
                campus_data = simulator.generate_campus_snapshot()
                simulator.send_to_firebase(campus_data)
                demo_count += 1
                
                if demo_count < max_demo_cycles:
                    time.sleep(30)  # 30-second intervals
            
            simulation_active = False
        
        simulation_thread = threading.Thread(target=run_demo, daemon=True)
        simulation_thread.start()
        
        return jsonify({
            'success': True,
            'message': 'Demo simulation started (30s intervals, 5 minutes)',
            'demo_duration': '5 minutes',
            'interval_seconds': 30,
            'data_points': 10,
            'status': 'active'
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e),
            'timestamp': datetime.now().isoformat()
        }), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    debug = os.environ.get('FLASK_DEBUG', 'False').lower() == 'true'
    
    print("🌱 EcoVerse IoT Simulation API Starting...")
    print(f"🚀 Server running on port {port}")
    print(f"🔧 Debug mode: {debug}")
    
    app.run(host='0.0.0.0', port=port, debug=debug)
