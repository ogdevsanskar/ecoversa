# EcoVerse - Render Deployment Guide

This guide will help you deploy the EcoVerse application to Render.

## 🚀 Quick Deploy

### Method 1: Using render.yaml (Recommended)

1. **Connect your repository to Render:**
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New" → "Blueprint"
   - Connect your GitHub repository
   - Render will automatically detect the `render.yaml` file

2. **Set Environment Variables:**
   - In your Render service settings, add these environment variables:
   ```
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

### Method 2: Manual Setup

1. **Create a new Web Service:**
   - Go to Render Dashboard
   - Click "New" → "Web Service"
   - Connect your repository

2. **Configure Build Settings:**
   - **Build Command:** `cd web-app && npm install && npm run build`
   - **Start Command:** `cd web-app && npm run preview`
   - **Environment:** Node
   - **Node Version:** 18 or higher

3. **Set Environment Variables** (same as Method 1)

## 📋 Prerequisites

- Git repository with your EcoVerse code
- Firebase project set up (for backend services)
- Render account (free tier available)

## 🔧 Configuration Details

### Environment Variables Needed:

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_FIREBASE_API_KEY` | Firebase API Key | `AIzaSyC...` |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase Auth Domain | `ecoverse.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | Firebase Project ID | `ecoverse-app` |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase Storage Bucket | `ecoverse-app.appspot.com` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase Messaging Sender ID | `123456789` |
| `VITE_FIREBASE_APP_ID` | Firebase App ID | `1:123:web:abc` |

### Build Process:
1. Install dependencies with `npm install`
2. Build the React app with `npm run build`
3. Serve the built files with Vite preview server

### Features Deployed:
- ✅ React + TypeScript frontend
- ✅ Chakra UI components
- ✅ Framer Motion animations  
- ✅ React Router navigation
- ✅ Firebase integration
- ✅ Responsive design
- ✅ Web3 contract documentation

## 🌐 Access Your App

After deployment, your app will be available at:
- Main App: `https://your-app-name.onrender.com`
- Contracts Docs: `https://your-contracts-name.onrender.com`

## 🔍 Troubleshooting

### Common Issues:

1. **Build Fails:**
   - Check that all dependencies are listed in `package.json`
   - Verify Node.js version compatibility

2. **Environment Variables Not Working:**
   - Ensure variables start with `VITE_` prefix
   - Check that variables are set in Render dashboard

3. **Firebase Connection Issues:**
   - Verify Firebase configuration
   - Check Firebase project permissions

### Build Logs:
Check the build logs in Render dashboard for detailed error information.

### Support:
- Check the main [README.md](./README.md) for project details
- Visit [Render Documentation](https://render.com/docs)
- Create an issue in the repository for project-specific problems

## 📈 Performance

- **Build Time:** ~3-5 minutes
- **Cold Start:** ~10-15 seconds
- **Free Tier:** 750 hours/month
- **Auto-deploys:** On git push to main branch

## 🎯 Next Steps

After deployment, consider:
1. Setting up custom domain
2. Configuring Firebase Analytics  
3. Deploying the AI/ML backend
4. Setting up Web3 contract deployment
5. Adding CI/CD workflows

---

Happy deploying! 🌱
