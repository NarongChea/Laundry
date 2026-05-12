require("dotenv").config();
const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");
const path = require("path");

const app = express();

const PORT = process.env.PORT || 3000;
const API_KEY = process.env.GOOGLE_MAPS_API_KEY;

// ── Middleware ─────────────────────────────────────
app.use(cors({
  origin: [
    "https://narongchea.github.io",
    "http://localhost:3000"
  ]
}));
app.use(express.json());

// ✅ Serve frontend from root directory
app.use(express.static(path.join(__dirname)));

// ── Home route ─────────────────────────────────────
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// ── Config ─────────────────────────────────────────
app.get("/api/config", (req, res) => {
  if (!API_KEY || API_KEY === "YOUR_GOOGLE_MAPS_API_KEY_HERE")
    return res.status(500).json({ error: "Google Maps API key not configured in .env" });

  res.json({ apiKey: API_KEY });
});

// ── Nearby Laundry Search ───────────────────────────
app.get("/api/nearby", async (req, res) => {
  const { lat, lng, radius = 500 } = req.query;

  if (!lat || !lng)
    return res.status(400).json({ error: "lat and lng are required" });

  if (!API_KEY || API_KEY === "YOUR_GOOGLE_MAPS_API_KEY_HERE")
    return res.status(500).json({ error: "Google Maps API key not configured" });

  try {
    const FIELD_MASK =
      "places.id,places.displayName,places.formattedAddress,places.location," +
      "places.rating,places.userRatingCount,places.currentOpeningHours," +
      "places.regularOpeningHours,places.photos,places.businessStatus";

    const body = {
      includedTypes: ["laundry"],
      maxResultCount: 20,
      locationRestriction: {
        circle: {
          center: {
            latitude: parseFloat(lat),
            longitude: parseFloat(lng),
          },
          radius: parseFloat(radius),
        },
      },
      rankPreference: "DISTANCE",
    };

    const response = await fetch(
      "https://places.googleapis.com/v1/places:searchNearby",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": API_KEY,
          "X-Goog-FieldMask": FIELD_MASK,
        },
        body: JSON.stringify(body),
      }
    );

    const data = await response.json();
    const results = (data.places || []).map(normalizePlace);

    res.json({ results });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Communes ────────────────────────────────────────
app.get("/api/locations/communes", (req, res) => {
  const { provinceId } = req.query;
  const mockCommunes = [
    { name_kh: "ស្ទឹងត្រង់", lat: 12.2833, lng: 105.4833 },
    { name_kh: "កំពង់ចាម", lat: 11.9933, lng: 105.4633 },
  ];
  res.json(mockCommunes);
});

// ── Helpers ─────────────────────────────────────────
function normalizePlace(p) {
  return {
    place_id: p.id,
    name: p.displayName?.text || "Unknown",
    vicinity: p.formattedAddress || "",
    rating: p.rating || null,
    user_ratings_total: p.userRatingCount || 0,
    geometry: {
      location: {
        lat: p.location?.latitude,
        lng: p.location?.longitude,
      },
    },
    opening_hours: {
      open_now: p.currentOpeningHours?.openNow || false,
    },
    photos: p.photos || [],
  };
}

// ── Start Server ────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🧺 Server running on port ${PORT}`);
});