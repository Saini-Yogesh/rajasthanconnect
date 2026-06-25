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

Since this is a Vite-based single-page application (SPA), it is highly compatible with modern serverless hosting providers. To connect your custom domain **`rajasthanconnect.in`**, deploy the code using one of these options:

- **Vercel / Netlify**: Connect this GitHub repository. Set the Build Command to `npm run build` and Publish Directory to `dist`. Add your custom domain in the project settings.
- **GitHub Pages**: Build the bundle and deploy it to a dedicated branch. Ensure your `CNAME` file under `public/` points to `rajasthanconnect.in`.
