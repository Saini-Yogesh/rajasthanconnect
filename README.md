# 🧭 Rajasthan Connect Portal

> **Official Repository for rajasthanconnect.in** — Bridging the Royal Heritage, Local Tourism Providers, and Global Travelers of Rajasthan.

---

## 🌟 Purpose of the Platform

**Rajasthan Connect** is a unified digital portal designed to bring the rich culture, historic landmarks, local guides, and artisanal workshops of Rajasthan directly to travelers worldwide. 

In a market often dominated by major booking consolidators, **rajasthanconnect.in** serves a double purpose:
1. **Empowering Local Businesses**: Providing small-scale guides, heritage stays, local transport providers, and traditional craftsmen (like blue pottery artists and puppeteers) with a direct, zero-commission channel to advertise their services and receive contact directly via WhatsApp/Phone.
2. **Enriching the Traveler Experience**: Offering tourists verified, catalog-quality recommendations, cultural etiquette tips (like saying *Khamma Ghani*), festival calendars, and direct service filter capabilities across Rajasthan's primary hubs.

---

## ✨ Features

- 🏰 **City Explorer Guide**: Curated snapshots, best travel seasons, and key landmarks for Jaipur (The Pink City), Udaipur (The City of Lakes), Jodhpur (The Blue City), and Jaisalmer (The Golden City).
- 🎨 **Heritage & Crafts Spotlight**: Dedicated profiles highlighting local artisan heritage like Jaipur Blue Pottery, Traditional Kathputli Puppetry, Sanganeri Block Print, and culinary Dal Baati Churma feasts.
- 📞 **Interactive Verified Directory**: A live directory mapping contacts across categories (Guides, Artisans, Stays, Experiences). Visitors can filter services instantly by category or search terms, and connect directly.
- 📝 **Provider Self-Registration Hub**: A local onboarding form allowing guides and stays to register their information for verification and directory mapping.
- 📅 **Festivals & Etiquette Accordion**: Helping travelers navigate cultural guidelines and scheduling trips around massive seasonal events (Pushkar Camel Fair, Desert Festival, Mewar Fest).
- 🚀 **Full Production SEO**: Ready out-of-the-box with customized JSON-LD structured schemas, OpenGraph card tags for social sharing, crawling directives (`robots.txt`), and indexed maps (`sitemap.xml`).

---

## 🛠️ Tech Stack & Architecture

The application is built for high performance and fast client-side loading:
- **Framework**: React 19 (via Vite)
- **Styling**: Pure CSS organized in a modular structure:
  - Global variable definitions are set inside `src/index.css`.
  - Component files are paired with matching styling files named as `[ComponentName]css.css` (e.g. `Navbar.jsx` maps with `Navbarcss.css`).
- **Icons**: Lucide React vector icons.
- **Media**: Custom-generated high-resolution PNG assets for city backdrops.

---

## 🚀 Local Installation & Setup

Ensure you have [Node.js](https://nodejs.org/) installed, then follow these steps:

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Local Development Server
We have configured a custom start command for easy launching:
```bash
npm start
# or alternatively
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser to view the interactive site.

### 3. Build for Production
Compiles and minimizes all assets into static chunks inside the `dist/` directory:
```bash
npm run build
```

---

## 📡 Production Deployment

This project is **two services**: a Vite React frontend and an Express API backend.

### 1. Deploy the backend (Railway, Render, Fly.io, VPS, etc.)

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `NODE_ENV` | Yes | Set to `production` |
| `PORT` | Auto | Set by most hosts (default `5000`) |
| `GROQ_API_KEY` or `GROQ_API_KEY_1` … `_10` | Optional | AI Planner & Ask AI via Groq (local fallback if unset) |
| `FRONTEND_URLS` | Recommended | Comma-separated CORS origins, e.g. `https://rajasthanconnect.in,https://www.rajasthanconnect.in` |
| `EMAILJS_*` | Optional | Business registration email notifications |
| `ENABLE_REDIS` / `REDIS_URL` | Optional | Response caching |

**Start command:** `npm start` (in the `backend/` folder)

**Health check:** `GET /health` — should return `{ "status": "healthy" }`

Copy `backend/.env.example` → `backend/.env` locally. On your host, set the same variables in the dashboard (never commit `.env`).

### 2. Deploy the frontend (Vercel)

1. Push this repo to GitHub and import it in [Vercel](https://vercel.com/new).
2. Vercel auto-detects Vite — `vercel.json` is already configured.
3. Add **Environment Variables** (Project → Settings → Environment Variables):

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_API_URL` | **Yes** | Live backend URL, e.g. `https://api.rajasthanconnect.in` (no trailing slash) |
| `VITE_GA_MEASUREMENT_ID` | Optional | Google Analytics 4 ID (`G-XXXXXXXXXX`) for traffic tracking |
| `VITE_SITE_URL` | Optional | `https://www.rajasthanconnect.in` (used for canonical URLs) |

4. Deploy — build runs `generate:sitemap` then `vite build`.
5. Add custom domain `rajasthanconnect.in` + `www.rajasthanconnect.in` in Vercel → Domains.

**Build command:** `npm run build`  
**Output directory:** `dist`

### 3. Google Search Console (indexing)

1. Go to [Google Search Console](https://search.google.com/search-console).
2. Add property `https://www.rajasthanconnect.in` (Domain or URL prefix).
3. Verify ownership — the meta tag is already in `index.html`:
   `google-site-verification` content=`bbeUh9qz3JRX393M4xYGV7QUBatmrkSaLRJzvR_Bj3A`
4. Submit sitemap: **`https://www.rajasthanconnect.in/sitemap.xml`**
   (Auto-generated on every build — includes 500+ city/place/food/festival URLs.)
5. Use **URL Inspection** → Request Indexing for homepage and top city pages.

### 5. Google Analytics (optional)

1. Create a GA4 property at [analytics.google.com](https://analytics.google.com).
2. Copy the Measurement ID (`G-XXXXXXXXXX`).
3. Add `VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX` in Vercel env vars and redeploy.

### 6. Custom domain & backend CORS

- Point `rajasthanconnect.in` → frontend host (Vercel/Netlify)
- Point `api.rajasthanconnect.in` (or similar) → backend host
- Set `VITE_API_URL` to that API URL
- Set `FRONTEND_URLS` on the backend to your frontend domain(s)

### Security checklist

- `.env` and `backend/.env` are gitignored — **never commit them**
- No API keys are hardcoded in source code (Groq, EmailJS, DB all use env vars)
- CORS blocks unknown origins in production
- AI routes are rate-limited (15 req/min per IP)
- Error stack traces are hidden when `NODE_ENV=production`
