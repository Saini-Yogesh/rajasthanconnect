import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Compass, Send } from "lucide-react";
import { API_BASE_URL, fetchJson } from "../../config/api.js";
import "./RulerDetail.css";
import useSEO from "../../hooks/useSEO";
import { buildRulerSEO } from "../../utils/seo";

export default function RulerDetail() {
  const { id } = useParams();
  const [ruler, setRuler] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [allCities, setAllCities] = useState([]);
  const [allPlaces, setAllPlaces] = useState([]);
  const [loading, setLoading] = useState(true);

  // Review form states
  const [reviewAuthor, setReviewAuthor] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewMsg, setReviewMsg] = useState("");

  useSEO(buildRulerSEO(ruler, id));

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetchJson(`/api/history/${id}`),
      fetch(`${API_BASE_URL}/api/reviews/${id}/ruler`).then((res) => (res.ok ? res.json() : [])),
      fetchJson("/api/cities").catch(() => []),
      fetchJson("/api/places").catch(() => []),
    ])
      .then(([rulerData, reviewsData, citiesData, placesData]) => {
        setRuler(rulerData);
        setReviews(reviewsData || []);
        setAllCities(citiesData || []);
        setAllPlaces(placesData || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load ruler details:", err);
        setLoading(false);
      });
  }, [id]);

  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (!reviewComment) return;

    setSubmittingReview(true);
    setReviewMsg("");

    fetch(`${API_BASE_URL}/api/reviews`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        itemId: id,
        itemType: "ruler",
        rating: reviewRating,
        comment: reviewComment,
        author: reviewAuthor || "Anonymous Traveler",
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to post review");
        return res.json();
      })
      .then((newRev) => {
        setReviews((prev) => [newRev, ...prev]);
        setReviewAuthor("");
        setReviewComment("");
        setReviewRating(5);
        setReviewMsg("Thank you for sharing your experience!");
        setSubmittingReview(false);
      })
      .catch((err) => {
        console.error(err);
        setSubmittingReview(false);
      });
  };

  const relatedCities = allCities.filter((c) =>
    ruler?.related_city_ids?.includes(c.id),
  );

  const relatedPlaces = allPlaces.filter((p) =>
    ruler?.related_place_ids?.includes(p.id),
  );

  if (loading) {
    return (
      <div className="rulerLoading">
        <Compass className="spinner" size={48} />
        <p>Uncovering royal scripts and battle records...</p>
      </div>
    );
  }

  if (!ruler) {
    return (
      <div className="rulerNotFound">
        <h2>Ruler Biography Not Found</h2>
        <p>This chapter of history is not logged in the database yet.</p>
        <Link to="/history-culture" className="btnHome">
          Back to History & Culture
        </Link>
      </div>
    );
  }

  return (
    <div className="rulerDetailPage">
      <header className="rulerDetailHeader">
        <div className="headerContent">
          <Link to="/history-culture" className="homeBreadcrumb">
            ← Return to History & Culture Hub
          </Link>
          <h1>{ruler.name}</h1>
          <div className="headerMeta">
            <span>👑 Dynasty: {ruler.dynasty}</span>
            <span>📅 Reign: {ruler.reign_period || ruler.reignPeriod}</span>
          </div>
        </div>
      </header>

      <section className="rulerDetailBody">
        <div className="rulerDetailGrid">
          <div className="rulerLeft">
            <div
              className="rulerHeroImage"
              style={{
                backgroundImage: `url(${ruler.image_url || ruler.imageUrl || "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80"})`,
              }}
            />

            <div className="cardBlock">
              <h2>Biography & Historical Legacy</h2>
              <p>{ruler.biography}</p>
            </div>

            {ruler.achievements && ruler.achievements.length > 0 && (
              <div className="cardBlock">
                <h2>Key Achievements & Contributions</h2>
                <ul className="achievementsList">
                  {ruler.achievements.map((ach, idx) => (
                    <li key={idx}>{ach}</li>
                  ))}
                </ul>
              </div>
            )}

            {ruler.battles && ruler.battles.length > 0 && (
              <div className="cardBlock">
                <h2>Historic Battles & Conflicts</h2>
                <div className="battlesBlockList">
                  {ruler.battles.map((battle, idx) => (
                    <div className="battleItemRow" key={idx}>
                      <strong>🗡️ {battle.name || battle.title}</strong>
                      <p>{battle.description || battle.details}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="rulerRight">
            <div className="stickySidebar">
              {/* Connected entities Card */}
              {(relatedCities.length > 0 || relatedPlaces.length > 0) && (
                <div className="quickInfoCard">
                  <h3>Historical Connections</h3>
                  
                  {relatedCities.length > 0 && (
                    <div className="connRow">
                      <span className="connLabel">📍 Capital / Dynastic Cities:</span>
                      <div className="connList">
                        {relatedCities.map((c) => (
                          <Link to={`/cities/${c.id}`} className="connLink" key={c.id}>
                            {c.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {relatedPlaces.length > 0 && (
                    <div className="connRow">
                      <span className="connLabel">🏰 Associated Forts & Palaces:</span>
                      <div className="connList">
                        {relatedPlaces.map((p) => (
                          <Link to={`/places/${p.id}`} className="connLink" key={p.id}>
                            {p.title}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* REVIEWS BLOCK */}
              <div className="reviewsBlockCard">
                <h3>Traveler Reviews & Experiences ({reviews.length})</h3>

                <form className="reviewSubmitForm" onSubmit={handleSubmitReview}>
                  <h4>Share Your Experience</h4>
                  {reviewMsg && <p className="reviewSuccessMsg">{reviewMsg}</p>}

                  <div className="formRow">
                    <input
                      type="text"
                      placeholder="Your name..."
                      value={reviewAuthor}
                      onChange={(e) => setReviewAuthor(e.target.value)}
                    />
                    <select
                      value={reviewRating}
                      onChange={(e) => setReviewRating(Number(e.target.value))}
                    >
                      <option value="5">⭐⭐⭐⭐⭐ (5/5)</option>
                      <option value="4">⭐⭐⭐⭐ (4/5)</option>
                      <option value="3">⭐⭐⭐ (3/5)</option>
                      <option value="2">⭐⭐ (2/5)</option>
                      <option value="1">⭐ (1/5)</option>
                    </select>
                  </div>

                  <textarea
                    placeholder="Tell other travelers about visiting monuments associated with this ruler, seeing their armor in museums, or local stories..."
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    required
                  ></textarea>

                  <button type="submit" className="btnSubmitReview" disabled={submittingReview}>
                    <Send size={12} /> Submit Comments
                  </button>
                </form>

                <div className="reviewsList">
                  {reviews.length > 0 ? (
                    reviews.map((rev) => (
                      <div className="reviewItemCard" key={rev.id}>
                        <div className="reviewHeader">
                          <strong>{rev.author}</strong>
                          <span className="revRating">★ {rev.rating}/5</span>
                        </div>
                        <p className="revComment">{rev.comment}</p>
                        <span className="revDate">
                          {new Date(rev.createdAt || rev.created_at).toLocaleDateString(undefined, {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="noReviewsYet">No experience reviews shared yet. Be the first!</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
