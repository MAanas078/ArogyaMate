import React, { useEffect, useState } from "react";
import axios from "axios";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

const NearbyHospitals = ({ lat, lng }) => {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY, // ✅ Loaded from .env
    libraries: ["places"],
  });

  useEffect(() => {
    if (lat && lng) {
      setLoading(true);
      axios
        .get(`http://localhost:4000/api/places/nearby?lat=${lat}&lng=${lng}`)
        .then((res) => {
          setPlaces(res.data.results || []);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching places:", err);
          setLoading(false);
        });
    }
  }, [lat, lng]);

  const mapContainerStyle = {
    width: "100%",
    height: "500px",
    marginTop: "20px",
  };

  const center = {
    lat: lat,
    lng: lng,
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-center mt-4">Nearby Hospitals</h2>

      {!isLoaded || loading ? (
        <p className="text-center mt-4">Loading map...</p>
      ) : (
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={center}
          zoom={14}
        >
          {/* Your location */}
          <Marker position={center} label="You" />

          {/* Hospital markers */}
          {places.map((place) => (
            <Marker
              key={place.place_id}
              position={{
                lat: place.geometry.location.lat,
                lng: place.geometry.location.lng,
              }}
              title={place.name}
            />
          ))}
        </GoogleMap>
      )}
    </div>
  );
};

export default NearbyHospitals;
