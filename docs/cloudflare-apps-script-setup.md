# Cloudflare Worker + Apps Script Setup

## 1. Create The Google Sheet

1. Create a Google Sheet named `Boomzy Leads`.
2. Copy the Sheet ID from the URL.
   - In `https://docs.google.com/spreadsheets/d/SHEET_ID/edit`, copy `SHEET_ID`.
3. The Apps Script will create this tab automatically:
   - `Leads`

## 2. Create The Apps Script Webhook

1. Open the Sheet.
2. Go to Extensions > Apps Script.
3. Replace the starter code with `apps-script/Code.gs` from this repo.
4. Open Project Settings > Script properties.
5. Add:
   - `BOOMZY_SHEET_ID`: your Google Sheet ID
   - `BOOMZY_SHARED_SECRET`: a long random secret
   - `BOOMZY_NOTIFY_EMAIL`: optional email for lead notifications
6. Deploy > New deployment.
7. Select Web app.
8. Set:
   - Execute as: Me
   - Who has access: Anyone
9. Deploy and copy the `/exec` web app URL.

## 3. Configure Cloudflare Worker Secrets

1. Open the Cloudflare dashboard.
2. Go to Workers & Pages > your Boomzy Worker.
3. After the first deploy with `wrangler.toml` and `worker/index.ts`, open Settings > Variables and Secrets.
4. Add these runtime secrets:
   - `APPS_SCRIPT_WEBHOOK_URL`: the Apps Script `/exec` URL
   - `APPS_SCRIPT_SHARED_SECRET`: the same value as `BOOMZY_SHARED_SECRET`
   - `GEONAMES_USERNAME`: optional, can be a variable or secret and enables international city/region suggestions
5. Save and redeploy.

## 4. Cloudflare Build Settings

Use these Worker build settings:

- Build command: `npm run build`
- Deploy command: `npx wrangler deploy`
- Root directory: repository root

The `wrangler.toml` file points Cloudflare to `worker/index.ts` for API routes and `dist` for static website assets.

## 5. Test After Deploy

1. Visit `https://YOUR_DOMAIN/api/health`.
2. Confirm `appsScriptConfigured` is `true`.
3. Submit the contact form.
4. Check the `Leads` tab in the Google Sheet.
5. If `GEONAMES_USERNAME` is configured, type a city in the contact form and confirm suggestions appear.

## Notes

- Keep the Apps Script URL and shared secret out of browser-exposed `VITE_` variables.
- If you redeploy Apps Script, update `APPS_SCRIPT_WEBHOOK_URL` in Cloudflare if the deployment URL changes.
- For heavier analytics, use Cloudflare Web Analytics or GA4 instead of writing every event to Sheets.
- The city/region selector uses GeoNames through the `/api/locations` Worker route. If `GEONAMES_USERNAME` is missing, the field still accepts manual text.
