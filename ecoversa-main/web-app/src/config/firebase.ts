/// <reference types="vite/client" />
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

// Vite automatically provides types for import.meta.env, so custom interfaces are not needed.

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY as string,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID as string,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET as string,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID as string,
  appId: import.meta.env.VITE_FIREBASE_APP_ID as string,
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firestore and export
export const db = getFirestore(app)
