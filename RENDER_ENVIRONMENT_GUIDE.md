# 🌐 Render Environment Variables Setup Guide

This document provides complete instructions for setting up environment variables in Render for the EcoVerse platform.

## 📋 Service Overview

The EcoVerse platform consists of 3 services that need environment variables:

1. **Frontend (Static Site)** - `ecoversa-web-app`
2. **AI/ML API (Web Service)** - `ecoversa-ai-api`
3. **IoT Simulator (Web Service)** - `ecoversa-iot-simulator`

## 🔧 Service 1: Frontend (Static Site)

### Required Environment Variables

Go to your Render dashboard → `ecoversa-web-app` → Environment tab → Add these variables:

| Variable Name | Example Value | Description |
|---------------|---------------|-------------|
| `VITE_FIREBASE_API_KEY` | `AIzaSyC1234567890abcdef` | Firebase API key from Firebase console |
| `VITE_FIREBASE_AUTH_DOMAIN` | `ecoversa-prod.firebaseapp.com` | Firebase auth domain |
| `VITE_FIREBASE_PROJECT_ID` | `ecoversa-prod` | Firebase project ID |
| `VITE_FIREBASE_STORAGE_BUCKET` | `ecoversa-prod.appspot.com` | Firebase storage bucket |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | `123456789012` | Firebase messaging sender ID |
| `VITE_FIREBASE_APP_ID` | `1:123456789012:web:abc123def456` | Firebase app ID |
| `VITE_AI_API_URL` | `https://ecoversa-ai-api.onrender.com` | AI/ML API service URL |
| `VITE_IOT_API_URL` | `https://ecoversa-iot-simulator.onrender.com` | IoT simulator service URL |
| `VITE_APP_TITLE` | `EcoVerse` | Application title |
| `VITE_APP_VERSION` | `1.0.0` | Application version |
| `VITE_ENVIRONMENT` | `production` | Environment name |

### Optional Environment Variables

| Variable Name | Example Value | Description |
|---------------|---------------|-------------|
| `VITE_ENABLE_CHAT` | `true` | Enable chat features |
| `VITE_ENABLE_BLOCKCHAIN` | `true` | Enable blockchain features |
| `VITE_ENABLE_AI_FEATURES` | `true` | Enable AI features |
| `VITE_ANALYTICS_ID` | `G-XXXXXXXXXX` | Google Analytics ID |
| `VITE_SENTRY_DSN` | `https://...` | Sentry error tracking DSN |

## 🤖 Service 2: AI/ML API (Web Service)

### Required Environment Variables

Go to your Render dashboard → `ecoversa-ai-api` → Environment tab → Add these variables:

| Variable Name | Example Value | Description |
|---------------|---------------|-------------|
| `FLASK_ENV` | `production` | Flask environment |
| `FLASK_APP` | `simple_api_server.py` | Flask app entry point |
| `PORT` | `5000` | Port for the service |
| `SECRET_KEY` | `your-secret-key-here` | Flask secret key (generate random) |
| `FIREBASE_URL` | `https://ecoversa-prod-default-rtdb.firebaseio.com` | Firebase Realtime Database URL |
| `FIREBASE_PROJECT_ID` | `ecoversa-prod` | Firebase project ID |

### Optional Environment Variables

| Variable Name | Example Value | Description |
|---------------|---------------|-------------|
| `DATABASE_URL` | `postgresql://...` | Database connection string |
| `REDIS_URL` | `redis://...` | Redis connection string |
| `ML_MODEL_PATH` | `./models/` | Path to ML models |
| `PREDICTION_CONFIDENCE_THRESHOLD` | `0.8` | ML prediction threshold |
| `ANOMALY_DETECTION_SENSITIVITY` | `0.9` | Anomaly detection sensitivity |
| `API_RATE_LIMIT` | `100` | API rate limit per minute |
| `LOG_LEVEL` | `INFO` | Logging level |
| `MAX_WORKERS` | `4` | Maximum worker processes |

### Firebase Service Account (if needed)

For advanced Firebase features, you may need service account credentials:

| Variable Name | Description |
|---------------|-------------|
| `FIREBASE_PRIVATE_KEY_ID` | Private key ID from service account |
| `FIREBASE_PRIVATE_KEY` | Private key from service account (include quotes) |
| `FIREBASE_CLIENT_EMAIL` | Client email from service account |
| `FIREBASE_CLIENT_ID` | Client ID from service account |

## 🏢 Service 3: IoT Simulator (Web Service)

### Required Environment Variables

Go to your Render dashboard → `ecoversa-iot-simulator` → Environment tab → Add these variables:

| Variable Name | Example Value | Description |
|---------------|---------------|-------------|
| `SIMULATION_MODE` | `production` | Simulation mode |
| `PORT` | `8000` | Port for the service |
| `FIREBASE_URL` | `https://ecoversa-prod-default-rtdb.firebaseio.com` | Firebase Realtime Database URL |
| `FIREBASE_PROJECT_ID` | `ecoversa-prod` | Firebase project ID |

### Optional Environment Variables

| Variable Name | Example Value | Description |
|---------------|---------------|-------------|
| `SIMULATION_INTERVAL` | `60` | Data generation interval (seconds) |
| `CAMPUS_BUILDINGS` | `7` | Number of campus buildings to simulate |
| `DATA_RETENTION_DAYS` | `30` | Days to retain simulation data |
| `DEVICE_COUNT` | `150` | Number of IoT devices to simulate |
| `SENSOR_ACCURACY` | `0.95` | Sensor accuracy factor |
| `TRANSMISSION_RELIABILITY` | `0.98` | Data transmission reliability |
| `OPENWEATHER_API_KEY` | `your-api-key` | OpenWeather API key (optional) |
| `MIN_ELECTRICITY_USAGE` | `200` | Minimum electricity usage |
| `MAX_ELECTRICITY_USAGE` | `1500` | Maximum electricity usage |
| `MIN_WATER_USAGE` | `500` | Minimum water usage |
| `MAX_WATER_USAGE` | `3000` | Maximum water usage |
| `LOG_LEVEL` | `INFO` | Logging level |

## 🔥 Getting Firebase Configuration

### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Enter project name (e.g., `ecoversa-prod`)
4. Enable Google Analytics (optional)
5. Wait for project creation

### Step 2: Get Configuration Values

1. In Firebase Console, go to Project Settings (gear icon)
2. Scroll down to "Your apps" section
3. Click "Add app" → Web app (</>) icon
4. Enter app nickname (e.g., `EcoVerse Web`)
5. Copy the configuration values:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC...",              // → VITE_FIREBASE_API_KEY
  authDomain: "project.firebaseapp.com",  // → VITE_FIREBASE_AUTH_DOMAIN
  projectId: "project-id",                // → VITE_FIREBASE_PROJECT_ID
  storageBucket: "project.appspot.com",   // → VITE_FIREBASE_STORAGE_BUCKET
  messagingSenderId: "123456789",         // → VITE_FIREBASE_MESSAGING_SENDER_ID
  appId: "1:123456789:web:abc123"        // → VITE_FIREBASE_APP_ID
};
```

### Step 3: Enable Required Services

1. **Realtime Database**: Database → Create database → Start in test mode
2. **Authentication**: Authentication → Get started → Enable email/password
3. **Storage**: Storage → Get started → Start in test mode

## 🔒 Security Best Practices

### 1. Environment Variable Security

- ✅ Use different Firebase projects for dev/staging/production
- ✅ Generate strong random secret keys
- ✅ Never expose private keys in client-side code
- ✅ Regularly rotate API keys
- ✅ Use Firebase security rules to protect data

### 2. Firebase Security Rules

Add these rules to your Firebase Realtime Database:

```json
{
  "rules": {
    ".read": "auth != null",
    ".write": "auth != null",
    "campus_data": {
      ".read": true,
      ".write": "auth != null"
    }
  }
}
```

### 3. Secret Key Generation

Generate secure secret keys using:

```bash
# For Flask SECRET_KEY
openssl rand -hex 32

# For JWT secrets
openssl rand -base64 32
```

## 🚀 Deployment Checklist

Before deploying, verify:

- [ ] All required environment variables are set
- [ ] Firebase project is created and configured
- [ ] Database rules are set up
- [ ] API keys are valid and active
- [ ] Service URLs are correctly referenced
- [ ] No sensitive data in code repository

## 🐛 Troubleshooting

### Common Issues

1. **Firebase connection errors**
   - Verify all Firebase variables are correct
   - Check Firebase project permissions
   - Ensure services are enabled in Firebase console

2. **Service communication errors**
   - Verify service URLs in environment variables
   - Check CORS configuration
   - Ensure all services are deployed and running

3. **Build failures**
   - Check for missing required environment variables
   - Verify environment variable names (case-sensitive)
   - Look at build logs for specific errors

### Debug Commands

```bash
# Check environment variables in Render service
echo $VITE_FIREBASE_PROJECT_ID
printenv | grep VITE_
printenv | grep FIREBASE_
```

## 📞 Support

If you need help:

1. Check service logs in Render dashboard
2. Verify environment variables are set correctly
3. Test Firebase connection independently
4. Review this guide for missing configurations

Your EcoVerse platform should now be fully configured and ready for production! 🌿
