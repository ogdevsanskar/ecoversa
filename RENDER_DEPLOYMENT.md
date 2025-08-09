# EcoVerse - Complete Platform Deployment on Render

This guide explains how to deploy the complete EcoVerse platform including frontend, AI/ML backend, and IoT simulation services to Render.

## 🚀 Platform Architecture

EcoVerse consists of three main services:

1. **Frontend Web App** - React + Vite (Static Site)
2. **AI/ML Analytics API** - Flask Python service 
3. **IoT Data Simulator** - Python background service

## Prerequisites

1. ✅ GitHub repository: https://github.com/ogdevsanskar/ecoversa.git
2. ✅ Render account: https://render.com
3. ✅ Firebase project for real-time data

## 🔧 Deployment Steps

### Step 1: Deploy Frontend (Static Site)

1. **Go to Render Dashboard** → "New +" → "Static Site"
2. **Connect Repository**: `ogdevsanskar/ecoversa`
3. **Configure Settings**:
   - **Name**: `ecoversa-web-app`
   - **Branch**: `main`
   - **Build Command**: `./build.sh`
   - **Publish Directory**: `web-app/dist`

4. **Environment Variables** (Required):
   ```
   VITE_FIREBASE_API_KEY=your_api_key_here
   VITE_FIREBASE_AUTH_DOMAIN=ecoversa.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=ecoversa-prod
   VITE_FIREBASE_STORAGE_BUCKET=ecoversa-prod.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
   VITE_FIREBASE_APP_ID=1:123456789:web:abc123
   ```

### Step 2: Deploy AI/ML Analytics API

1. **Go to Render Dashboard** → "New +" → "Web Service"
2. **Connect Repository**: `ogdevsanskar/ecoversa`
3. **Configure Settings**:
   - **Name**: `ecoversa-ai-api`
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install -r ai-analytics/requirements.txt`
   - **Start Command**: `cd ai-analytics && python simple_api_server.py`
   - **Plan**: `Starter` (or higher for production)

4. **Environment Variables**:
   ```
   FLASK_ENV=production
   FLASK_APP=simple_api_server.py
   PORT=5000
   ```

### Step 3: Deploy IoT Simulation Service

1. **Go to Render Dashboard** → "New +" → "Web Service"
2. **Connect Repository**: `ogdevsanskar/ecoversa`
3. **Configure Settings**:
   - **Name**: `ecoversa-iot-simulator`
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install -r iot-simulation/requirements.txt`
   - **Start Command**: `cd iot-simulation && python campus_simulator.py`
   - **Plan**: `Starter`

4. **Environment Variables**:
   ```
   SIMULATION_MODE=production
   PORT=8000
   FIREBASE_URL=https://your-project.firebaseio.com
   ```

## 🌐 Service URLs

After deployment, your services will be available at:

- **Frontend**: `https://ecoversa-web-app.onrender.com`
- **AI/ML API**: `https://ecoversa-ai-api.onrender.com`
- **IoT Simulator**: `https://ecoversa-iot-simulator.onrender.com`

## 🔗 API Endpoints

### AI/ML Analytics API

- `GET /health` - Health check
- `GET /api/predict` - Energy usage predictions
- `GET /api/anomaly` - Anomaly detection
- `GET /api/suggestions` - Personalized suggestions
- `GET /api/metrics` - Real-time campus metrics

### IoT Simulation API

- `GET /status` - Simulator status
- `GET /data` - Current campus data
- `POST /start` - Start simulation
- `POST /stop` - Stop simulation

## 🛠 Environment Configuration

### Frontend (.env)
```
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_AI_API_URL=https://ecoversa-ai-api.onrender.com
VITE_IOT_API_URL=https://ecoversa-iot-simulator.onrender.com
```

### Backend Services (.env)
```
FLASK_ENV=production
SIMULATION_MODE=production
FIREBASE_URL=https://your-project.firebaseio.com
DATABASE_URL=your_database_url_if_needed
```

## 🔄 Automatic Deployments

Render automatically deploys when you push to the main branch. The platform includes:

- ✅ **Frontend**: Modern React + Vite build
- ✅ **AI/ML Engine**: Lightweight ML without heavy dependencies
- ✅ **IoT Simulator**: Real-time campus data generation
- ✅ **API Integration**: RESTful services with CORS enabled
- ✅ **Real-time Data**: Firebase integration for live updates

## 🚨 Troubleshooting

### Build Issues
1. Check build logs in Render dashboard
2. Verify all `requirements.txt` files are present
3. Ensure Python version compatibility (3.9+)

### Runtime Issues
1. Check service logs for errors
2. Verify environment variables are set correctly
3. Ensure Firebase configuration is valid

### Connectivity Issues
1. Verify CORS is enabled for cross-origin requests
2. Check API endpoint URLs in frontend configuration
3. Ensure services are running on correct ports

## 📊 Platform Features

### Frontend Features
- 🎨 Modern UI with Chakra UI v3
- 📱 Responsive design for all devices
- 🔥 Firebase real-time data integration
- 📈 Interactive analytics dashboard
- 🎯 Gamification and leaderboards

### AI/ML Features
- 🤖 Energy usage predictions
- 🔍 Anomaly detection
- 💡 Personalized suggestions
- 📊 Real-time analytics
- 🎛 Campus metrics monitoring

### IoT Features
- 🏢 Multi-building simulation
- ⚡ Energy consumption tracking
- 💧 Water usage monitoring
- 🗑 Waste generation analytics
- 📡 Real-time data streaming

## 🎉 Deployment Complete!

Your complete EcoVerse platform is now live with:

1. ✅ **Frontend deployed** and accessible
2. ✅ **AI/ML API running** with all endpoints
3. ✅ **IoT simulation active** generating campus data
4. ✅ **Real-time integration** between all services

Visit your frontend URL to start using the platform!