// Firebase configuration for EcoVerse platform
// This file provides centralized Firebase configuration for all environments

// Firebase configuration object
export const firebaseConfig = {
  // These values should be set via environment variables
  apiKey: process.env.VITE_FIREBASE_API_KEY || "your_api_key_here",
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || "ecoversa-production.firebaseapp.com",
  projectId: process.env.VITE_FIREBASE_PROJECT_ID || "ecoversa-production",
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || "ecoversa-production.appspot.com",
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: process.env.VITE_FIREBASE_APP_ID || "1:123456789:web:abcdef123456",
  
  // Realtime Database URL
  databaseURL: process.env.VITE_FIREBASE_DATABASE_URL || "https://ecoversa-production-default-rtdb.firebaseio.com",
  
  // Measurement ID for Analytics (optional)
  measurementId: process.env.VITE_FIREBASE_MEASUREMENT_ID || "G-XXXXXXXXXX"
};

// Firebase configuration for different environments
export const getFirebaseConfig = (environment = 'production') => {
  const configs = {
    development: {
      ...firebaseConfig,
      projectId: 'ecoversa-dev',
      authDomain: 'ecoversa-dev.firebaseapp.com',
      storageBucket: 'ecoversa-dev.appspot.com',
      databaseURL: 'https://ecoversa-dev-default-rtdb.firebaseio.com'
    },
    staging: {
      ...firebaseConfig,
      projectId: 'ecoversa-staging',
      authDomain: 'ecoversa-staging.firebaseapp.com',
      storageBucket: 'ecoversa-staging.appspot.com',
      databaseURL: 'https://ecoversa-staging-default-rtdb.firebaseio.com'
    },
    production: firebaseConfig
  };
  
  return configs[environment] || configs.production;
};

// Collection names for Firestore
export const COLLECTIONS = {
  USERS: 'users',
  CAMPUS_DATA: 'campus-data',
  SENSOR_DATA: 'sensor-data',
  ACHIEVEMENTS: 'achievements',
  LEADERBOARD: 'leaderboard',
  AI_SUGGESTIONS: 'ai-suggestions',
  USER_ACTIONS: 'user-actions',
  NOTIFICATIONS: 'notifications',
  PUBLIC_METRICS: 'public-metrics',
  CAMPUS_BUILDINGS: 'campus-buildings',
  SUSTAINABILITY_GOALS: 'sustainability-goals',
  NFT_METADATA: 'nft-metadata',
  REWARDS: 'rewards'
};

// Realtime Database paths
export const DB_PATHS = {
  LIVE_METRICS: 'live-metrics',
  SENSOR_DATA: 'sensor-data',
  USER_SCORES: 'user-scores',
  CAMPUS_STATS: 'campus-stats',
  CURRENT_METRICS: 'live-metrics/current',
  HISTORICAL_DATA: 'sensor-data',
  LEADERBOARD: 'leaderboard',
  NOTIFICATIONS: 'notifications'
};

// Storage paths
export const STORAGE_PATHS = {
  PROFILE_IMAGES: 'profile-images',
  ACHIEVEMENT_IMAGES: 'achievement-images',
  CAMPUS_IMAGES: 'campus-images',
  ACTION_PROOFS: 'action-proofs',
  NFT_ASSETS: 'nft-assets',
  DOCUMENTS: 'documents',
  PUBLIC: 'public'
};

// Firebase service configuration
export const FIREBASE_SERVICES = {
  AUTH: {
    signInMethods: ['email', 'google'],
    passwordPolicy: {
      minLength: 8,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true
    }
  },
  FIRESTORE: {
    settings: {
      cacheSizeBytes: 40 * 1024 * 1024, // 40 MB
      experimentalForceLongPolling: false
    }
  },
  STORAGE: {
    maxUploadSize: {
      profileImage: 5 * 1024 * 1024, // 5 MB
      actionProof: 10 * 1024 * 1024, // 10 MB
      document: 50 * 1024 * 1024 // 50 MB
    },
    allowedTypes: {
      images: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
      documents: ['application/pdf', 'text/plain', 'application/msword']
    }
  }
};

// Helper function to get environment-specific configuration
export const getEnvironmentConfig = () => {
  const environment = process.env.VITE_ENVIRONMENT || 'production';
  return {
    config: getFirebaseConfig(environment),
    collections: COLLECTIONS,
    dbPaths: DB_PATHS,
    storagePaths: STORAGE_PATHS,
    services: FIREBASE_SERVICES,
    environment
  };
};

// Firebase initialization options
export const FIREBASE_OPTIONS = {
  // Performance monitoring
  performance: {
    enabled: process.env.VITE_ENVIRONMENT === 'production',
    dataCollectionEnabled: true,
    instrumentationEnabled: true
  },
  
  // Analytics
  analytics: {
    enabled: process.env.VITE_ENVIRONMENT === 'production',
    config: {
      anonymizeIp: true,
      allowAdFeatures: false
    }
  },
  
  // App Check (for production security)
  appCheck: {
    enabled: process.env.VITE_ENVIRONMENT === 'production',
    isTokenAutoRefreshEnabled: true
  }
};
