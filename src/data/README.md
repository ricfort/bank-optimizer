# Data Configuration Guide

This directory contains the JSON files that power the Portfolio Intelligence Platform demo.

## Files Overview

### 1. `customers.json`
Contains the list of clients that can be selected in the dropdown.

**Structure:**
```json
[
  {
    "id": 1,
    "name": "Client Name",
    "type": "Client Type"
  }
]
```

### 2. `topCompanies.json` ⭐ **EDIT THIS FOR YOUR DEMO**
Contains the **TOP 10 companies** that will be displayed after clicking "Optimize Portfolio (Top 10)".

- These are the companies that "pass" the Scout AI filter
- **Edit this file** to customize which companies appear in your demo
- The structure has separate arrays for each customer ID

**Structure:**
```json
{
  "1": [ /* Array of 10 companies for customer ID 1 */ ],
  "2": [ /* Array of 10 companies for customer ID 2 */ ]
}
```

Each company object includes:
- `id`: Unique identifier
- `name`: Company name
- `confidence`: Market score (0-100)
- `confidenceB`: Client fit score (0-100) - used in Customer Persona AI Analysis
- `logo`: URL to company logo (or leave empty for initials)
- `revenue`: Revenue string (e.g., "$125M")
- `ebitda`: EBITDA string (e.g., "$38M")
- `shareholders`: Array of shareholder names
- `reasoning`: Investment rationale text

### 3. `config.json` (All Companies Database)
Contains the **FULL LIST** of all companies (~100) for each customer.

- This is the initial pool before optimization
- The first 10 companies in each customer's array should match `topCompanies.json` for consistency
- You can add/edit companies here to expand the full database

## How It Works

1. **Initial Load**: When you select a customer, all companies from `config.json` are loaded (e.g., 100 companies)
2. **Optimize Portfolio**: When clicking "✨ AI Optimize Portfolio (Top 10)", the app shows the 10 companies from `topCompanies.json`
3. **Customer Persona AI**: Further refines to top 5 based on `confidenceB` scores

## Quick Setup for Your Demo

### Option A: Quick Edit (Recommended)
1. Edit `topCompanies.json` - replace the 10 companies with your target companies
2. Make sure the first 10 companies in `config.json` match your `topCompanies.json` entries
3. Done! The rest of the 90 companies in `config.json` can stay as-is

### Option B: Full Customization
1. Edit `customers.json` to change client names/types
2. Edit `topCompanies.json` with your target companies
3. Edit `config.json` to customize the full company database

## Tips

- Keep `confidence` scores high (91-100) for companies in `topCompanies.json` so they naturally rank at the top
- Use `confidenceB` to control which companies get highlighted in the final Customer Persona analysis
- Logo URLs can use services like [DiceBear](https://dicebear.com) or real company logos
- Empty logo field will display company initials with a colored background

