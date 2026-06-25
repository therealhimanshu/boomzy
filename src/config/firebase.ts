import { initializeApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider, connectAuthEmulator } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'mock-api-key',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'mock-auth-domain',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'demo-boomzy-ignite',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'mock-storage-bucket',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || 'mock-sender-id',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || 'mock-app-id',
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const auth = getAuth(app);

if (import.meta.env.DEV) {
  // Connect to local Auth emulator for testing
  connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
}

export const googleProvider = new GoogleAuthProvider();
export default app;

