# Jan Aushadhi Medicine Savings Portal

A civic-focused web application that helps Indian citizens find affordable generic medicine alternatives through the Pradhan Mantri Jan Aushadhi scheme.

## Features

- 🔍 **Medicine Search**: Live autocomplete search against generic and branded medicine names
- 💰 **Savings Comparison**: Side-by-side comparison showing savings of 50-90%
- 🗺️ **Store Locator**: Interactive map showing nearest Jan Aushadhi stores
- 📱 **Share Savings**: Generate shareable images with Canvas API
- 🌐 **Offline Support**: All data stored locally in `/public/data/`
- 📊 **Responsive Design**: Optimized for mobile (375px), tablet (768px), and desktop (1280px)

## Data Sources

### Product Data
- **Source**: [janaushadhi.gov.in/product-list](https://janaushadhi.gov.in/product-list)
- **File**: `/public/data/jan-aushadhi-products.json`
- **Schema**:
  ```json
  {
    "id": "string",
    "genericName": "string",
    "brandedEquivalents": [
      { "name": "string", "mrp": number, "manufacturer": "string" }
    ],
    "janAushadhiPrice": number,
    "category": "string",
    "packSize": "string"
  }
  ```

### Store Locator Data
- **Source**: Jan Aushadhi store locator API / scraped data
- **File**: `/public/data/jan-aushadhi-stores.json`
- **Schema**:
  ```json
  {
    "id": "string",
    "name": "string",
    "address": "string",
    "city": "string",
    "state": "string",
    "pincode": "string",
    "lat": number,
    "lon": number,
    "phone": "string"
  }
  ```

## How to Refresh Datasets

### Products Data
1. Visit [janaushadhi.gov.in/product-list](https://janaushadhi.gov.in/product-list)
2. The website may have:
   - A downloadable CSV/Excel option
   - An API endpoint (inspect Network tab in DevTools)
   - HTML table that can be scraped
3. Transform the data to match the JSON schema above
4. Save to `/public/data/jan-aushadhi-products.json`
5. Rebuild the project: `npm run build`

### Stores Data
1. Use the Jan Aushadhi store locator on their official website
2. Alternatively, scrape store data using the following approach:
   ```javascript
   // Example Python script for geocoding
   import geopy
   from geopy.geocoders import Nominatim

   geolocator = Nominatim(user_agent="jan-aushadhi-app")
   location = geolocator.geocode("Address, City, State, India")
   print(location.latitude, location.longitude)
   ```
3. Ensure each store has valid latitude/longitude coordinates
4. Save to `/public/data/jan-aushadhi-stores.json`
5. Rebuild the project: `npm run build`

## Tech Stack

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Maps**: Leaflet.js + React-Leaflet
- **Icons**: Material Symbols (Google Fonts)
- **Font**: Plus Jakarta Sans

## Local Development

### Prerequisites
- Node.js 18+ and npm

### Setup
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Development Server
The dev server runs on `http://localhost:5173` by default.

## Deployment (Vercel)

### Option 1: Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Deploy to production
vercel --prod
```

### Option 2: Git Integration
1. Push code to GitHub/GitLab/Bitbucket
2. Connect repository to Vercel dashboard
3. Configure build settings:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Deploy!

### Vercel Configuration
Create `vercel.json` in project root:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

## Environment Variables

No API keys are required for basic functionality. The app works fully offline with static JSON data.

Optional environment variables:
```bash
# For analytics (future enhancement)
VITE_ANALYTICS_ID=your_analytics_id

# For alternative tile provider (maps)
VITE_MAP_TILE_URL=https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png
```

## Project Structure

```
├── public/
│   └── data/
│       ├── jan-aushadhi-products.json    # Medicine database
│       └── jan-aushadhi-stores.json      # Store locations
├── src/
│   ├── components/
│   │   ├── Layout.tsx                    # App shell with navigation
│   │   ├── SearchAutocomplete.tsx        # Medicine search
│   │   ├── MedicineComparison.tsx        # Price comparison cards
│   │   ├── StoreLocator.tsx              # Map + store list
│   │   ├── SkeletonLoader.tsx            # Loading skeletons
│   │   └── ErrorCard.tsx                 # Error states
│   ├── hooks/
│   │   ├── useMedicineData.ts            # Load JSON data
│   │   └── useGeolocation.ts             # Get user location
│   ├── utils/
│   │   ├── search.ts                     # Search & savings calc
│   │   ├── distance.ts                   # Haversine formula
│   │   └── analytics.ts                  # Event logging
│   ├── types/
│   │   └── index.ts                      # TypeScript types
│   ├── App.tsx                           # Main app
│   └── index.css                         # Tailwind styles
├── .planning/                             # GSD planning files
├── tailwind.config.js                     # Tailwind theme
└── package.json
```

## Analytics

The app logs events to console for development:
- `search` - When user searches
- `select_medicine` - When medicine is selected
- `view_comparison` - When comparison is viewed
- `view_map` - When map is loaded
- `share_savings` - When share image is generated
- `copy_link` - When deep link is copied

Replace `console.log` with your analytics provider (Plausible, PostHog, etc.) in `src/utils/analytics.ts`.

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## License

MIT License - Built for public welfare.

## Acknowledgments

- Data sourced from [Jan Aushadhi Portal](https://janaushadhi.gov.in)
- Part of Pradhan Mantri Bhartiya Janaushadhi Pariyojana (PMBJP)
