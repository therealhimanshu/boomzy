/**
 * Analytics Event Tracking API Routes
 *
 * Captures front-end analytics events and provides aggregated summaries.
 *
 * Public:
 *   POST /event     — Track a single analytics event
 *
 * Protected (requireAdmin):
 *   GET /summary    — Aggregated analytics dashboard data
 */

import { Router, type Request, type Response } from 'express';
import { db, FieldValue } from '../config/firebase.js';
import { requireAdmin } from '../middleware/auth.js';

const router = Router();

const analyticsCollection = db.collection('analytics');

/** Accepted event types */
const VALID_EVENT_TYPES = [
  'page_view',
  'scroll_depth',
  'ab_variant_view',
  'cta_click',
  'lead_submit',
] as const;

type EventType = (typeof VALID_EVENT_TYPES)[number];

// ──────────────────────────────────────────────
//  POST /event — Track event (public)
// ──────────────────────────────────────────────
router.post('/event', async (req: Request, res: Response) => {
  try {
    const { eventType, data, sessionId } = req.body as {
      eventType?: string;
      data?: Record<string, unknown>;
      sessionId?: string;
    };

    if (
      !eventType ||
      !VALID_EVENT_TYPES.includes(eventType as EventType)
    ) {
      res.status(400).json({
        success: false,
        message: `eventType must be one of: ${VALID_EVENT_TYPES.join(', ')}`,
      });
      return;
    }

    await analyticsCollection.add({
      eventType,
      data: data ?? null,
      sessionId: sessionId ?? null,
      timestamp: FieldValue.serverTimestamp(),
    });

    res.status(201).json({ success: true });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'Internal server error';
    console.error('[Analytics] POST /event error:', message);
    res.status(500).json({ success: false, message });
  }
});

// ──────────────────────────────────────────────
//  GET /summary — Aggregated analytics (admin only)
// ──────────────────────────────────────────────
router.get('/summary', requireAdmin, async (_req: Request, res: Response) => {
  try {
    const snapshot = await analyticsCollection.get();

    // Counters
    let totalPageViews = 0;
    let totalLeads = 0;
    const eventCounts: Record<string, number> = {};
    const abDistribution: Record<string, number> = {};
    let scrollDepthSum = 0;
    let scrollDepthCount = 0;

    for (const doc of snapshot.docs) {
      const record = doc.data() as {
        eventType: string;
        data?: Record<string, unknown> | null;
      };

      const { eventType, data } = record;

      // Count by event type
      eventCounts[eventType] = (eventCounts[eventType] ?? 0) + 1;

      if (eventType === 'page_view') {
        totalPageViews++;
      }

      if (eventType === 'lead_submit') {
        totalLeads++;
      }

      // A/B variant distribution
      if (eventType === 'ab_variant_view' && data) {
        const variant = String(data.variant ?? data.variantId ?? 'unknown');
        abDistribution[variant] = (abDistribution[variant] ?? 0) + 1;
      }

      // Scroll depth averaging
      if (eventType === 'scroll_depth' && data) {
        const depth = Number(data.depth ?? data.scrollDepth ?? 0);
        if (!Number.isNaN(depth)) {
          scrollDepthSum += depth;
          scrollDepthCount++;
        }
      }
    }

    const conversionRate =
      totalPageViews > 0
        ? parseFloat(((totalLeads / totalPageViews) * 100).toFixed(2))
        : 0;

    const scrollDepthAvg =
      scrollDepthCount > 0
        ? parseFloat((scrollDepthSum / scrollDepthCount).toFixed(2))
        : 0;

    res.json({
      success: true,
      summary: {
        totalPageViews,
        totalLeads,
        conversionRate,
        abDistribution,
        scrollDepthAvg,
        eventCounts,
      },
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'Internal server error';
    console.error('[Analytics] GET /summary error:', message);
    res.status(500).json({ success: false, message });
  }
});

export default router;
