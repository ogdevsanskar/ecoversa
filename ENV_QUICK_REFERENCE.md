# 🚀 EcoVerse Environment Variables Quick Reference

## 📋 Required for Render Deployment

### 🌐 Frontend Service: `ecoversa-web-app`

**Service Type**: Static Site  
**Build Command**: `./build.sh`  
**Publish Directory**: `web-app/dist`

| Variable | Example Value | Required |
|----------|---------------|----------|
| `VITE_FIREBASE_API_KEY` | `AIzaSyC1234567890abcdef` | ✅ |
| `VITE_FIREBASE_AUTH_DOMAIN` | `ecoversa-prod.firebaseapp.com` | ✅ |
| `VITE_FIREBASE_PROJECT_ID` | `ecoversa-prod` | ✅ |
| `VITE_FIREBASE_STORAGE_BUCKET` | `ecoversa-prod.appspot.com` | ✅ |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | `123456789012` | ✅ |
| `VITE_FIREBASE_APP_ID` | `1:123456789012:web:abc123def456` | ✅ |
| `VITE_AI_API_URL` | `https://ecoversa-ai-api.onrender.com` | ✅ |
| `VITE_IOT_API_URL` | `https://ecoversa-iot-simulator.onrender.com` | ✅ |

### 🤖 AI/ML API Service: `ecoversa-ai-api`

**Service Type**: Web Service  
**Runtime**: Python 3  
**Build Command**: `pip install -r ai-analytics/requirements.txt`  
**Start Command**: `cd ai-analytics && python simple_api_server.py`

| Variable | Example Value | Required |
|----------|---------------|----------|
| `FLASK_ENV` | `production` | ✅ |
| `FLASK_APP` | `simple_api_server.py` | ✅ |
| `PORT` | `5000` | ✅ |
| `FIREBASE_URL` | `https://ecoversa-prod-default-rtdb.firebaseio.com` | ✅ |
| `FIREBASE_PROJECT_ID` | `ecoversa-prod` | ✅ |

### 🏢 IoT Simulator Service: `ecoversa-iot-simulator`

**Service Type**: Web Service  
**Runtime**: Python 3  
**Build Command**: `pip install -r iot-simulation/requirements.txt`  
**Start Command**: `cd iot-simulation && python campus_simulator.py`

| Variable | Example Value | Required |
|----------|---------------|----------|
| `SIMULATION_MODE` | `production` | ✅ |
| `PORT` | `8000` | ✅ |
| `FIREBASE_URL` | `https://ecoversa-prod-default-rtdb.firebaseio.com` | ✅ |
| `FIREBASE_PROJECT_ID` | `ecoversa-prod` | ✅ |

## 🔥 Get Firebase Values

1. **Go to**: [Firebase Console](https://console.firebase.google.com/)
2. **Create/Select**: Your project
3. **Navigate**: Project Settings → General → Your apps
4. **Copy**: Configuration object values

```javascript
// Firebase Config Object
{
  apiKey: "...",              // → VITE_FIREBASE_API_KEY
  authDomain: "...",          // → VITE_FIREBASE_AUTH_DOMAIN  
  projectId: "...",           // → VITE_FIREBASE_PROJECT_ID
  storageBucket: "...",       // → VITE_FIREBASE_STORAGE_BUCKET
  messagingSenderId: "...",   // → VITE_FIREBASE_MESSAGING_SENDER_ID
  appId: "..."               // → VITE_FIREBASE_APP_ID
}
```

## ⚡ Quick Setup Commands

```bash
# 1. Get Firebase config from console
# 2. In Render dashboard, add environment variables for each service
# 3. Deploy services

# Local development setup:
./setup-env.sh
```

## 🎯 Service URLs After Deployment

- **Frontend**: `https://ecoversa-web-app.onrender.com`
- **AI/ML API**: `https://ecoversa-ai-api.onrender.com`
- **IoT Simulator**: `https://ecoversa-iot-simulator.onrender.com`

## 🔧 Testing Endpoints

```bash
# Test AI/ML API
curl https://ecoversa-ai-api.onrender.com/health

# Test IoT Simulator  
curl https://ecoversa-iot-simulator.onrender.com/status

# Test Frontend
open https://ecoversa-web-app.onrender.com
```

For complete setup instructions, see:
- [`ENVIRONMENT.md`](./ENVIRONMENT.md) - Comprehensive setup guide
- [`RENDER_ENVIRONMENT_GUIDE.md`](./RENDER_ENVIRONMENT_GUIDE.md) - Detailed Render deployment
- [`RENDER_DEPLOYMENT.md`](./RENDER_DEPLOYMENT.md) - Deployment overview
