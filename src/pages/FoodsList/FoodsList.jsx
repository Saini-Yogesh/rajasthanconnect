import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, MapPin, Compass, Utensils } from "lucide-react";
import { API_BASE_URL } from "../../config/api.js";
import "./FoodsList.css";
import useSEO from "../../hooks/useSEO";
import { LIST_SEO } from "../../utils/seo";
import { matchesSearch } from "../../utils/search";

export default function FoodsList() {
  useSEO(LIST_SEO.foods);

  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/foods`)
      .then((res) => res.json())
      .then((data) => {
        setFoods(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load foods:", err);
        setLoading(false);
      });
  }, []);

  const filteredFoods = foods.filter((f) =>
    matchesSearch(searchTerm, f.title, f.origin, f.description)
  );

  return (
    <div className="foodsPage">
      <header className="foodsHeader">
        <h1>Rajasthani Royal Cuisine</h1>
        <p>
          Discover the rich culinary heritage of Rajasthan — from wood-fired 
          Dal Baati Churma to royal Mewari Laal Maas and festive sweets.
        </p>

        {/* Search Box */}
        <div className="searchBoxContainer">
          <Search className="searchIcon" size={20} />
          <input
            type="text"
            placeholder="Search by dish name, region, or ingredients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </header>

      <section className="foodsGridSection">
        {loading ? (
          <div className="loadingContainer">
            <Compass className="loadingSpinner" size={48} />
            <p>Stoking the chulha flames for traditional recipes...</p>
          </div>
        ) : filteredFoods.length > 0 ? (
          <div className="foodsGrid">
            {filteredFoods.map((f) => {
              const image = f.imageUrl || f.image_url || "https://images.unsplash.com/photo-1585938338392-50a59970d8ee?auto=format&fit=crop&w=600&q=80";
              const price = f.priceRange || f.price_range || "$$";
              return (
                <div className="foodListCard" key={f.id}>
                  <div
                    className="foodCardImage"
                    style={{ backgroundImage: `url(${image})` }}
                  >
                    <div className="foodCardOverlay"></div>
                    <div className="foodCardPrice">
                      {price}
                    </div>
                  </div>
                  <div className="foodCardBody">
                    <h2>{f.title}</h2>
                    {f.origin && (
                      <p className="foodOrigin">
                        <MapPin size={14} /> {f.origin}
                      </p>
                    )}
                    <p className="foodDesc">{f.description}</p>

                    <Link to={`/foods/${f.id}`} className="btnFoodExplore">
                      View Recipe &amp; Reviews
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="noResults">
            <p>
              No dishes found matching your search. Try searching for "Baati"
              or "Mewar".
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
