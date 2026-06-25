/**
 * Admin Authentication Middleware
 *
 * Verifies Firebase ID tokens from the Authorization header and
 * attaches the decoded token to `req.user` for downstream handlers.
 */

import type { Request, Response, NextFunction } from 'express';
import type { DecodedIdToken } from 'firebase-admin/auth';
import { auth } from '../config/firebase.js';

/**
 * Extend the Express Request interface so that downstream handlers
 * can access `req.user` without casting.
 */
declare global {
  namespace Express {
    interface Request {
      user?: DecodedIdToken;
    }
  }
}

/**
 * Middleware that requires a valid Firebase Admin ID token.
 *
 * Expected header format:
 *   Authorization: Bearer <idToken>
 *
 * On success the decoded token is attached to `req.user`.
 * On failure an appropriate 401 JSON response is returned.
 */
export async function requireAdmin(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const authHeader = req.headers.authorization;

  // --- Missing header ---
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({
      success: false,
      message: 'Missing or malformed Authorization header',
    });
    return;
  }

  const idToken = authHeader.split('Bearer ')[1];

  if (!idToken) {
    res.status(401).json({
      success: false,
      message: 'No token provided',
    });
    return;
  }

  // Support local mock admin token bypass in development
  if (idToken === 'mock-admin-token' && process.env.USE_MOCK_FIRESTORE === 'true') {
    req.user = {
      uid: 'mock-admin-uid',
      email: 'admin@boomzy.agency',
      email_verified: true,
      auth_time: Math.floor(Date.now() / 1000),
      iss: 'https://securetoken.google.com/demo-boomzy-ignite',
      aud: 'demo-boomzy-ignite',
      exp: Math.floor(Date.now() / 1000) + 3600,
    } as any;
    next();
    return;
  }

  try {
    const decodedToken = await auth.verifyIdToken(idToken);
    req.user = decodedToken;
    next();
  } catch (error: unknown) {
    const firebaseError = error as { code?: string; message?: string };

    // Firebase Auth error codes for expired / revoked tokens
    if (
      firebaseError.code === 'auth/id-token-expired' ||
      firebaseError.code === 'auth/id-token-revoked'
    ) {
      res.status(401).json({
        success: false,
        message: 'Token has expired — please re-authenticate',
      });
      return;
    }

    console.error('[Auth] Token verification failed:', firebaseError.message);
    res.status(401).json({
      success: false,
      message: 'Invalid authentication token',
    });
  }
}
