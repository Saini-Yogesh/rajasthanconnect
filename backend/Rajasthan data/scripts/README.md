# 🕌 Rajasthan Connect - Database Seed Data Generator

This folder contains the AI-powered seed data generation script. It reads the raw names and lists from the `source/` directory, calls the AI to enrich each item with highly detailed, schema-compliant information, and stores the resulting JSON files in the `generated/` directory.

## 📋 Prerequisites

1. Ensure you have Node.js installed.
2. Ensure you have the `GEMINI_API_KEY` defined in your `backend/.env` file:
   ```env
   GEMINI_API_KEY=AQ.your_api_key_here
   ```

## 🚀 How to Run

Navigate to the `backend/Rajasthan data` directory first:
```bash
cd "backend/Rajasthan data"
```

### ⚡ Option A: Interactive Menu (Recommended)
We have provided a script that lets you select any table from a visual menu:
```bash
# Run the interactive script
scripts\generate_interactive.bat
```

### ⚡ Option B: Create Individual Shortcuts (One Batch File per Table)
If you want separate `.bat` files for each table in your scripts folder so you can run/click them directly, run the generator once:
```bash
node scripts/create_shortcuts.js
```
This will generate 20 files (e.g. `generate_districts.bat`, `generate_cities.bat`, etc.) inside the `scripts/` folder which you can execute directly!

---

## 🛠️ Option C: Manual CLI Execution

### 1. Test Run (Recommended)
Before running generation for all tables, test it on a small dataset (like `languages` which has only 17 items):
```bash
node scripts/generate_tables.js --table languages
```
This will:
- Create the target folder `backend/Rajasthan data/generated/` if it doesn't exist.
- Enrich each language one-by-one.
- Save each item to `backend/Rajasthan data/generated/languages.json` progressively.

### 2. Run for All Tables
To generate rich data for all 20 tables sequentially:
```bash
node scripts/generate_tables.js --all
```

### 3. Run for a Specific Table
To generate data for a single specific table:
```bash
node scripts/generate_tables.js --table <table_name>
```

To see all available tables, run:
```bash
node scripts/generate_tables.js --list
```

---

## 💾 Stateful Resumption & Stopping

Generating detailed data one item at a time is highly accurate but takes time (around 1.5 seconds per item to respect API rate limits). 

If the process is interrupted (due to rate limits, token expiration, network issues, or manual cancellation with `Ctrl+C`):
1. **Do not worry!** The script saves each record to the output file *immediately* after it is generated.
2. **Just run the command again.** The script will read the output JSON file, determine which items are already generated, skip them, and resume from exactly where it left off.
