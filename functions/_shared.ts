type EnvValue = string | undefined;

export interface BoomzyFunctionEnv {
  APPS_SCRIPT_WEBHOOK_URL?: EnvValue;
  APPS_SCRIPT_SHARED_SECRET?: EnvValue;
  GEONAMES_USERNAME?: EnvValue;
}

export interface PagesContext<Env extends BoomzyFunctionEnv = BoomzyFunctionEnv> {
  request: Request;
  env: Env;
}

export type PagesHandler<Env extends BoomzyFunctionEnv = BoomzyFunctionEnv> = (
  context: PagesContext<Env>
) => Response | Promise<Response>;

export interface FieldError {
  field: string;
  message: string;
}

interface AppsScriptPayload {
  type: "lead";
  data: Record<string, unknown>;
  meta: Record<string, string>;
}

const JSON_HEADERS = {
  "Content-Type": "application/json; charset=utf-8",
  "Cache-Control": "no-store",
};

export function jsonResponse(body: unknown, init: ResponseInit = {}) {
  const headers = new Headers(init.headers);
  Object.entries(JSON_HEADERS).forEach(([key, value]) => headers.set(key, value));

  return new Response(JSON.stringify(body), {
    ...init,
    headers,
  });
}

export async function readJsonBody(request: Request) {
  try {
    return await request.json();
  } catch {
    return null;
  }
}

export function methodNotAllowed() {
  return jsonResponse(
    { success: false, message: "This endpoint only accepts POST requests." },
    { status: 405 }
  );
}

export function validationError(errors: FieldError[]) {
  return jsonResponse(
    { success: false, message: "Please fix the highlighted fields.", errors },
    { status: 400 }
  );
}

export function normalizeText(value: unknown, maxLength = 240) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

export function hasSpamTrap(value: unknown) {
  return typeof value === "string" && value.trim().length > 0;
}

export function getRequestMeta(request: Request) {
  return {
    page: request.headers.get("Referer") ?? "",
    userAgent: request.headers.get("User-Agent") ?? "",
    ipCountry: request.headers.get("CF-IPCountry") ?? "",
  };
}

function getRequiredEnv(env: BoomzyFunctionEnv, key: keyof BoomzyFunctionEnv) {
  const value = env[key];
  if (!value) {
    throw new Error(`${key} is not configured`);
  }
  return value;
}

export async function sendToAppsScript(env: BoomzyFunctionEnv, payload: AppsScriptPayload) {
  const webhookUrl = getRequiredEnv(env, "APPS_SCRIPT_WEBHOOK_URL");
  const secret = getRequiredEnv(env, "APPS_SCRIPT_SHARED_SECRET");

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...payload,
      secret,
      submittedAt: new Date().toISOString(),
    }),
  });

  const text = await response.text();
  let result: { success?: boolean; message?: string } | null = null;

  try {
    result = text ? JSON.parse(text) : null;
  } catch {
    result = null;
  }

  if (!response.ok || result?.success === false) {
    throw new Error(result?.message || "Apps Script rejected the submission");
  }

  return result ?? { success: true };
}

export function upstreamError(error: unknown) {
  const message = error instanceof Error ? error.message : "Unknown submission error";
  console.error("[Forms API]", message);

  if (message.includes("APPS_SCRIPT_")) {
    return jsonResponse(
      { success: false, message: "The form endpoint is not configured yet." },
      { status: 500 }
    );
  }

  return jsonResponse(
    { success: false, message: "We could not save your submission. Please try again." },
    { status: 502 }
  );
}
