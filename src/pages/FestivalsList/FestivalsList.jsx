import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, MapPin, Calendar } from "lucide-react";
import { API_BASE_URL } from "../../config/api.js";
import "./FestivalsList.css";
import useSEO from "../../hooks/useSEO";
import { LIST_SEO } from "../../utils/seo";
import { matchesSearch } from "../../utils/search";
import InfiniteGrid from "../../components/ui/InfiniteGrid/InfiniteGrid";

export default function FestivalsList() {
  useSEO(LIST_SEO.festivals);

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

  const filteredFestivals = festivals.filter((f) =>
    matchesSearch(searchTerm, f.title, f.location, f.importance)
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
        <InfiniteGrid
          items={filteredFestivals}
          loading={loading}
          loadingMsg="Consulting the lunar calendar for festival dates..."
          emptyTitle="No festivals found"
          emptyMsg="No festivals found matching your search. Try searching for 'Pushkar' or 'Holi'."
          columns="3"
          renderItem={(f) => {
            let image = f.imageUrls?.[0] || f.image_urls?.[0] || "";
            if (!image || image.includes("tripsavvy.com")) {
              image = "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80";
            }
            return (
              <div className="festListCard" style={{ height: "100%" }}>
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
                  <h2>{f.title}</h2>
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
          }}
        />
      </section>
    </div>
  );
}
