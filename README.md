<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.
https://ai.studio/apps/2b5d0f6d-1e6c-4725-b62c-8682c0602a1d

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the frontend only:
   `npm run dev`

4. Run the frontend and API together for forms, analytics, and admin data:
   `npm run dev:full`

Analytics calls are disabled by default in frontend-only Vite development to avoid noisy proxy errors when the API server is not running. Set `VITE_ENABLE_DEV_ANALYTICS="true"` when you want to test analytics locally with `npm run dev:full`.
