# Firebase Setup and Deployment Guide for EcoVerse Platform

## 📋 Overview
This guide covers complete Firebase backend setup for the EcoVerse Virtual Smart Campus Sustainability System, including configuration, deployment, and integration with the full-stack platform.

## 🔧 Prerequisites
- Node.js 18+ installed
- Firebase CLI installed (`npm install -g firebase-tools`)
- Google Cloud Platform account
- Firebase project created

## 🚀 Quick Setup

### 1. Firebase Project Setup
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase in project
cd firebase/
firebase init

# Select the following services:
# ✅ Realtime Database
# ✅ Firestore
# ✅ Functions
# ✅ Hosting
# ✅ Storage
# ✅ Emulators
```

### 2. Environment Configuration
```bash
# Set environment variables for Cloud Functions
firebase functions:config:set \
  app.name="EcoVerse Platform" \
  app.env="production" \
  ml.api_url="https://your-ml-api.onrender.com" \
  web3.contract_address="your-contract-address" \
  web3.network="polygon"

# Set Firebase project for deployment
firebase use your-firebase-project-id
```

### 3. Deploy Firebase Services
```bash
# Deploy all services
firebase deploy

# Or deploy individual services:
firebase deploy --only firestore:rules
firebase deploy --only database:rules
firebase deploy --only storage:rules
firebase deploy --only functions
firebase deploy --only hosting
```

## 📁 Project Structure
```
firebase/
├── .firebaserc                 # Project configuration
├── firebase.json              # Services configuration
├── firestore.rules           # Firestore security rules
├── firestore.indexes.json    # Firestore indexes
├── database.rules.json       # Realtime Database rules
├── storage.rules             # Storage security rules
├── config/
│   └── firebase-config.js    # SDK configuration
├── functions/
│   ├── index.js             # Cloud Functions code
│   ├── package.json         # Functions dependencies
│   └── node_modules/        # Dependencies (auto-generated)
└── public/
    └── index.html           # Hosting landing page
```

## 🔐 Security Rules

### Firestore Rules (`firestore.rules`)
- **Role-based access control** (admin, system, user)
- **Secure data validation** for all collections
- **User privacy protection** for personal data
- **Admin-only access** for system operations

### Storage Rules (`storage.rules`)
- **File size limits** (max 10MB per file)
- **Authenticated user uploads** only
- **User-specific folders** for privacy
- **Admin access** to all files

### Realtime Database Rules (`database.rules.json`)
- **Real-time IoT data** with system-only writes
- **User read access** to relevant data
- **Live metrics** with public read access
- **Notifications** with user-specific access

## ⚡ Cloud Functions

### Core Functions
1. **`processIoTData`** - Process incoming sensor data
2. **`processMLPredictions`** - Handle AI/ML predictions
3. **`mintRewardToken`** - Web3 rewards integration
4. **`generateDailyReports`** - Automated daily analytics
5. **`getUserStats`** - User statistics and rankings

### Function Triggers
- **Database triggers** for real-time data processing
- **HTTP endpoints** for external integrations
- **Scheduled functions** for daily reports
- **Callable functions** for secure client operations

## 🔗 Integration Points

### Frontend Integration
```javascript
// Import Firebase configuration
import { firebaseConfig } from './firebase/config/firebase-config.js';

// Initialize Firebase app
import { initializeApp } from 'firebase/app';
const app = initializeApp(firebaseConfig.development);
```

### Backend Services Integration
```python
# Python backend integration
import firebase_admin
from firebase_admin import credentials, firestore, db

# Initialize Firebase Admin SDK
cred = credentials.Certificate('path/to/service-account-key.json')
firebase_admin.initialize_app(cred, {
    'databaseURL': 'https://your-project.firebaseio.com'
})
```

## 📊 Database Schema

### Firestore Collections
- **`users`** - User profiles and settings
- **`sensor-data`** - Processed IoT sensor data
- **`achievements`** - User achievements and rewards
- **`ai-predictions`** - ML model predictions
- **`anomalies`** - Detected data anomalies
- **`leaderboard`** - User rankings and scores
- **`daily-reports`** - Automated sustainability reports

### Realtime Database Structure
```
/
├── sensor-data/          # Raw IoT sensor data
├── live-metrics/         # Real-time campus metrics
├── notifications/        # User notifications
└── system-status/        # Platform health monitoring
```

## 🚀 Deployment Process

### 1. Pre-deployment Checklist
- [ ] Firebase project created and configured
- [ ] Service account key generated
- [ ] Environment variables set
- [ ] Security rules tested
- [ ] Functions tested locally

### 2. Local Testing
```bash
# Start Firebase emulators
firebase emulators:start

# Test functions locally
cd functions/
npm test

# Test security rules
firebase emulators:exec --only firestore "npm test"
```

### 3. Production Deployment
```bash
# Deploy to production
firebase deploy --project production

# Verify deployment
firebase functions:log --project production
```

### 4. Post-deployment Verification
- [ ] All functions deployed successfully
- [ ] Security rules active and working
- [ ] Database indexes created
- [ ] Real-time data flowing correctly
- [ ] Notifications system working

## 🔧 Environment Variables

### Required Variables
```bash
# Firebase Configuration
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_API_KEY=your-api-key
FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
FIREBASE_DATABASE_URL=https://your-project.firebaseio.com
FIREBASE_STORAGE_BUCKET=your-project.appspot.com

# External Services
ML_API_URL=https://your-ml-api.onrender.com
WEB3_CONTRACT_ADDRESS=your-contract-address
WEB3_NETWORK=polygon
```

### Setting Variables in Firebase
```bash
# For Cloud Functions
firebase functions:config:set \
  ml.api_url="https://your-ml-api.onrender.com" \
  web3.contract_address="your-contract-address"

# View current config
firebase functions:config:get
```

## 📈 Monitoring and Analytics

### Firebase Console Monitoring
- **Functions logs** - Monitor function execution
- **Performance** - Track function performance
- **Usage** - Monitor API usage and quotas
- **Security** - Track authentication events

### Custom Monitoring
```javascript
// Add custom logging in functions
console.log('Processing IoT data:', data);
console.error('Error processing data:', error);

// Track custom metrics
await db.collection('system-metrics').add({
  metric: 'function_execution',
  function_name: 'processIoTData',
  duration: executionTime,
  timestamp: admin.firestore.FieldValue.serverTimestamp()
});
```

## 🔍 Troubleshooting

### Common Issues
1. **Permission denied errors**
   - Check security rules
   - Verify user authentication
   - Ensure proper role assignments

2. **Function timeout errors**
   - Increase function timeout
   - Optimize database queries
   - Use batch operations

3. **Quota exceeded errors**
   - Monitor usage in Firebase console
   - Optimize data queries
   - Consider upgrading plan

### Debug Commands
```bash
# View function logs
firebase functions:log

# Check security rules
firebase firestore:rules:get

# Test locally with emulators
firebase emulators:start --inspect-functions
```

## 📱 Mobile Integration

### React Native Setup
```javascript
// Install Firebase SDK
npm install @react-native-firebase/app @react-native-firebase/firestore

// Configure Firebase
import firestore from '@react-native-firebase/firestore';
const db = firestore();
```

### iOS/Android Configuration
- Add `google-services.json` for Android
- Add `GoogleService-Info.plist` for iOS
- Configure app permissions for notifications

## 🌐 Web Integration

### React App Setup
```javascript
// Install Firebase SDK
npm install firebase

// Initialize Firebase
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
```

## 🔄 Backup and Recovery

### Automated Backups
```bash
# Export Firestore data
gcloud firestore export gs://your-backup-bucket

# Export Realtime Database
firebase database:backup backup.json
```

### Data Recovery
```bash
# Import Firestore data
gcloud firestore import gs://your-backup-bucket/backup-folder

# Import Realtime Database
firebase database:restore backup.json
```

## 📋 Maintenance Tasks

### Daily Tasks
- Monitor function logs for errors
- Check system health metrics
- Verify real-time data flow

### Weekly Tasks
- Review security rules effectiveness
- Analyze usage patterns
- Update function dependencies

### Monthly Tasks
- Review and optimize database indexes
- Analyze costs and usage quotas
- Update Firebase SDK versions

## 🆘 Support and Resources

### Documentation
- [Firebase Documentation](https://firebase.google.com/docs)
- [Cloud Functions Guide](https://firebase.google.com/docs/functions)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)

### Community Support
- [Firebase Stack Overflow](https://stackoverflow.com/questions/tagged/firebase)
- [Firebase Slack Community](https://firebase.community/)
- [Firebase GitHub Discussions](https://github.com/firebase/firebase-js-sdk/discussions)

---

## 🎯 Next Steps
1. Complete Firebase project setup
2. Deploy Cloud Functions
3. Test all integrations
4. Configure monitoring
5. Launch production deployment

**Ready to deploy your Firebase backend! 🚀**
