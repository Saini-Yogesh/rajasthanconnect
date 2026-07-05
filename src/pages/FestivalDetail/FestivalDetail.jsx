import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Compass, Calendar, MapPin, Search } from "lucide-react";
import { fetchJson } from "../../config/api.js";
import "./FestivalDetail.css";
import useSEO from "../../hooks/useSEO";
import { buildFestivalSEO } from "../../utils/seo";
import { cultureTopicKey, cultureTopicLink } from "../../utils/culture";

export default function FestivalDetail() {
  const { id } = useParams();
  const [festival, setFestival] = useState(null);
  
  useSEO(buildFestivalSEO(festival, id));

  const [allCities, setAllCities] = useState([]);
  const [allFoods, setAllFoods] = useState([]);
  const [allCulture, setAllCulture] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetchJson(`/api/festivals/${id}`),
      fetchJson("/api/cities").catch(() => []),
      fetchJson("/api/foods").catch(() => []),
      fetchJson("/api/culture").catch(() => []),
    ])
      .then(([festData, citiesData, foodsData, cultureData]) => {
        setFestival(festData);
        setAllCities(citiesData || []);
        setAllFoods(foodsData || []);
        setAllCulture(cultureData || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load festival:", err);
        setLoading(false);
      });
  }, [id]);

  const relatedCities = allCities.filter((c) =>
    festival?.related_city_ids?.includes(c.id),
  );
  const relatedFoods = allFoods.filter((f) =>
    festival?.related_food_ids?.includes(f.id),
  );
  const relatedCulture = allCulture.filter((c) =>
    festival?.related_culture_ids?.includes(c.id),
  );

  if (loading) {
    return (
      <div className="festLoading">
        <Compass className="spinner" size={48} />
        <p>Aligning the lunar calendars for dates...</p>
      </div>
    );
  }

  if (!festival) {
    return (
      <div className="festNotFound">
        <h2>Festival Guide Not Found</h2>
        <p>This festival description is not logged in the database yet.</p>
        <Link to="/" className="btnHome">
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="festivalPage">
      <header className="festivalHeader">
        <div className="headerContent">
          <Link to="/" className="homeBreadcrumb">
            ← Return to Chapter Hub
          </Link>
          <h1>{festival.title}</h1>
          <div className="headerMeta">
            <span>📅 {festival.date_approximate_english || festival.date_hindi_month || festival.date}</span>
            <span>📍 {Array.isArray(festival.locations) ? festival.locations.join(", ") : (festival.location || "Rajasthan")}</span>
          </div>
        </div>
      </header>

      <section className="festivalBody">
        <div className="festivalGrid">
          <div className="festLeft">
            <div
              className="festHeroImage"
              style={{
                backgroundImage: `url(${
                  festival.image_urls?.[0] &&
                  !festival.image_urls[0].includes("tripsavvy.com")
                    ? festival.image_urls[0]
                    : "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80"
                })`,
              }}
            />

            <div className="cardBlock">
              <h2>Significance & Importance</h2>
              <p>{festival.importance}</p>
            </div>

            {festival.history && (
              <div className="cardBlock">
                <h2>Historical Legends</h2>
                <p>{festival.history}</p>
              </div>
            )}

            {/* Relational Connections */}
            {(relatedCities.length > 0 ||
              relatedFoods.length > 0 ||
              relatedCulture.length > 0) && (
              <div className="cardBlock festivalConnectionsCard">
                <h2>📖 Celebrated Regional & Folk Art Ties</h2>
                <div className="festivalConnectionsLinks">
                  {relatedCities.length > 0 && (
                    <div className="festConnRow">
                      <span className="festConnLabel">
                        Grand Processions In:
                      </span>
                      <div className="festConnList">
                        {relatedCities.map((c) => (
                          <Link
                            to={`/cities/${c.id}`}
                            className="festConnLink"
                            key={c.id}
                          >
                            {c.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {relatedFoods.length > 0 && (
                    <div className="festConnRow">
                      <span className="festConnLabel">
                        Festive Culinary Specialties:
                      </span>
                      <div className="festConnList">
                        {relatedFoods.map((f) => (
                          <Link
                            to={`/foods/${f.id}`}
                            className="festConnLink"
                            key={f.id}
                          >
                            {f.title}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {relatedCulture.length > 0 && (
                    <div className="festConnRow">
                      <span className="festConnLabel">
                        Folk Dance & Attire:
                      </span>
                      <div className="festConnList">
                        {relatedCulture.map((c) => (
                          <Link
                            to={cultureTopicLink(c)}
                            className="festConnLink"
                            key={cultureTopicKey(c)}
                          >
                            {c.title} ({c.category})
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="festRight">
            <div className="stickySidebar">
              <div className="travelGuideCard">
                <h3>Travel Guidelines</h3>

                {festival.dress_code && (
                  <div className="guideParam">
                    <strong>👗 Suggested Attire</strong>
                    <p>{festival.dress_code}</p>
                  </div>
                )}

                {festival.special_foods &&
                  festival.special_foods.length > 0 && (
                    <div className="guideParam">
                      <strong>🍽️ Traditional Festive Sweets</strong>
                      <div className="foodBadgeList">
                        {festival.special_foods.map((food, i) => (
                          <span className="foodBadge" key={`${food}-${i}`}>
                            {food}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                {festival.travel_tips && (
                  <div className="guideParam tipParam">
                    <strong>💡 Photography & Travel Tips</strong>
                    <p>{festival.travel_tips}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
