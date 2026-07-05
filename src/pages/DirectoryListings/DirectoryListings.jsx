import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Search,
  Compass,
  MapPin,
  Award,
  CheckCircle,
  Store,
  AlertCircle,
} from "lucide-react";
import { API_BASE_URL } from "../../config/api.js";
import "./DirectoryListings.css";
import useSEO from "../../hooks/useSEO";
import { LIST_SEO } from "../../utils/seo";
import { matchesSearch } from "../../utils/search";

export default function DirectoryListings() {
  const [searchParams] = useSearchParams();
  const registerQuery = searchParams.get("register");

  useSEO(registerQuery ? LIST_SEO.directoryRegister : LIST_SEO.directory);

  // Listings state
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [cityFilter, setCityFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");

  // Submit listing Form state
  const [businessName, setBusinessName] = useState("");
  const [category, setCategory] = useState("Guides");
  const [city, setCity] = useState("Jaipur");
  const [phone, setPhone] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

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

  useEffect(() => {
    if (registerQuery !== "true") return;

    const scrollToForm = () => {
      const formSection = document.getElementById("registrationFormSection");
      if (!formSection) return;
      const navOffset = 96;
      const top =
        formSection.getBoundingClientRect().top + window.scrollY - navOffset;
      window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
    };

    if (loading) return;
    const timer = setTimeout(scrollToForm, 200);
    return () => clearTimeout(timer);
  }, [registerQuery, loading]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!businessName || !phone || !description) {
      setErrorMsg("Please populate all listing parameters.");
      return;
    }

    setSubmitting(true);
    setErrorMsg("");
    setMessage("");

    fetch(`${API_BASE_URL}/api/listings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        businessName,
        category,
        city,
        phone,
        description,
      }),
    })
      .then(async (res) => {
        if (!res.ok) {
          let errMsg = "Registration failed";
          try {
            const errData = await res.json();
            if (errData.details && Array.isArray(errData.details)) {
              errMsg = errData.details.join(" ");
            } else if (errData.error) {
              errMsg = errData.error;
            }
          } catch (e) {}
          throw new Error(errMsg);
        }
        return res.json();
      })
      .then(() => {
        setBusinessName("");
        setPhone("");
        setDescription("");
        setCategory("Guides");
        setCity("Jaipur");
        setMessage(
          "Success! Your business has been registered and is pending admin verification.",
        );
        setSubmitting(false);
      })
      .catch((err) => {
        console.error(err);
        setErrorMsg(
          err.message ||
            "Failed to connect to the database. Running in offline mode.",
        );
        setSubmitting(false);
      });
  };

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
        {loading ? (
          <div className="loadingGrid">
            <Compass className="loadingSpinner" size={36} />
            <p>Retrieving directory lists...</p>
          </div>
        ) : filteredListings.length > 0 ? (
          <div className="listingsDisplayGrid">
            {filteredListings.map((list) => (
              <div className="listingCardContainer" key={list.id}>
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
            ))}
          </div>
        ) : (
          <div className="emptyResults">
            <Compass className="idleSpinner" size={48} />
            <p>
              No providers listed matching these filters yet. Be the first to
              register!
            </p>
          </div>
        )}
      </section>

      {/* Register Business Form */}
      <section className="registerFormSection" id="registrationFormSection">
        <div className="registerFormCard">
          <div className="formTitleRow">
            <Store
              className="formIcon"
              size={32}
              color="var(--color-primary)"
            />
            <div>
              <h3>Register Your Services</h3>
              <p>
                Are you a local tourist guide, hotel host, shop owner, or
                driver? List your business here for free to connect with
                travelers.
              </p>
            </div>
          </div>

          {message && <div className="successNotify">{message}</div>}
          {errorMsg && <div className="errorNotify">{errorMsg}</div>}

          <form onSubmit={handleSubmit} className="registerInputsForm">
            <div className="formRow">
              <div className="formGroup">
                <label>Business / Guide Name</label>
                <input
                  type="text"
                  className="formInput"
                  placeholder="e.g. Rajput Walking Tours..."
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  required
                />
              </div>

              <div className="formGroup">
                <label>Service Category</label>
                <select
                  className="formInput"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="Guides">Tour Guide / Walk Host</option>
                  <option value="Hotels">Haveli / Homestay / Hotel</option>
                  <option value="Restaurants">
                    Traditional Restaurant / Cafe
                  </option>
                  <option value="Shops">
                    Handicrafts / Block-printing Shop
                  </option>
                  <option value="Transport">Driver / Taxi Operator</option>
                </select>
              </div>
            </div>

            <div className="formRow">
              <div className="formGroup">
                <label>City Hub</label>
                <select
                  className="formInput"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                >
                  <option value="Jaipur">Jaipur</option>
                  <option value="Jodhpur">Jodhpur</option>
                  <option value="Udaipur">Udaipur</option>
                  <option value="Jaisalmer">Jaisalmer</option>
                </select>
              </div>

              <div className="formGroup">
                <label>Phone / WhatsApp Number</label>
                <input
                  type="tel"
                  className="formInput"
                  placeholder="e.g. +91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="formGroup">
              <label>Description of Services & Experience</label>
              <textarea
                className="formTextarea"
                rows="4"
                placeholder="Detail your tour itineraries, languages spoken, hotel room rates, or block print techniques..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              ></textarea>
            </div>

            <button type="submit" className="submitBtn" disabled={submitting}>
              Submit Service for Approval
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
