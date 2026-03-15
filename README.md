# Smurl

Smurl is a full-stack URL shortener that turns long links into short, shareable URLs. Create custom short links, track clicks, and view analytics from a simple dashboard—all with user accounts and a fast, cached redirect experience.

## Product Description

Smurl lets you shorten any URL and optionally set a custom alias and expiration date. Each short link redirects visitors to the original URL while recording analytics (clicks, country, browser, referrer). The app uses Redis to cache redirects for speed and PostgreSQL for persistent data. You get a clean dashboard to create, list, and manage your short URLs and view per-link analytics with charts.

## Features

- **User accounts** – Register and log in with JWT-based authentication
- **Short URL creation** – Generate Base62 short codes (6–8 chars) or use custom aliases
- **Optional expiration** – Set an expiration date for any short link
- **Fast redirects** – Redis caching for quick redirects and lower database load
- **Dashboard** – Create short URLs, list and paginate yours, copy links, delete URLs
- **Click tracking** – Total clicks per link with timestamps
- **Analytics** – Country, browser, referrer, and charts (e.g. by country and browser)
- **API docs** – Swagger documentation at `/docs`
