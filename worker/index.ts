import { onRequestGet as healthGet } from "../functions/api/health";
import { onRequestPost as leadsPost } from "../functions/api/leads";
import { onRequestGet as locationsGet } from "../functions/api/locations";
import { jsonResponse, methodNotAllowed, type BoomzyFunctionEnv, type PagesHandler } from "../functions/_shared";

interface StaticAssetsBinding {
  fetch(request: Request): Promise<Response>;
}

interface WorkerEnv extends BoomzyFunctionEnv {
  ASSETS: StaticAssetsBinding;
}

function runHandler(handler: PagesHandler<WorkerEnv>, request: Request, env: WorkerEnv) {
  return handler({ request, env });
}

function apiNotFound() {
  return jsonResponse({ success: false, message: "API route not found." }, { status: 404 });
}

export default {
  async fetch(request: Request, env: WorkerEnv): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/api/health") {
      if (request.method !== "GET") return methodNotAllowed();
      return runHandler(healthGet, request, env);
    }

    if (url.pathname === "/api/leads") {
      if (request.method !== "POST") return methodNotAllowed();
      return runHandler(leadsPost, request, env);
    }

    if (url.pathname === "/api/locations") {
      if (request.method !== "GET") return methodNotAllowed();
      return runHandler(locationsGet, request, env);
    }

    if (url.pathname.startsWith("/api/")) {
      return apiNotFound();
    }

    return env.ASSETS.fetch(request);
  },
};
