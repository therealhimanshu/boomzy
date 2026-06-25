/**
 * Request Validation Middleware
 *
 * Provides validation middleware for lead submissions and email-based
 * endpoints (newsletter). Returns a consistent error format on failure.
 */

import type { Request, Response, NextFunction } from 'express';

/** Individual field validation error */
interface ValidationError {
  field: string;
  message: string;
}

/** Standard validation error response body */
interface ValidationErrorResponse {
  success: false;
  errors: ValidationError[];
}

/** Allowed budget tiers for lead submissions */
const VALID_BUDGETS = [
  '₹5k - ₹10k',
  '₹10k - ₹25k',
  '₹25k - ₹50k',
  '₹50k+',
] as const;

type BudgetTier = (typeof VALID_BUDGETS)[number];

/**
 * RFC 5322–simplified email regex.
 * Good enough for form validation; not a full RFC parser.
 */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Send a 400 response with a consistent validation error payload.
 */
function sendValidationError(
  res: Response,
  errors: ValidationError[]
): Response<ValidationErrorResponse> {
  return res.status(400).json({ success: false, errors });
}

/**
 * Validates the request body for lead creation.
 *
 * Required fields:
 *  - firstName  (non-empty string)
 *  - lastName   (non-empty string)
 *  - email      (valid email format)
 *  - budget     (one of the allowed budget tiers)
 */
export function validateLead(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const errors: ValidationError[] = [];
  const { firstName, lastName, email, budget } = req.body ?? {};

  // --- firstName ---
  if (!firstName || typeof firstName !== 'string' || firstName.trim() === '') {
    errors.push({ field: 'firstName', message: 'First name is required' });
  }

  // --- lastName ---
  if (!lastName || typeof lastName !== 'string' || lastName.trim() === '') {
    errors.push({ field: 'lastName', message: 'Last name is required' });
  }

  // --- email ---
  if (!email || typeof email !== 'string' || email.trim() === '') {
    errors.push({ field: 'email', message: 'Email is required' });
  } else if (!EMAIL_REGEX.test(email.trim())) {
    errors.push({ field: 'email', message: 'Email format is invalid' });
  }

  // --- budget ---
  if (!budget || typeof budget !== 'string') {
    errors.push({ field: 'budget', message: 'Budget is required' });
  } else if (!VALID_BUDGETS.includes(budget as BudgetTier)) {
    errors.push({
      field: 'budget',
      message: `Budget must be one of: ${VALID_BUDGETS.join(', ')}`,
    });
  }

  if (errors.length > 0) {
    sendValidationError(res, errors);
    return;
  }

  // Normalise whitespace before proceeding
  req.body.firstName = (firstName as string).trim();
  req.body.lastName = (lastName as string).trim();
  req.body.email = (email as string).trim().toLowerCase();

  next();
}

/**
 * Validates the request body for email-based endpoints (e.g. newsletter).
 *
 * Required fields:
 *  - email   (valid email format)
 *
 * Optional fields:
 *  - source  (defaults to 'website')
 */
export function validateEmail(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const errors: ValidationError[] = [];
  const { email, source } = req.body ?? {};

  // --- email ---
  if (!email || typeof email !== 'string' || email.trim() === '') {
    errors.push({ field: 'email', message: 'Email is required' });
  } else if (!EMAIL_REGEX.test(email.trim())) {
    errors.push({ field: 'email', message: 'Email format is invalid' });
  }

  if (errors.length > 0) {
    sendValidationError(res, errors);
    return;
  }

  // Normalise and default
  req.body.email = (email as string).trim().toLowerCase();
  req.body.source =
    source && typeof source === 'string' ? source.trim() : 'website';

  next();
}
