/// <reference types="vite/client" />
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

// Debug environment variables
console.log('🔥 Firebase Configuration Debug:')
console.log('API Key present:', !!import.meta.env.VITE_FIREBASE_API_KEY)
console.log('Auth Domain:', import.meta.env.VITE_FIREBASE_AUTH_DOMAIN)
console.log('Project ID:', import.meta.env.VITE_FIREBASE_PROJECT_ID)
console.log('Storage Bucket:', import.meta.env.VITE_FIREBASE_STORAGE_BUCKET)
console.log('All env vars:', import.meta.env)

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY as string,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID as string,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET as string,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID as string,
  appId: import.meta.env.VITE_FIREBASE_APP_ID as string,
}

// Validate required config
const requiredFields = [
  'apiKey', 'authDomain', 'projectId', 'storageBucket', 'messagingSenderId', 'appId'
]

const missingFields = requiredFields.filter(field => !firebaseConfig[field as keyof typeof firebaseConfig])

if (missingFields.length > 0) {
  console.warn('⚠️ Missing Firebase configuration fields:', missingFields)
  console.warn('Firebase may not work properly without these fields')
}

let app: any = null
let db: any = null

try {
  // Initialize Firebase
  app = initializeApp(firebaseConfig)
  console.log('✅ Firebase initialized successfully')

  // Initialize Firestore and export
  db = getFirestore(app)
  console.log('✅ Firestore initialized successfully')
} catch (error) {
  console.error('❌ Firebase initialization failed:', error)
  // Don't throw error to prevent white screen
}

export { db }
