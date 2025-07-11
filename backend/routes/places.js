import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

router.get("/nearby", async (req, res) => {
  const { lat, lng, type } = req.query;

  if (!lat || !lng) {
    return res.status(400).json({ error: "Latitude and Longitude required" });
  }

  try {
    const nearbyRes = await axios.get(
      "https://maps.googleapis.com/maps/api/place/nearbysearch/json",
      {
        params: {
          location: `${lat},${lng}`,
          radius: 5000,
          type: type || "hospital",
          key: process.env.GOOGLE_API_KEY,
        },
      }
    );

    const places = nearbyRes.data.results;

    const detailedPlaces = await Promise.all(
      places.map(async (place) => {
        try {
          const detailsRes = await axios.get(
            "https://maps.googleapis.com/maps/api/place/details/json",
            {
              params: {
                place_id: place.place_id,
                fields: "website",
                key: process.env.GOOGLE_API_KEY,
              },
            }
          );

          const website = detailsRes.data.result.website;
          return { ...place, website: website || null };
        } catch (error) {
          console.error(`Error fetching details for ${place.place_id}`);
          return { ...place, website: null };
        }
      })
    );

    res.json({ results: detailedPlaces });
  } catch (error) {
    console.error("Error fetching places:", error);
    res.status(500).json({ error: "Error fetching places data" });
  }
});

export default router;
