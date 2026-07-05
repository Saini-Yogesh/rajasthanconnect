# Image Finder

Find and update Pexels stock photos for Rajasthan Connect JSON data using **Groq prompt tuning** + **Pexels**.

## Setup

Add keys to `backend/.env`:

```env
GROQ_API_KEY=gsk_...
PEXELS_API_KEY=...   # https://www.pexels.com/api/ (free)
PEXELS_API_KEY_1=... # Add more keys for rate-limit fallback (up to _10)
PEXELS_API_KEY_2=...
```

## Run

**Easy way (Windows):** double-click or run:

```
backend/Rajasthan data/scripts/image_finder/find_images_interactive.bat
```

From `backend/`:

```bash
# Preview 3 cities (no file writes)
npm run images:find -- --dataset=cities --limit=3 --dry-run

# Update attire images
npm run images:find -- --dataset=attire

# All datasets, 10 records each
npm run images:find -- --all --limit=10

# Replace even existing Pexels URLs
npm run images:find -- --dataset=places --force

# Continue after rate-limit errors (reads last report)
npm run images:find -- --dataset=cities --retry-failed

# Skip Groq (name + hints only, no API call)
npm run images:find -- --dataset=foods --skip-groq --limit=5
```

## Dataset keys

`cities`, `places`, `foods`, `festivals`, `handicrafts`, `folk_arts`, `folk_music`, `attire`, `communities`, `unesco`, `experiences`, `royal_weddings`, `rulers`, `historical_events`, `dynasties`, `districts`, `directory`

**Not included:** `cultural_etiquette.json` (text-only, no image fields). `reviews.json` has no images.

## How it works

1. Reads records from `Rajasthan data/generated/*.json`
2. **Normal run** — skips records that already have a valid Pexels URL
3. **Rate limits (429)** — auto-waits and retries across multiple keys; saves each image immediately so progress isn't lost
4. **Re-run with `--retry-failed`** — only retries records that failed or hit rate limits last time
5. **`--force`** — re-fetches every image again
6. Sends record context to Groq → JSON with `pexels_query`, `alt_text`, etc.
7. Searches Pexels and writes URL back to `image_url` or `image_urls`
8. Saves a run report under `reports/run-*.json`
