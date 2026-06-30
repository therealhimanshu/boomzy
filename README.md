<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Boomzy Website

This project is a Vite/React website deployed on Cloudflare Pages. Public lead submissions are handled by Cloudflare Pages Functions and forwarded to Google Apps Script, which writes into Google Sheets.

## Run Locally

**Prerequisites:**  Node.js

1. Install dependencies:
   `npm install`
2. Run the frontend:
   `npm run dev`

The Vite dev server serves the website only. To test Cloudflare Pages Functions locally, build first and run through Wrangler:

```bash
npm run build
npx wrangler pages dev dist
```

## Form Backend

The active API endpoints are:

- `POST /api/leads`
- `GET /api/locations`
- `GET /api/health`

Set these Cloudflare Pages environment variables:

- `APPS_SCRIPT_WEBHOOK_URL`
- `APPS_SCRIPT_SHARED_SECRET`
- `GEONAMES_USERNAME` optional, enables city/region suggestions in the contact form

The Apps Script source is in [apps-script/Code.gs](apps-script/Code.gs). Copy it into a Google Apps Script project, set its script properties, and deploy it as a web app.
