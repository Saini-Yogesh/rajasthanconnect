import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, MapPin, Compass } from "lucide-react";
import { API_BASE_URL } from "../../config/api.js";
import "./CitiesList.css";

export default function CitiesList() {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/cities`)
      .then((res) => res.json())
      .then((data) => {
        setCities(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load cities:", err);
        setLoading(false);
      });
  }, []);

  const filteredCities = cities.filter(
    (city) =>
      city.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      city.tagline.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="citiesPage">
      <header className="citiesHeader">
        <h1>Royal Cities of Rajasthan</h1>
        <p>
          Step into the kingdoms of history, where every town tells tales of
          unmatched chivalry, art, and heritage.
        </p>

        {/* Search Box */}
        <div className="searchBoxContainer">
          <Search className="searchIcon" size={20} />
          <input
            type="text"
            placeholder="Search by city name or tagline (e.g. Pink City, Lakes)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </header>

      <section className="citiesGridSection">
        {loading ? (
          <div className="loadingContainer">
            <Compass className="loadingSpinner" size={48} />
            <p>Gathering the scrolls of kingdoms...</p>
          </div>
        ) : filteredCities.length > 0 ? (
          <div className="citiesGrid">
            {filteredCities.map((city) => (
              <div className="cityCard" key={city.id}>
                <div
                  className="cityCardImage"
                  style={{
                    backgroundImage: `url(${city.imageUrl || city.image_url || "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=600&q=80"})`,
                  }}
                >
                  <div className="cityCardOverlay"></div>
                  <div className="cityCardTagline">{city.tagline}</div>
                </div>
                <div className="cityCardBody">
                  <h3>{city.name}</h3>
                  <p className="cityDesc">{city.description}</p>

                  <div className="cityCardMeta">
                    <span className="bestSeason">
                      <MapPin size={14} /> <strong>Best Time:</strong>{" "}
                      {city.bestTime || city.best_time}
                    </span>
                  </div>

                  <Link to={`/cities/${city.id}`} className="btnCityExplore">
                    Enter Portal
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="noResults">
            <p>
              No cities found matching your search. Try searching for "Jaipur"
              or "Lakes".
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
