/**
 * Firebase Admin SDK Configuration
 *
 * Initializes the Firebase Admin SDK with service account credentials
 * from environment variables. Falls back to Application Default Credentials
 * or a mock in-memory database depending on configuration.
 */

import dotenv from 'dotenv';
import { initializeApp, cert, App } from 'firebase-admin/app';
import { getFirestore, FieldValue as AdminFieldValue } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import { createMockFirestore, MockFieldValue } from './mockDb.js';

dotenv.config();

const projectId = process.env.FIREBASE_PROJECT_ID || 'demo-boomzy';
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

let adminApp: App;
let db: any;
let auth: any;
let FieldValue: any;

const useMock = process.env.USE_MOCK_FIRESTORE === 'true';

// Setup app context
if (projectId && clientEmail && privateKey) {
  adminApp = initializeApp({
    credential: cert({
      projectId,
      clientEmail,
      privateKey,
    }),
  });
  console.log(`[Firebase] Initialized with service account: ${clientEmail}`);
} else {
  // Demo or Local development mode
  adminApp = initializeApp({ projectId });
  console.log(`[Firebase] Initialized with Project ID: ${projectId}`);
}

// Select database implementation
if (useMock) {
  console.log('[Firebase] USING IN-MEMORY MOCK FIRESTORE DATABASE');
  db = createMockFirestore();
  FieldValue = MockFieldValue;
} else {
  console.log('[Firebase] Using Live/Emulator Firestore SDK');
  db = getFirestore(adminApp);
  FieldValue = AdminFieldValue;
}

auth = getAuth(adminApp);

export { db, auth, adminApp, FieldValue };
