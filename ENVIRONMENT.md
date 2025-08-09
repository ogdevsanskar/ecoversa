# 🌿 EcoVerse Environment Variables Setup Guide

This comprehensive guide explains how to set up environment variables for the complete EcoVerse platform.

## 📁 Platform Structure

```
ecoversa/
├── web-app/              # React Frontend
│   ├── .env.example      # Template for frontend env vars
│   ├── .env.local        # Local development (gitignored)
│   └── .env.production   # Production template
├── ai-analytics/         # AI/ML Backend
│   ├── .env.example      # Template for AI backend env vars
│   └── .env              # Local development (gitignored)
├── iot-simulation/       # IoT Simulator
│   ├── .env.example      # Template for IoT env vars
│   └── .env              # Local development (gitignored)
└── setup-env.sh         # Automated setup script
```

## 🚀 Quick Setup

### Option 1: Automated Setup (Recommended)

Run the setup script to automatically create environment files:

```bash
chmod +x setup-env.sh
./setup-env.sh
```

### Option 2: Manual Setup

Copy example files and fill in your values:

```bash
# Frontend
cp web-app/.env.example web-app/.env.local

# AI/ML Backend
cp ai-analytics/.env.example ai-analytics/.env

# IoT Simulator
cp iot-simulation/.env.example iot-simulation/.env
```

## 🔧 Local Development Setup

### 1. Frontend Environment (`web-app/.env.local`)

```env
# Firebase Configuration (Required)
VITE_FIREBASE_API_KEY=your_firebase_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123def456

# Backend API URLs (Development)
VITE_AI_API_URL=http://localhost:5000
VITE_IOT_API_URL=http://localhost:8000

# App Configuration
VITE_APP_TITLE=EcoVerse
VITE_ENVIRONMENT=development
```

### 2. AI/ML Backend Environment (`ai-analytics/.env`)

```env
# Flask Configuration
FLASK_ENV=development
FLASK_APP=simple_api_server.py
FLASK_DEBUG=true
PORT=5000

# Firebase Configuration
FIREBASE_URL=https://your-project-default-rtdb.firebaseio.com
FIREBASE_PROJECT_ID=your-project-id

# AI/ML Settings
PREDICTION_CONFIDENCE_THRESHOLD=0.8
LOG_LEVEL=INFO
```

### 3. IoT Simulator Environment (`iot-simulation/.env`)

```env
# Simulation Configuration
SIMULATION_MODE=development
SIMULATION_INTERVAL=60
CAMPUS_BUILDINGS=7

# Firebase Configuration
FIREBASE_URL=https://your-project-default-rtdb.firebaseio.com
FIREBASE_PROJECT_ID=your-project-id

# Device Settings
DEVICE_COUNT=150
SENSOR_ACCURACY=0.95
PORT=8000
```

## 🔥 Firebase Setup

### Get Firebase Configuration

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create new project or select existing
3. Go to Project Settings → General
4. Scroll to "Your apps" → Add web app
5. Copy configuration values

### Required Firebase Services

Enable these services in Firebase Console:

- ✅ **Realtime Database**: Database → Create database
- ✅ **Authentication**: Authentication → Enable Email/Password
- ✅ **Storage**: Storage → Get started

## 🌐 Production Deployment (Render)

For complete Render deployment instructions, see: [`RENDER_ENVIRONMENT_GUIDE.md`](./RENDER_ENVIRONMENT_GUIDE.md)

### Quick Render Setup

#### Frontend Service (`ecoversa-web-app`)
```
Build Command: ./build.sh
Publish Directory: web-app/dist

Environment Variables:
VITE_FIREBASE_API_KEY=your_production_key
VITE_FIREBASE_AUTH_DOMAIN=your-prod-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-prod-project
VITE_AI_API_URL=https://ecoversa-ai-api.onrender.com
VITE_IOT_API_URL=https://ecoversa-iot-simulator.onrender.com
```

#### AI/ML API Service (`ecoversa-ai-api`)
```
Build Command: pip install -r ai-analytics/requirements.txt
Start Command: cd ai-analytics && python simple_api_server.py

Environment Variables:
FLASK_ENV=production
PORT=5000
FIREBASE_URL=https://your-prod-project-default-rtdb.firebaseio.com
```

#### IoT Simulator Service (`ecoversa-iot-simulator`)
```
Build Command: pip install -r iot-simulation/requirements.txt
Start Command: cd iot-simulation && python campus_simulator.py

Environment Variables:
SIMULATION_MODE=production
PORT=8000
FIREBASE_URL=https://your-prod-project-default-rtdb.firebaseio.com
```

## 🛠️ Development Workflow

### Starting All Services

```bash
# Terminal 1: Frontend
cd web-app && npm run dev

# Terminal 2: AI/ML API
cd ai-analytics && python simple_api_server.py

# Terminal 3: IoT Simulator
cd iot-simulation && python campus_simulator.py
```

### Verifying Setup

Visit these URLs to verify services are running:

- Frontend: http://localhost:5173
- AI/ML API: http://localhost:5000/health
- IoT Simulator: http://localhost:8000/status

## 🔒 Security Best Practices

### Development Security
- ✅ Use separate Firebase projects for dev/prod
- ✅ Never commit `.env*` files (already in `.gitignore`)
- ✅ Use test mode for Firebase services in development
- ✅ Regenerate keys if accidentally exposed

### Production Security
- ✅ Use production Firebase project with security rules
- ✅ Generate strong secret keys
- ✅ Enable Firebase Authentication
- ✅ Set up monitoring and alerts
- ✅ Regular key rotation

### Firebase Security Rules Example

```json
{
  "rules": {
    ".read": "auth != null",
    ".write": "auth != null",
    "campus_data": {
      ".read": true,
      ".write": "auth != null"
    },
    "public_metrics": {
      ".read": true,
      ".write": false
    }
  }
}
```

## 🐛 Troubleshooting

### Common Issues

#### Firebase Connection Errors
```bash
# Check Firebase config
echo $VITE_FIREBASE_PROJECT_ID
# Verify Firebase services are enabled
# Check browser console for errors
```

#### Service Communication Errors
```bash
# Verify backend services are running
curl http://localhost:5000/health
curl http://localhost:8000/status
# Check CORS configuration
```

#### Build Failures
```bash
# Check for missing environment variables
npm run build
# Look for VITE_ prefixed variables
printenv | grep VITE_
```

### Debug Commands

```bash
# Check all environment variables
printenv | grep -E "(VITE_|FIREBASE_|FLASK_)"

# Test Firebase connection
python -c "import os; print(os.getenv('FIREBASE_PROJECT_ID'))"

# Verify .env files exist
ls -la web-app/.env.local ai-analytics/.env iot-simulation/.env
```

## 📋 Environment Variables Checklist

### Frontend (Required)
- [ ] `VITE_FIREBASE_API_KEY`
- [ ] `VITE_FIREBASE_AUTH_DOMAIN`
- [ ] `VITE_FIREBASE_PROJECT_ID`
- [ ] `VITE_FIREBASE_STORAGE_BUCKET`
- [ ] `VITE_FIREBASE_MESSAGING_SENDER_ID`
- [ ] `VITE_FIREBASE_APP_ID`

### Backend Services (Required)
- [ ] `FIREBASE_URL`
- [ ] `FIREBASE_PROJECT_ID`
- [ ] `PORT` (5000 for AI, 8000 for IoT)
- [ ] `FLASK_ENV` (AI service only)

### Optional Enhancements
- [ ] External API keys (Weather, Carbon tracking)
- [ ] Database URLs (PostgreSQL, Redis)
- [ ] Monitoring and analytics IDs
- [ ] Custom domain configurations

## 🎯 Next Steps

1. **Complete Environment Setup**
   - Run `./setup-env.sh` or manually create `.env` files
   - Get Firebase configuration from console
   - Test all services locally

2. **Deploy to Production**
   - Follow [`RENDER_ENVIRONMENT_GUIDE.md`](./RENDER_ENVIRONMENT_GUIDE.md)
   - Set up production Firebase project
   - Configure environment variables in Render

3. **Monitor and Maintain**
   - Set up logging and monitoring
   - Regular security audits
   - Keep dependencies updated

Your EcoVerse platform is now ready for development and production deployment! 🌿
