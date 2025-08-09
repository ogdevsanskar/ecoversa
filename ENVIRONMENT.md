# Environment Variables Setup Guide

This guide explains how to set up environment variables for the Ecoversa project.

## 🔧 Local Development Setup

### 1. Copy the example file
```bash
cp .env.example web-app/.env.local
```

### 2. Fill in your Firebase configuration
Edit `web-app/.env.local` with your Firebase project details:

```env
VITE_FIREBASE_API_KEY=your-actual-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123def456
```

### 3. Get Firebase Configuration
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project (or create a new one)
3. Go to Project Settings → General
4. Scroll down to "Your apps" section
5. Click on the web app or "Add app" if none exists
6. Copy the configuration values

## 🚀 Production Deployment (Render)

### 1. In Render Dashboard
1. Go to your deployed service
2. Navigate to "Environment" tab
3. Add each environment variable:

| Variable Name | Description | Example |
|---------------|-------------|---------|
| `VITE_FIREBASE_API_KEY` | Firebase API Key | `AIzaSyC...` |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase Auth Domain | `ecoversa.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | Firebase Project ID | `ecoversa-prod` |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase Storage Bucket | `ecoversa-prod.appspot.com` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase Messaging Sender ID | `123456789` |
| `VITE_FIREBASE_APP_ID` | Firebase App ID | `1:123456789:web:abc123` |

### 2. Redeploy
After adding environment variables, trigger a new deployment.

## 🔒 Security Notes

- **Never commit `.env.local`** - it contains sensitive data
- **Use different Firebase projects** for development and production
- **Regenerate API keys** if accidentally exposed
- **Enable Firebase security rules** to protect your database

## 📁 Environment Files Structure

```
ecoversa/
├── .env.example          # Template with dummy values
├── web-app/
│   ├── .env.local        # Local development (gitignored)
│   └── .env.production   # Production template
```

## 🔍 Troubleshooting

### Firebase Connection Issues
1. Verify all environment variables are set
2. Check Firebase project permissions
3. Ensure Firebase services are enabled
4. Check browser console for errors

### Build Issues
1. Make sure all `VITE_` prefixed variables are defined
2. Restart the development server after changing env vars
3. Clear browser cache and rebuild

### Render Deployment Issues
1. Check environment variables are set in Render dashboard
2. Look at build logs for missing environment variables
3. Ensure production Firebase project is accessible

## 🛠️ Testing Environment Setup

Run this command to verify your environment setup:

```bash
cd web-app
npm run dev
```

Check the browser console - if Firebase initializes without errors, your environment is set up correctly!
