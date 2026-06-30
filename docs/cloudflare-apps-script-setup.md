# Cloudflare Pages + Apps Script Setup

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
   - `BOOMZY_NOTIFY_EMAIL`: optional email for lead/signup notifications
6. Deploy > New deployment.
7. Select Web app.
8. Set:
   - Execute as: Me
   - Who has access: Anyone
9. Deploy and copy the `/exec` web app URL.

## 3. Configure Cloudflare Pages

1. Open the Cloudflare dashboard.
2. Go to Workers & Pages > your Boomzy Pages project.
3. Settings > Environment variables.
4. Add these variables for Production and Preview:
   - `APPS_SCRIPT_WEBHOOK_URL`: the Apps Script `/exec` URL
   - `APPS_SCRIPT_SHARED_SECRET`: the same value as `BOOMZY_SHARED_SECRET`
   - `GEONAMES_USERNAME`: optional, enables international city/region suggestions
5. Save and redeploy.

## 4. Cloudflare Build Settings

Use these Pages settings:

- Framework preset: Vite
- Build command: `npm run build`
- Build output directory: `dist`
- Root directory: repository root

Cloudflare automatically detects the `functions/` directory and serves the API routes.

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
- The city/region selector uses GeoNames through the `/api/locations` Cloudflare Function. If `GEONAMES_USERNAME` is missing, the field still accepts manual text.
