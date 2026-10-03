import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

// Config pública por diseño: el acceso lo controla firestore.rules.
const app = initializeApp({
  apiKey: 'AIzaSyDWiAiYafWplRw35Q4ypvabvFF5AUWKWbU',
  authDomain: 'escuela-digital-6d9e1.firebaseapp.com',
  projectId: 'escuela-digital-6d9e1',
  storageBucket: 'escuela-digital-6d9e1.firebasestorage.app',
  messagingSenderId: '461407057713',
  appId: '1:461407057713:web:f3e8075fe27a23a99a6210',
})

export const auth = getAuth(app)
auth.languageCode = 'es' // correos de verificación y recuperación en español
export const db = getFirestore(app)
