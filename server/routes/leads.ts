/**
 * Lead Management API Routes
 *
 * CRUD operations for sales leads with AI scoring integration.
 *
 * Public:
 *   POST /          — Create a new lead (validated by validateLead)
 *
 * Protected (requireAdmin):
 *   GET /           — List leads with optional filters
 *   PATCH /:id      — Update lead status
 *   DELETE /:id     — Delete a lead
 */

import { Router, type Request, type Response } from 'express';
import { db, FieldValue } from '../config/firebase.js';
import { validateLead } from '../middleware/validate.js';
import { requireAdmin } from '../middleware/auth.js';
import { scoreLead } from '../services/ai.js';

const router = Router();

/** Valid lead statuses */
const VALID_STATUSES = ['new', 'contacted', 'qualified', 'closed'] as const;
type LeadStatus = (typeof VALID_STATUSES)[number];

const leadsCollection = db.collection('leads');

// ──────────────────────────────────────────────
//  POST / — Create new lead (public, validated)
// ──────────────────────────────────────────────
router.post('/', validateLead, async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, budget } = req.body as {
      firstName: string;
      lastName: string;
      email: string;
      budget: string;
    };

    // Duplicate check — same email in the last 24 hours
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const duplicateSnap = await leadsCollection
      .where('email', '==', email)
      .where('createdAt', '>=', twentyFourHoursAgo)
      .limit(1)
      .get();

    if (!duplicateSnap.empty) {
      res.status(409).json({
        success: false,
        message: 'A submission with this email was received recently',
      });
      return;
    }

    // Persist the lead
    const docRef = await leadsCollection.add({
      firstName,
      lastName,
      email,
      budget,
      status: 'new' as LeadStatus,
      source: 'website',
      aiScore: null,
      aiInsight: null,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });

    // Fire-and-forget AI scoring — don't block the response
    scoreLead({ firstName, lastName, email, budget })
      .then(async (result) => {
        await leadsCollection.doc(docRef.id).update({
          aiScore: result.score,
          aiInsight: result.insight,
          updatedAt: FieldValue.serverTimestamp(),
        });
        console.log(
          `[Leads] AI scored lead ${docRef.id}: ${result.score}/100`
        );
      })
      .catch((err: unknown) => {
        console.error(`[Leads] AI scoring failed for ${docRef.id}:`, err);
      });

    res.status(201).json({ success: true, id: docRef.id });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'Internal server error';
    console.error('[Leads] POST / error:', message);
    res.status(500).json({ success: false, message });
  }
});

// ──────────────────────────────────────────────
//  GET / — List leads (admin only)
// ──────────────────────────────────────────────
router.get('/', requireAdmin, async (req: Request, res: Response) => {
  try {
    const { status, limit: limitParam } = req.query;
    const limit = Math.min(
      Math.max(parseInt(limitParam as string, 10) || 50, 1),
      200
    );

    let query = leadsCollection.orderBy('createdAt', 'desc');

    if (status && VALID_STATUSES.includes(status as LeadStatus)) {
      query = query.where('status', '==', status);
    }

    const snapshot = await query.limit(limit).get();
    const leads = snapshot.docs.map((doc: any) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json({ success: true, leads, total: leads.length });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'Internal server error';
    console.error('[Leads] GET / error:', message);
    res.status(500).json({ success: false, message });
  }
});

// ──────────────────────────────────────────────
//  PATCH /:id — Update lead status (admin only)
// ──────────────────────────────────────────────
router.patch('/:id', requireAdmin, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body as { status?: string };

    if (!status || !VALID_STATUSES.includes(status as LeadStatus)) {
      res.status(400).json({
        success: false,
        message: `Status must be one of: ${VALID_STATUSES.join(', ')}`,
      });
      return;
    }

    const docRef = leadsCollection.doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      res.status(404).json({ success: false, message: 'Lead not found' });
      return;
    }

    await docRef.update({
      status,
      updatedAt: FieldValue.serverTimestamp(),
    });

    res.json({ success: true });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'Internal server error';
    console.error(`[Leads] PATCH /${req.params.id} error:`, message);
    res.status(500).json({ success: false, message });
  }
});

// ──────────────────────────────────────────────
//  DELETE /:id — Delete lead (admin only)
// ──────────────────────────────────────────────
router.delete('/:id', requireAdmin, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const docRef = leadsCollection.doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      res.status(404).json({ success: false, message: 'Lead not found' });
      return;
    }

    await docRef.delete();
    res.json({ success: true });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'Internal server error';
    console.error(`[Leads] DELETE /${req.params.id} error:`, message);
    res.status(500).json({ success: false, message });
  }
});

export default router;
