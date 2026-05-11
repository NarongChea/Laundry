# 🧺 បោកអ៊ុត Finder — Laundry Near You

A beautiful web app to find laundry shops near your current location, with Google Maps integration.

## Features
- 📍 Auto-detect your GPS location
- 🔍 Search laundry shops within 300m / 500m / 1km / 2km radius
- 🗺️ Dark-themed Google Maps with custom markers
- 📋 Sortable list (distance, rating, A–Z)
- 📱 Click any shop for full details: address, phone, hours, reviews, photos
- 🧭 One-click navigation via Google Maps
- 📞 Click-to-call support
- 🇰🇭 Searches in English AND Khmer (បោកអ៊ុត)
- 📱 Mobile responsive

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Configure your Google Maps API Key
Edit the `.env` file and replace with your actual key:
```
GOOGLE_MAPS_API_KEY=YOUR_ACTUAL_KEY_HERE
PORT=3000
```

### 3. Enable these APIs in Google Cloud Console:
- **Maps JavaScript API**
- **Places API**

### 4. Start the server
```bash
npm start
# or for development with auto-reload:
npm run dev
```

### 5. Open in browser
```
http://localhost:3000
```

## Project Structure
```
laundry-finder/
├── server.js          # Node.js/Express backend
├── .env               # API key config (never commit this!)
├── package.json
└── public/
    ├── index.html     # Main HTML
    ├── css/
    │   └── style.css  # Styles
    └── js/
        └── app.js     # Frontend logic
```

## API Routes (backend)
| Route | Description |
|-------|-------------|
| `GET /api/config` | Returns API key to frontend |
| `GET /api/nearby?lat=&lng=&radius=` | Searches nearby laundry |
| `GET /api/place/:placeId` | Gets place details |
| `GET /api/photo?ref=&maxwidth=` | Proxies place photos |
