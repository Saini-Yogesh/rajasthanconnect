import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, MapPin, CheckCircle } from "lucide-react";
import { API_BASE_URL } from "../../config/api.js";
import "./DirectoryListings.css";
import useSEO from "../../hooks/useSEO";
import { LIST_SEO } from "../../utils/seo";
import { matchesSearch } from "../../utils/search";
import InfiniteGrid from "../../components/ui/InfiniteGrid/InfiniteGrid";

export default function DirectoryListings() {
  useSEO(LIST_SEO.directory);

  // Listings state
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [cityFilter, setCityFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const fetchListings = () => {
    setLoading(true);
    let url = `${API_BASE_URL}/api/listings`;
    const params = [];
    if (cityFilter !== "All") params.push(`cityId=${cityFilter.toLowerCase()}`);
    if (categoryFilter !== "All") params.push(`category=${categoryFilter}`);
    if (params.length > 0) url += `?${params.join("&")}`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setListings(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load listings:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchListings();
  }, [cityFilter, categoryFilter]);

  const filteredListings = listings.filter((l) =>
    matchesSearch(searchTerm, l.title, l.description)
  );

  const categories = [
    "All",
    "Hotels",
    "Restaurants",
    "Guides",
    "Shops",
    "Transport",
  ];
  const cities = ["All", "Jaipur", "Jodhpur", "Udaipur", "Jaisalmer"];

  return (
    <div className="directoryPage">
      <header className="directoryHeader">
        <h1>Local Providers Directory</h1>
        <p>
          Browse verified heritage tour guides, boutique haveli hotels,
          traditional sweet shops, and block-printing hubs.
        </p>
        <Link to="/directory/register" className="btnRegisterHeader">
          Register Your Business
        </Link>
      </header>

      {/* Controls: search and tabs */}
      <section className="directoryControls">
        <div className="searchBarContainer">
          <div className="searchBox">
            <Search className="searchIcon" size={18} />
            <input
              type="text"
              placeholder="Search by name, guide language, or services..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select
            className="cityDropdownFilter"
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
          >
            {cities.map((c) => (
              <option key={c} value={c}>
                {c === "All" ? "Filter by City" : c}
              </option>
            ))}
          </select>
        </div>

        <div className="categoryFilters">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`filterTabBtn ${categoryFilter === cat ? "active" : ""}`}
              onClick={() => setCategoryFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Listings Grid */}
      <section className="directoryGridSection">
        <InfiniteGrid
          items={filteredListings}
          loading={loading}
          loadingMsg="Retrieving directory lists..."
          emptyTitle="No providers listed"
          emptyMsg="No providers listed matching these filters yet. Be the first to register!"
          columns="2"
          renderItem={(list) => (
            <Link to={`/directory/${list.id}`} className="listingCardContainerLink" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="listingCardContainer" style={{ height: '100%' }}>
                <div className="cardHeader">
                  <span className="categoryBadge">{list.category}</span>
                  <div className="listingRating">★ {list.rating || "5.0"}</div>
                </div>

                <div className="cardInfo">
                  <h3>{list.title}</h3>
                  <span className="subcategory">{list.subcategory}</span>
                  <p className="address">
                    <MapPin size={12} />{" "}
                    {list.location_address || list.locationAddress}
                  </p>
                  <p className="desc">{list.description}</p>
                </div>

                <div className="cardFooter">
                  <div className="pricing">
                    <span>Estimate Rate</span>
                    <strong>{list.pricing}</strong>
                  </div>

                  {list.is_verified && (
                    <span className="verifiedBadgeText">
                      <CheckCircle size={14} color="#10b981" /> Verified Partner
                    </span>
                  )}
                </div>
              </div>
            </Link>
          )}
        />
      </section>
    </div>
  );
}
