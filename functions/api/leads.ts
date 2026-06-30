import {
  getRequestMeta,
  hasSpamTrap,
  jsonResponse,
  methodNotAllowed,
  normalizeText,
  readJsonBody,
  sendToAppsScript,
  upstreamError,
  validationError,
  type FieldError,
  type PagesHandler,
} from "../_shared";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const WEBSITE_PATTERN = /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/[^\s]*)?$/i;
const BUDGET_OPTIONS = new Set([
  "₹5k - ₹10k",
  "₹10k - ₹25k",
  "₹25k - ₹50k",
  "₹50k+",
]);

export const onRequestGet: PagesHandler = () => methodNotAllowed();

export const onRequestPost: PagesHandler = async ({ request, env }) => {
  const body = await readJsonBody(request);

  if (!body || typeof body !== "object") {
    return validationError([{ field: "form", message: "Invalid form submission." }]);
  }

  if (hasSpamTrap((body as Record<string, unknown>).botField)) {
    return jsonResponse({ success: true });
  }

  const input = body as Record<string, unknown>;
  const firstName = normalizeText(input.firstName, 80);
  const lastName = normalizeText(input.lastName, 80);
  const email = normalizeText(input.email, 160).toLowerCase();
  const companyWebsite = normalizeText(input.companyWebsite, 240);
  const location = normalizeText(input.location, 180);
  const budget = normalizeText(input.budget, 80);
  const message = normalizeText(input.message, 1000);
  const source = normalizeText(input.source, 80) || "contact";
  const errors: FieldError[] = [];

  if (!firstName) errors.push({ field: "firstName", message: "First name is required" });
  if (!lastName) errors.push({ field: "lastName", message: "Last name is required" });
  if (!email) {
    errors.push({ field: "email", message: "Email is required" });
  } else if (!EMAIL_PATTERN.test(email)) {
    errors.push({ field: "email", message: "Please enter a valid work email" });
  }
  if (!BUDGET_OPTIONS.has(budget)) {
    errors.push({ field: "budget", message: "Please choose a matching media budget" });
  }
  if (companyWebsite && !WEBSITE_PATTERN.test(companyWebsite)) {
    errors.push({ field: "companyWebsite", message: "Please enter a valid website URL" });
  }

  if (errors.length > 0) {
    return validationError(errors);
  }

  try {
    await sendToAppsScript(env, {
      type: "lead",
      data: { firstName, lastName, email, companyWebsite, location, budget, message, source },
      meta: getRequestMeta(request),
    });

    return jsonResponse({ success: true });
  } catch (error) {
    return upstreamError(error);
  }
};
