# Smurl

Smurl lets you shorten any URL and optionally set a custom alias and expiration date. Each short link redirects visitors to the original URL while recording analytics (clicks, country, browser, referrer). The app uses Redis to cache redirects for speed and PostgreSQL for persistent data. You get a clean dashboard to create, list, and manage your short URLs and view per-link analytics with charts.

## Features
## Key Features

- **URL Shortener** - Create short URLs from long links (public and logged-in flow).
- **Custom Alias** - Use your own short code when available.
- **Expiration Support** - Set expiry date/time for links.
- **Link Scheduling** - Set active from/to window for temporary campaigns.
- **Folders** - Organize links by folders and filter by folder.
- **Bulk CSV Import** - Import multiple URLs at once.
- **Dashboard Management** - Search, filter, edit, and delete URLs.
- **Analytics** - Track clicks, country, browser, and referrer.
- **Charts + Export** - Visual analytics charts and CSV download.
- **QR Code Support** - Generate and download QR for short links.
- **API Keys** - Create/revoke API keys for API-based shortening.
- **Custom Domains** - Use branded domains for short links.
- **Authentication** - JWT login/register plus API key auth support.
- **API Docs** - Swagger docs available at `/docs`.

## Tech Stack

- **Frontend:** React, TypeScript, Vite, React Query, Tailwind, Recharts
- **Backend:** Fastify, TypeScript, TypeORM
- **Data:** PostgreSQL + Redis
- **Auth:** JWT + API key auth support
