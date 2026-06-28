import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, MapPin, Calendar, Compass } from "lucide-react";
import { API_BASE_URL } from "../../config/api.js";
import "./FestivalsList.css";
import useSEO from "../../hooks/useSEO";

export default function FestivalsList() {
  useSEO({
    title: "Cultural Festivals & Sacred Fasting",
    description: "Explore the vibrant local festivals of Rajasthan: dates, locations, travel advice, dress codes, and significance of Pushkar Camel Fair, Gangaur, and Desert Festival.",
    keywords: "Rajasthan festivals, Pushkar Camel Fair, Gangaur Festival, Jaisalmer Desert Festival, Teej Festival, Holi"
  });

  const [festivals, setFestivals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/festivals`)
      .then((res) => res.json())
      .then((data) => {
        setFestivals(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load festivals:", err);
        setLoading(false);
      });
  }, []);

  const filteredFestivals = festivals.filter(
    (f) =>
      f.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.importance.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="festivalsPage">
      <header className="festivalsHeader">
        <h1>Melas &amp; Festivals of Rajasthan</h1>
        <p>
          Immerse yourself in the vibrant colors, folk music, grand processions, 
          and sacred traditions that bring the Thar Desert to life.
        </p>

        {/* Search Box */}
        <div className="searchBoxContainer">
          <Search className="searchIcon" size={20} />
          <input
            type="text"
            placeholder="Search by festival name, city, or significance..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </header>

      <section className="festivalsGridSection">
        {loading ? (
          <div className="loadingContainer">
            <Compass className="loadingSpinner" size={48} />
            <p>Consulting the lunar calendar for festival dates...</p>
          </div>
        ) : filteredFestivals.length > 0 ? (
          <div className="festivalsGrid">
            {filteredFestivals.map((f) => {
              let image = f.imageUrls?.[0] || f.image_urls?.[0] || "";
              if (!image || image.includes("tripsavvy.com")) {
                image = "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80";
              }
              return (
                <div className="festListCard" key={f.id}>
                  <div
                    className="festCardImage"
                    style={{ backgroundImage: `url(${image})` }}
                  >
                    <div className="festCardOverlay"></div>
                    <div className="festCardDate">
                      <Calendar size={12} /> {f.date}
                    </div>
                  </div>
                  <div className="festCardBody">
                    <h3>{f.title}</h3>
                    <p className="festLocation">
                      <MapPin size={14} /> {f.location}
                    </p>
                    <p className="festDesc">{f.importance}</p>

                    <Link to={`/festivals/${f.id}`} className="btnFestExplore">
                      Explore Mela
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="noResults">
            <p>
              No festivals found matching your search. Try searching for "Pushkar"
              or "Holi".
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
