# ✅ EcoVerse Render Deployment Checklist

## 📋 Pre-Deployment Checklist

### Prerequisites
- [ ] GitHub account with repository access
- [ ] Render account created ([render.com](https://render.com))
- [ ] Firebase project created
- [ ] All code pushed to GitHub main branch

### Firebase Setup
- [ ] Firebase project created (`ecoversa-production`)
- [ ] Realtime Database enabled (test mode)
- [ ] Authentication enabled (Email/Password)
- [ ] Storage enabled (test mode)
- [ ] Firebase configuration copied (6 values)

## 🚀 Deployment Steps

### Step 1: Frontend Service (Static Site)
- [ ] Created service: `ecoversa-web-app`
- [ ] Connected GitHub repository: `ogdevsanskar/ecoversa`
- [ ] Build command set: `./build.sh`
- [ ] Publish directory set: `web-app/dist`
- [ ] Environment variables added (10 variables)
- [ ] Service deployed successfully
- [ ] Frontend URL copied

### Step 2: AI/ML API Service (Web Service)
- [ ] Created service: `ecoversa-ai-api`
- [ ] Runtime set: Python 3
- [ ] Build command set: `pip install -r ai-analytics/requirements.txt`
- [ ] Start command set: `cd ai-analytics && python simple_api_server.py`
- [ ] Environment variables added (6 variables)
- [ ] Service deployed successfully
- [ ] API URL copied

### Step 3: IoT Simulator Service (Web Service)
- [ ] Created service: `ecoversa-iot-simulator`
- [ ] Runtime set: Python 3
- [ ] Build command set: `pip install -r iot-simulation/requirements.txt`
- [ ] Start command set: `cd iot-simulation && python campus_simulator.py`
- [ ] Environment variables added (6 variables)
- [ ] Service deployed successfully
- [ ] Simulator URL copied

### Step 4: Update Frontend URLs
- [ ] Updated `VITE_AI_API_URL` with actual AI service URL
- [ ] Updated `VITE_IOT_API_URL` with actual IoT service URL
- [ ] Triggered frontend redeploy

## ✅ Testing & Verification

### Service Health Checks
- [ ] Frontend loads: `https://ecoversa-web-app.onrender.com`
- [ ] AI API responds: `https://ecoversa-ai-api.onrender.com/health`
- [ ] IoT Simulator responds: `https://ecoversa-iot-simulator.onrender.com/status`

### Integration Testing
- [ ] Dashboard displays data
- [ ] Navigation works between pages
- [ ] Real-time data updates
- [ ] Firebase database receives data
- [ ] No console errors in browser

### Performance Testing
- [ ] All services start within reasonable time
- [ ] Frontend loads quickly
- [ ] API responses are fast
- [ ] No memory/CPU issues in logs

## 🔧 Environment Variables Reference

### Frontend (10 variables)
- [ ] `VITE_FIREBASE_API_KEY`
- [ ] `VITE_FIREBASE_AUTH_DOMAIN`
- [ ] `VITE_FIREBASE_PROJECT_ID`
- [ ] `VITE_FIREBASE_STORAGE_BUCKET`
- [ ] `VITE_FIREBASE_MESSAGING_SENDER_ID`
- [ ] `VITE_FIREBASE_APP_ID`
- [ ] `VITE_AI_API_URL`
- [ ] `VITE_IOT_API_URL`
- [ ] `VITE_APP_TITLE`
- [ ] `VITE_ENVIRONMENT`

### AI/ML API (6 variables)
- [ ] `FLASK_ENV`
- [ ] `FLASK_APP`
- [ ] `PORT`
- [ ] `FIREBASE_URL`
- [ ] `FIREBASE_PROJECT_ID`
- [ ] `SECRET_KEY`

### IoT Simulator (6 variables)
- [ ] `SIMULATION_MODE`
- [ ] `PORT`
- [ ] `FIREBASE_URL`
- [ ] `FIREBASE_PROJECT_ID`
- [ ] `SIMULATION_INTERVAL`
- [ ] `CAMPUS_BUILDINGS`

## 🎯 Final Service URLs

After successful deployment:

- **Frontend**: `https://ecoversa-web-app.onrender.com`
- **AI/ML API**: `https://ecoversa-ai-api.onrender.com`
- **IoT Simulator**: `https://ecoversa-iot-simulator.onrender.com`

## 🔄 Post-Deployment

### Security Configuration
- [ ] Firebase security rules configured
- [ ] Database access restricted
- [ ] API rate limiting enabled (if applicable)

### Monitoring Setup
- [ ] Service health monitoring enabled
- [ ] Error tracking configured
- [ ] Performance monitoring active

### Documentation
- [ ] Service URLs documented
- [ ] Environment variables backed up
- [ ] Deployment process documented

## 🐛 Troubleshooting Checklist

### If Frontend Fails
- [ ] Check build logs for errors
- [ ] Verify all VITE_ variables are set
- [ ] Confirm build.sh file exists
- [ ] Check Node.js version compatibility

### If Backend Services Fail
- [ ] Check service logs
- [ ] Verify requirements.txt exists
- [ ] Confirm Python version compatibility
- [ ] Check environment variables
- [ ] Verify port configuration

### If Integration Fails
- [ ] Check service URLs in frontend
- [ ] Verify CORS configuration
- [ ] Test services individually
- [ ] Check Firebase connection
- [ ] Review network configuration

## 📞 Support Resources

- **Render Documentation**: [docs.render.com](https://docs.render.com)
- **Firebase Documentation**: [firebase.google.com/docs](https://firebase.google.com/docs)
- **Project Documentation**: 
  - `STEP_BY_STEP_RENDER_DEPLOYMENT.md`
  - `ENV_QUICK_REFERENCE.md`
  - `RENDER_ENVIRONMENT_GUIDE.md`

## 🎉 Deployment Complete!

When all items are checked, your EcoVerse platform is successfully deployed and running on Render! 🌿✨

**Estimated Total Deployment Time**: 30-45 minutes
