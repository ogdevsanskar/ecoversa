# 🚀 Complete Step-by-Step Render Deployment Guide

This guide will walk you through deploying the complete EcoVerse platform to Render with all 3 services.

## ✅ Current Deployment Status

**Successfully Deployed Services:**
- ✅ **AI/ML Analytics API**: Live at `https://ecoverse-ai-api.onrender.com`
  - Root endpoint fixed with comprehensive API documentation
  - Health check: `/api/health`
  - Prediction endpoints operational
- 🔄 **IoT Simulation API**: Ready for deployment with Flask wrapper
  - New Flask API created with comprehensive endpoints
  - Health check: `/api/health`
  - Simulation control: `/api/simulation/start`, `/api/simulation/stop`

**Next Steps:**
1. Deploy IoT Simulation service to Render
2. Deploy Frontend to Render
3. Update environment variables for service integration

## 📋 Prerequisites Checklist

Before starting, ensure you have:

- [ ] GitHub account with repository: `https://github.com/ogdevsanskar/ecoversa`
- [ ] Render account: [Sign up at render.com](https://render.com)
- [ ] Firebase project created
- [ ] All code pushed to GitHub main branch

## 🔥 Step 1: Set Up Firebase Project

### 1.1 Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Create a project"**
3. Enter project name: `ecoversa-production`
4. Enable Google Analytics (optional)
5. Click **"Create project"**

### 1.2 Enable Required Services

**Enable Realtime Database:**
1. In Firebase Console → **Database** → **Realtime Database**
2. Click **"Create database"**
3. Choose **"Start in test mode"** → **"Done"**

**Enable Authentication:**
1. Go to **Authentication** → **"Get started"**
2. Click **Sign-in method** tab
3. Enable **"Email/Password"** → **"Save"**

**Enable Storage:**
1. Go to **Storage** → **"Get started"**
2. **"Start in test mode"** → **"Done"**

### 1.3 Get Firebase Configuration

1. Go to **Project Settings** (gear icon)
2. Scroll to **"Your apps"** section
3. Click **"Add app"** → Web icon (`</>`)
4. App nickname: `EcoVerse Production`
5. **Register app**
6. **Copy the configuration object** - you'll need these values:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC...",              // ← Copy this
  authDomain: "project.firebaseapp.com",  // ← Copy this
  projectId: "project-id",                // ← Copy this
  storageBucket: "project.appspot.com",   // ← Copy this
  messagingSenderId: "123456789",         // ← Copy this
  appId: "1:123456789:web:abc123"        // ← Copy this
};
```

## 🚀 Step 2: Deploy Service 1 - Frontend (Static Site)

### 2.1 Create Frontend Service

1. **Go to Render Dashboard**: [https://dashboard.render.com](https://dashboard.render.com)
2. Click **"New +"** → **"Static Site"**
3. **Connect Repository**:
   - If first time: Click **"Connect GitHub"** → authorize Render
   - Select repository: **`ogdevsanskar/ecoversa`**
   - Click **"Connect"**

### 2.2 Configure Frontend Service

**Basic Settings:**
- **Name**: `ecoversa-web-app`
- **Branch**: `main`
- **Root Directory**: (leave blank)
- **Build Command**: `./build.sh`
- **Publish Directory**: `web-app/dist`

### 2.3 Add Frontend Environment Variables

Click **"Advanced"** → **Environment Variables** → Add each variable:

| Key | Value (Replace with your Firebase values) |
|-----|-------------------------------------------|
| `VITE_FIREBASE_API_KEY` | `Get from Firebase Console → Project Settings → General → Web apps → Config` |
| `VITE_FIREBASE_AUTH_DOMAIN` | `ecoversa-production.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | `ecoversa-production` |
| `VITE_FIREBASE_STORAGE_BUCKET` | `ecoversa-production.appspot.com` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | `Get from Firebase Console config` |
| `VITE_FIREBASE_APP_ID` | `Get from Firebase Console config` |
| `VITE_AI_API_URL` | `https://ecoversa-ai-api.onrender.com` |
| `VITE_IOT_API_URL` | `https://ecoversa-iot-simulator.onrender.com` |
| `VITE_APP_TITLE` | `EcoVerse` |
| `VITE_ENVIRONMENT` | `production` |

### 2.4 Deploy Frontend

1. Click **"Create Static Site"**
2. Wait for deployment (5-10 minutes)
3. **Copy the URL** (e.g., `https://ecoversa-web-app.onrender.com`)

## 🤖 Step 3: Deploy Service 2 - AI/ML API (Web Service)

### 3.1 Create AI/ML API Service

1. **Go to Render Dashboard**
2. Click **"New +"** → **"Web Service"**
3. **Connect Repository**: Select **`ogdevsanskar/ecoversa`**

### 3.2 Configure AI/ML API Service

**Basic Settings:**
- **Name**: `ecoversa-ai-api`
- **Runtime**: **Python 3**
- **Branch**: `main`
- **Root Directory**: (leave blank)
- **Build Command**: `pip install -r ai-analytics/requirements.txt`
- **Start Command**: `cd ai-analytics && python simple_api_server.py`

**Plan Settings:**
- **Instance Type**: **Starter** (or higher for production)
- **Region**: Choose closest to your users

### 3.3 Add AI/ML API Environment Variables

Click **"Advanced"** → **Environment Variables**:

| Key | Value |
|-----|-------|
| `FLASK_ENV` | `production` |
| `FLASK_APP` | `simple_api_server.py` |
| `PORT` | `5000` |
| `FIREBASE_URL` | `https://ecoversa-production-default-rtdb.firebaseio.com` |
| `FIREBASE_PROJECT_ID` | `ecoversa-production` |
| `SECRET_KEY` | `your-secret-key-here` (generate with `openssl rand -hex 32`) |

### 3.4 Deploy AI/ML API

1. Click **"Create Web Service"**
2. Wait for deployment (10-15 minutes)
3. **Copy the URL** (e.g., `https://ecoversa-ai-api.onrender.com`)

## 🏢 Step 4: Deploy Service 3 - IoT Simulator (Web Service)

### 4.1 Create IoT Simulator Service

1. **Go to Render Dashboard**
2. Click **"New +"** → **"Web Service"**
3. **Connect Repository**: Select **`ogdevsanskar/ecoversa`**

### 4.2 Configure IoT Simulator Service

**Basic Settings:**
- **Name**: `ecoversa-iot-simulator`
- **Runtime**: **Python 3**
- **Branch**: `main`
- **Root Directory**: (leave blank)
- **Build Command**: `pip install -r iot-simulation/requirements.txt`
- **Start Command**: `cd iot-simulation && python app.py`

**Plan Settings:**
- **Instance Type**: **Starter**
- **Region**: Same as AI/ML API

### 4.3 Add IoT Simulator Environment Variables

Click **"Advanced"** → **Environment Variables**:

| Key | Value |
|-----|-------|
| `FLASK_ENV` | `production` |
| `FLASK_APP` | `app.py` |
| `PORT` | `5000` |
| `FIREBASE_URL` | `https://ecoversa-production-default-rtdb.firebaseio.com` |
| `FIREBASE_PROJECT_ID` | `ecoversa-production` |
| `SIMULATION_INTERVAL` | `300` |
| `CAMPUS_BUILDINGS` | `7` |

### 4.4 Deploy IoT Simulator

1. Click **"Create Web Service"**
2. Wait for deployment (10-15 minutes)
3. **Copy the URL** (e.g., `https://ecoversa-iot-simulator.onrender.com`)

## ⚙️ Step 5: Update Frontend Service URLs

### 5.1 Update Frontend Environment Variables

1. Go back to your **Frontend service** (`ecoversa-web-app`)
2. Go to **Environment** tab
3. **Update these variables** with actual service URLs:

| Key | New Value |
|-----|-----------|
| `VITE_AI_API_URL` | `https://ecoversa-ai-api.onrender.com` |
| `VITE_IOT_API_URL` | `https://ecoversa-iot-simulator.onrender.com` |

### 5.2 Redeploy Frontend

1. Go to **Deploys** tab
2. Click **"Trigger Deploy"**
3. Wait for redeployment

## ✅ Step 6: Verify Deployment

### 6.1 Test Each Service

**Test Frontend:**
1. Visit: `https://ecoversa-web-app.onrender.com`
2. Should load the EcoVerse dashboard
3. Check browser console for errors

**Test AI/ML API:**
1. Visit: `https://ecoversa-ai-api.onrender.com/health`
2. Should return JSON: `{"status": "healthy"}`

**Test IoT Simulator:**
1. Visit: `https://ecoversa-iot-simulator.onrender.com/api/health`
2. Should return JSON: `{"status": "healthy"}`
3. Visit: `https://ecoversa-iot-simulator.onrender.com/` for API documentation

### 6.2 Test Integration

1. **Open Frontend** in browser
2. **Check Dashboard** - should show real-time data
3. **Test Navigation** - all pages should work
4. **Check Firebase** - data should appear in Realtime Database

## 🔧 Step 7: Configure Firebase Security (Optional but Recommended)

### 7.1 Set Database Rules

1. Go to **Firebase Console** → **Realtime Database** → **Rules**
2. Replace with:

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

3. Click **"Publish"**

## 🐛 Troubleshooting Common Issues

### Build Failures

**Frontend Build Fails:**
1. Check **Build Logs** in Render dashboard
2. Verify all `VITE_` environment variables are set
3. Ensure `build.sh` file exists and is executable

**Python Service Build Fails:**
1. Check **Build Logs**
2. Verify `requirements.txt` files exist
3. Check Python version compatibility

### Runtime Errors

**Services Won't Start:**
1. Check **Logs** tab in service dashboard
2. Verify environment variables are correct
3. Check port configuration

**Frontend Shows Errors:**
1. Open browser **Developer Tools** → **Console**
2. Check for Firebase connection errors
3. Verify API URLs are correct

### Connection Issues

**Services Can't Communicate:**
1. Verify service URLs in frontend environment variables
2. Check CORS configuration in backend services
3. Ensure all services are deployed and running

## 📋 Deployment Checklist

- [ ] Firebase project created and configured
- [ ] Frontend service deployed (`ecoversa-web-app`)
- [ ] AI/ML API service deployed (`ecoversa-ai-api`)
- [ ] IoT Simulator service deployed (`ecoversa-iot-simulator`)
- [ ] All environment variables configured
- [ ] Frontend updated with correct service URLs
- [ ] All services tested and working
- [ ] Firebase security rules configured
- [ ] Integration between services verified

## 🎉 Success! Your URLs

After successful deployment, your services will be available at:

- **🌐 Frontend**: `https://ecoversa-web-app.onrender.com`
- **🤖 AI/ML API**: `https://ecoversa-ai-api.onrender.com`
- **🏢 IoT Simulator**: `https://ecoversa-iot-simulator.onrender.com`

## 🔄 Automatic Deployments

Render will automatically redeploy when you push changes to the `main` branch on GitHub. No manual intervention needed!

## 📞 Need Help?

If you encounter issues:

1. **Check service logs** in Render dashboard
2. **Verify environment variables** are set correctly
3. **Test Firebase connection** independently
4. **Review troubleshooting section** above

Your complete EcoVerse platform is now live on Render! 🌿✨
