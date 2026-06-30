import { jsonResponse, type PagesHandler } from "../_shared";

export const onRequestGet: PagesHandler = ({ env }) => {
  return jsonResponse({
    success: true,
    appsScriptConfigured: Boolean(env.APPS_SCRIPT_WEBHOOK_URL && env.APPS_SCRIPT_SHARED_SECRET),
  });
};
