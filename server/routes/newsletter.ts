/**
 * Newsletter Subscription API Routes
 *
 * Manages email newsletter subscriptions backed by Firestore.
 *
 * Public:
 *   POST /          — Subscribe an email (validated by validateEmail)
 *
 * Protected (requireAdmin):
 *   GET /           — List active subscribers
 *   DELETE /:id     — Unsubscribe (soft-delete via active flag)
 */

import { Router, type Request, type Response } from 'express';
import { db, FieldValue } from '../config/firebase.js';
import { validateEmail } from '../middleware/validate.js';
import { requireAdmin } from '../middleware/auth.js';

const router = Router();

const newsletterCollection = db.collection('newsletter');

// ──────────────────────────────────────────────
//  POST / — Subscribe (public, validated)
// ──────────────────────────────────────────────
router.post('/', validateEmail, async (req: Request, res: Response) => {
  try {
    const { email, source } = req.body as { email: string; source: string };

    // Check for existing active subscription
    const existingSnap = await newsletterCollection
      .where('email', '==', email)
      .where('active', '==', true)
      .limit(1)
      .get();

    if (!existingSnap.empty) {
      res.status(409).json({
        success: false,
        message: 'This email is already subscribed',
      });
      return;
    }

    await newsletterCollection.add({
      email,
      source,
      active: true,
      subscribedAt: FieldValue.serverTimestamp(),
    });

    res.status(201).json({ success: true });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'Internal server error';
    console.error('[Newsletter] POST / error:', message);
    res.status(500).json({ success: false, message });
  }
});

// ──────────────────────────────────────────────
//  GET / — List active subscribers (admin only)
// ──────────────────────────────────────────────
router.get('/', requireAdmin, async (_req: Request, res: Response) => {
  try {
    const snapshot = await newsletterCollection
      .where('active', '==', true)
      .orderBy('subscribedAt', 'desc')
      .get();

    const subscribers = snapshot.docs.map((doc: any) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json({ success: true, subscribers, total: subscribers.length });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'Internal server error';
    console.error('[Newsletter] GET / error:', message);
    res.status(500).json({ success: false, message });
  }
});

// ──────────────────────────────────────────────
//  DELETE /:id — Unsubscribe (admin only)
// ──────────────────────────────────────────────
router.delete('/:id', requireAdmin, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const docRef = newsletterCollection.doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      res.status(404).json({
        success: false,
        message: 'Subscription not found',
      });
      return;
    }

    await docRef.update({ active: false });
    res.json({ success: true });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'Internal server error';
    console.error(`[Newsletter] DELETE /${req.params.id} error:`, message);
    res.status(500).json({ success: false, message });
  }
});

export default router;
