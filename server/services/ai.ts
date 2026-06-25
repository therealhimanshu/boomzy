/**
 * Gemini AI Lead Scoring Service
 *
 * Uses Google's Gemini 2.0 Flash model to score incoming leads on a
 * 1–100 scale and produce a one-line insight for the sales team.
 */

import { GoogleGenAI } from '@google/genai';

/** Shape of a lead passed in for scoring */
interface LeadInput {
  firstName: string;
  lastName: string;
  email: string;
  budget: string;
}

/** Result returned by the scoring function */
interface ScoreResult {
  score: number;
  insight: string;
}

/** Fallback result when scoring fails */
const FALLBACK_RESULT: ScoreResult = {
  score: 50,
  insight: 'Unable to score — manual review needed',
};

/**
 * Build the scoring prompt for Gemini.
 */
function buildPrompt(lead: LeadInput): string {
  return `You are a B2B lead-scoring assistant. Analyse the following lead and return a JSON object with exactly two keys:
- "score": an integer from 1 to 100
- "insight": a single-sentence explanation of the score

Scoring guidelines:
1. Budget tier weight (40 %):
   • "$50k+"       → base 85-100
   • "$25k - $50k" → base 65-84
   • "$10k - $25k" → base 45-64
   • "$5k - $10k"  → base 25-44
2. Email domain weight (30 %):
   • Corporate / company domains score higher.
   • Free providers (gmail, hotmail, yahoo, outlook) score lower.
3. Overall professional assessment (30 %):
   • Consider the name and any other contextual signals.

Lead details:
  Name:   ${lead.firstName} ${lead.lastName}
  Email:  ${lead.email}
  Budget: ${lead.budget}

Return ONLY valid JSON. No markdown fences, no extra text.`;
}

/**
 * Attempt to parse a numeric score and insight string from the model
 * response text. Handles both clean JSON and text that wraps JSON.
 */
function parseResponse(text: string): ScoreResult | null {
  try {
    // Strip optional markdown code fences
    const cleaned = text
      .replace(/```json\s*/gi, '')
      .replace(/```\s*/g, '')
      .trim();

    const parsed = JSON.parse(cleaned) as Record<string, unknown>;

    const score = Number(parsed.score);
    const insight =
      typeof parsed.insight === 'string'
        ? parsed.insight.trim()
        : String(parsed.insight ?? '');

    if (Number.isNaN(score) || score < 1 || score > 100 || !insight) {
      return null;
    }

    return { score: Math.round(score), insight };
  } catch {
    return null;
  }
}

/**
 * Score a lead using Gemini 2.0 Flash.
 *
 * Returns a score (1-100) and a one-line insight. On any failure the
 * function returns a safe fallback so callers never need to handle errors.
 */
export async function scoreLead(lead: LeadInput): Promise<ScoreResult> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.warn('[AI] GEMINI_API_KEY not set — returning fallback score');
    return FALLBACK_RESULT;
  }

  try {
    const genai = new GoogleGenAI({ apiKey });

    const response = await genai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: buildPrompt(lead),
      config: {
        temperature: 0.3, // low temperature for deterministic scoring
        maxOutputTokens: 256,
      },
    });

    const text = response.text?.trim();

    if (!text) {
      console.warn('[AI] Empty response from Gemini — returning fallback');
      return FALLBACK_RESULT;
    }

    const result = parseResponse(text);

    if (!result) {
      console.warn(
        '[AI] Could not parse Gemini response — returning fallback. Raw:',
        text
      );
      return FALLBACK_RESULT;
    }

    return result;
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'Unknown AI error';
    console.error('[AI] Lead scoring failed:', message);
    return FALLBACK_RESULT;
  }
}
