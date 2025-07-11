import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LanguageRecommendation = () => {
  const [language, setLanguage] = useState("");
  const [doctors, setDoctors] = useState([]);
  const navigate = useNavigate();

  const handleSearch = async () => {
    if (!language) return;
    try {
      const res = await axios.get(`http://localhost:4000/api/doctor/by-language?language=${language}`);
      setDoctors(res.data);
    } catch (err) {
      console.error("Failed to fetch doctors", err);
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow mt-6">
      <h2 className="text-xl font-semibold mb-3">Find Doctors by Language</h2>
      <div className="flex items-center gap-2">
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="border px-2 py-1 rounded w-60"
        >
          <option value="">Select Language</option>
          <option value="Hindi">Hindi</option>
          <option value="Spanish">Spanish</option>
          <option value="English">English</option>
          <option value="French">French</option>
          <option value="Mandarin">Mandarin</option>
          {/* Add more languages as needed */}
        </select>
        <button onClick={handleSearch} className="bg-blue-500 text-white px-4 py-1 rounded">
          Search
        </button>
      </div>

      {doctors.length > 0 && (
        <ul className="mt-4 space-y-2">
          {doctors.map((doc) => (
            <li
              key={doc._id}
              className="p-2 border rounded cursor-pointer hover:bg-blue-50"
              onClick={() => navigate(`/appointment/${doc._id}`)}
            >
              <p className="font-bold text-blue-700 underline">{doc.name}</p>
              <p>{doc.speciality}</p>
              <p className="text-sm text-gray-500">Speaks: {doc.languages.join(", ")}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LanguageRecommendation;
