# Post-MVP Data Enhancement Tasks

## Overview
These tasks will improve data accuracy and add regulatory classifications. Complete after MVP is deployed and stable.

---

## Task 1: CDSCO Verified Branded Drug Mapping
**Priority:** HIGH
**Impact:** Accurate savings calculations with official branded drug prices

### Description
Replace estimated MRP multipliers with actual branded drug prices from CDSCO (Central Drugs Standard Control Organization).

### Steps
1. **Download CDSCO datasets:**
   - Fixed Dose Combination (FDC) list: https://cdsco.gov.in/opencms/opencms/en/Home/
   - Branded Drug Master (if available via RTI or public disclosure)

2. **Create mapping script:**
   ```javascript
   // scripts/map-branded-drugs.cjs
   // Match salt names from JA product list to CDSCO branded equivalents
   // Use fuzzy string matching for salt name normalization
   ```

3. **Automated matching (80%):**
   - Use Claude API batch job for salt name matching
   - Input: JA generic name + salt composition
   - Output: Matched branded drugs with official MRP
   - Cost estimate: ~$5-10 for 2,500 products

4. **Manual QA (top 500):**
   - Verify highest-traffic medicines manually
   - Common categories: Diabetes, Cardiac, Antibiotics, Pain relief
   - Cross-reference with 1mg, PharmEasy, or local pharmacy data

### Acceptance Criteria
- [ ] 80%+ of products have verified branded equivalents
- [ ] Top 500 medicines manually verified
- [ ] Savings percentages reflect actual market prices

---

## Task 2: Add ATC Therapeutic Categories
**Priority:** MEDIUM
**Impact:** Better categorization and filtering for users

### Description
Map medicines to WHO ATC (Anatomical Therapeutic Chemical) classification system.

### Steps
1. **Download WHO ATC index:**
   - URL: https://www.whocc.no/atc_ddd_index/
   - Free download available

2. **Create salt → ATC lookup:**
   ```javascript
   // scripts/add-atc-categories.cjs
   // Map active ingredients to ATC codes
   // ATC structure: A (Alimentary), B (Blood), C (Cardiovascular), etc.
   ```

3. **Categories to prioritize:**
   - N02 - Analgesics (Pain relief)
   - C09 - Agents acting on renin-angiotensin system (Cardiac)
   - A10 - Drugs used in diabetes
   - A02 - Drugs for acid related disorders (Gastro)
   - J01 - Antibacterials
   - R06 - Antihistamines
   - D07 - Corticosteroids, dermatological preparations
   - R03 - Drugs for obstructive airway diseases (Respiratory)

4. **Update product schema:**
   ```json
   {
     "atcCode": "N02BE01",
     "atcCategory": "Analgesics",
     "atcSubcategory": "Pyrazolones"
   }
   ```

### Acceptance Criteria
- [ ] All products have ATC level 3 category
- [ ] Category filter works in UI
- [ ] Icons mapped to categories (pill, heart, etc.)

---

## Task 3: Schedule H / OTC Classification
**Priority:** MEDIUM
**Impact:** Regulatory compliance and user safety warnings

### Description
Classify medicines as prescription-required (Schedule H/H1) or over-the-counter (OTC).

### Steps
1. **Download CDSCO schedule list:**
   - Schedule H list (prescription drugs)
   - Schedule H1 list (antibiotics, habit-forming)
   - Schedule G (OTC with caution)
   - Non-scheduled (pure OTC)

2. **Convert PDF to JSON:**
   ```javascript
   // scripts/pdf-to-schedule-json.cjs
   // Use pdf-parse library
   // Extract drug names and schedule classifications
   ```

3. **Map to product list:**
   ```javascript
   // Match by generic name / salt
   // Handle combinations (e.g., Amoxicillin + Clavulanate → Schedule H)
   ```

4. **UI updates:**
   - Add "Prescription Required" badge
   - Show disclaimer: "Consult doctor before use"
   - Filter option: "Show only OTC medicines"

### Schema Addition
```json
{
  "schedule": "H",
  "prescriptionRequired": true,
  "warningText": "Schedule H drug - Prescription mandatory"
}
```

### Acceptance Criteria
- [ ] All products have schedule classification
- [ ] Prescription badge displays correctly
- [ ] Disclaimer shown for Schedule H/H1 drugs

---

## Task 4: Store Data Maintenance Pipeline
**Priority:** LOW
**Impact:** Keep store list current with new openings/closures

### Description
Set up automated refresh for store coordinates and new store additions.

### Current State
✅ Already have coordinates for 16,925 stores
⚠️ Should verify accuracy and update monthly

### Steps
1. **Verification script:**
   ```javascript
   // scripts/verify-store-coordinates.cjs
   // Spot-check 100 random stores against Google Maps
   // Flag stores with suspicious coordinates (ocean, foreign country, etc.)
   ```

2. **New store ingestion:**
   - Monitor janaushadhi.gov.in for new store announcements
   - Monthly diff against current dataset
   - Geocode new addresses using Nominatim (respect rate limits)

3. **Monthly cron job:**
   ```bash
   # Re-run transformation on updated source data
   0 2 1 * * node scripts/transform-data.cjs
   ```

### Acceptance Criteria
- [ ] Store count matches official Jan Aushadhi count
- [ ] Coordinate accuracy verified (spot-check)
- [ ] Automated monthly update pipeline

---

## Quick Reference: Data Sources

| Source | URL | Cost | Format |
|--------|-----|------|--------|
| CDSCO | https://cdsco.gov.in | Free | PDF/HTML |
| WHO ATC | https://www.whocc.no | Free | CSV/PDF |
| Nominatim | https://nominatim.org | Free (rate limited) | API |
| Jan Aushadhi Official | https://janaushadhi.gov.in | Free | JSON/API |

---

## Estimated Effort

| Task | Hours | Cost |
|------|-------|------|
| CDSCO Branded Mapping | 8-12 hrs + QA | ~$10 (API) |
| ATC Categories | 4-6 hrs | Free |
| Schedule H Classification | 4-6 hrs | Free |
| Store Maintenance Pipeline | 2-3 hrs | Free |
| **Total** | **18-27 hrs** | **~$10** |

---

## Notes

- Claude API batch job for branded mapping: Process 100 products at a time
- Manual QA should focus on top 500 by search volume (once analytics available)
- Consider partnering with pharmacy students for manual verification
- All scripts should be idempotent (safe to re-run)
