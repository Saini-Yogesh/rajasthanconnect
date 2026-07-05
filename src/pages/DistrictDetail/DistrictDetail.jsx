import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { MapPin, Compass, ShieldAlert, Award, Star, Activity, Landmark } from "lucide-react";
import { fetchJson } from "../../config/api.js";
import "./DistrictDetail.css";
import useSEO from "../../hooks/useSEO";
import { buildDistrictSEO } from "../../utils/seo";

export default function DistrictDetail() {
  const { id } = useParams();
  const [district, setDistrict] = useState(null);
  const [cities, setCities] = useState([]);
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useSEO(buildDistrictSEO(district, id));

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetchJson(`/api/districts/${id}`),
      fetchJson(`/api/cities?district_id=${id}`).catch(() => []),
      fetchJson(`/api/places?district_id=${id}`).catch(() => []),
    ])
      .then(([districtData, citiesData, placesData]) => {
        setDistrict(districtData);
        setCities(citiesData);
        setPlaces(placesData);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load district details:", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="districtLoadingPage">
        <Compass className="spinner" size={48} />
        <p>Retrieving district records from the royal archives...</p>
      </div>
    );
  }

  if (!district) {
    return (
      <div className="districtNotFound">
        <h2>District Record Not Found</h2>
        <p>The district you are looking for has not been logged in the digital encyclopedia yet.</p>
        <Link to="/districts" className="btnBack">
          Back to Districts
        </Link>
      </div>
    );
  }

  return (
    <div className="districtDetailPage">
      {/* Banner */}
      <div
        className="districtBanner"
        style={{
          backgroundImage: `url(${district.image_url || "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80"})`,
        }}
      >
        <div className="bannerOverlay"></div>
        <div className="bannerContent">
          <span className="bannerSubtitle">{district.division || "Rajasthan Division"}</span>
          <h1>{district.name} District</h1>
          <div className="bannerDivider"></div>
          <p className="headquarters">
            <MapPin size={16} /> <strong>Headquarters:</strong> {district.headquarters || district.name}
          </p>
        </div>
      </div>

      <div className="detailContainer">
        {/* Stats Grid */}
        <div className="statsHighlightGrid">
          <div className="statCard">
            <span className="statLabel">Headquarters</span>
            <strong className="statValue">{district.headquarters || "N/A"}</strong>
          </div>
          <div className="statCard">
            <span className="statLabel">Division</span>
            <strong className="statValue">{district.division || "N/A"}</strong>
          </div>
          {district.area_sq_km && (
            <div className="statCard">
              <span className="statLabel">Area</span>
              <strong className="statValue">
                {Number(district.area_sq_km).toLocaleString()} km²
              </strong>
            </div>
          )}
          {district.population && (
            <div className="statCard">
              <span className="statLabel">Population</span>
              <strong className="statValue">
                {Number(district.population).toLocaleString()}
              </strong>
            </div>
          )}
          {district.established_year && (
            <div className="statCard">
              <span className="statLabel">Established</span>
              <strong className="statValue">{district.established_year}</strong>
            </div>
          )}
        </div>

        {/* Tabs Navigation */}
        <div className="tabsBarContainer">
          <div className="tabsBar">
            <button
              className={`tabBtn ${activeTab === "overview" ? "active" : ""}`}
              onClick={() => setActiveTab("overview")}
            >
              Overview & History
            </button>
            <button
              className={`tabBtn ${activeTab === "cities" ? "active" : ""}`}
              onClick={() => setActiveTab("cities")}
            >
              Cities ({cities.length})
            </button>
            <button
              className={`tabBtn ${activeTab === "places" ? "active" : ""}`}
              onClick={() => setActiveTab("places")}
            >
              Heritage Places ({places.length})
            </button>
          </div>
        </div>

        {/* Tab Contents */}
        <div className="tabContentSection">
          {activeTab === "overview" && (
            <div className="overviewTabContent">
              <div className="infoBlock">
                <h2>📜 Historical Background</h2>
                <p className="narrativeText">{district.history}</p>
              </div>

              {district.climate && (
                <div className="infoBlock">
                  <h2>🌤️ Climate & Weather</h2>
                  <p className="narrativeText">{district.climate}</p>
                </div>
              )}
            </div>
          )}

          {activeTab === "cities" && (
            <div className="citiesTabContent">
              <h2>🏙️ Royal Cities in {district.name}</h2>
              {cities.length === 0 ? (
                <p className="emptyTabMsg">No cities recorded in this district yet.</p>
              ) : (
                <div className="cardsListGrid">
                  {cities.map((city) => (
                    <Link to={`/cities/${city.id}`} className="nestedCard" key={city.id}>
                      <div
                        className="nestedCardImage"
                        style={{
                          backgroundImage: `url(${city.image_url || city.imageUrl || "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=400&q=80"})`,
                        }}
                      ></div>
                      <div className="nestedCardInfo">
                        <h3>{city.name}</h3>
                        {city.tagline && <p className="nestedCardSubtitle">{city.tagline}</p>}
                        <span className="btnExploreNested">Explore City →</span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "places" && (
            <div className="placesTabContent">
              <h2>🏰 Forts & Sightseeing Landmarks</h2>
              {places.length === 0 ? (
                <p className="emptyTabMsg">No heritage places recorded in this district yet.</p>
              ) : (
                <div className="cardsListGrid">
                  {places.map((place) => (
                    <Link to={`/places/${place.id}`} className="nestedCard" key={place.id}>
                      <div
                        className="nestedCardImage"
                        style={{
                          backgroundImage: `url(${place.image_urls?.[0] || place.imageUrls?.[0] || "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=400&q=80"})`,
                        }}
                      ></div>
                      <div className="nestedCardInfo">
                        <span className="nestedCardBadge">{place.category || "Sightseeing"}</span>
                        <h3>{place.title}</h3>
                        {place.timings && <p className="nestedCardSubtitle">⏱️ {place.timings}</p>}
                        <span className="btnExploreNested">Explore Heritage →</span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
