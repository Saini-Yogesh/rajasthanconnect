import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Compass, Send } from "lucide-react";
import { API_BASE_URL, fetchJson } from "../../config/api.js";
import "./CultureDetail.css";
import useSEO from "../../hooks/useSEO";
import { buildCultureSEO } from "../../utils/seo";

export default function CultureDetail() {
  const { id } = useParams();
  const [topic, setTopic] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [allCities, setAllCities] = useState([]);
  const [allFestivals, setAllFestivals] = useState([]);
  const [loading, setLoading] = useState(true);

  // Review form states
  const [reviewAuthor, setReviewAuthor] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewMsg, setReviewMsg] = useState("");

  useSEO(buildCultureSEO(topic, id));

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetchJson(`/api/culture/${id}`),
      fetch(`${API_BASE_URL}/api/reviews/${id}/culture`).then((res) => (res.ok ? res.json() : [])),
      fetchJson("/api/cities").catch(() => []),
      fetchJson("/api/festivals").catch(() => []),
    ])
      .then(([topicData, reviewsData, citiesData, festsData]) => {
        setTopic(topicData);
        setReviews(reviewsData || []);
        setAllCities(citiesData || []);
        setAllFestivals(festsData || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load culture details:", err);
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
        itemType: "culture",
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
    topic?.related_city_ids?.includes(c.id),
  );
  
  const relatedFestivals = allFestivals.filter((f) =>
    topic?.related_festival_ids?.includes(f.id),
  );

  if (loading) {
    return (
      <div className="cultureLoading">
        <Compass className="spinner" size={48} />
        <p>Unfolding cultural archives...</p>
      </div>
    );
  }

  if (!topic) {
    return (
      <div className="cultureNotFound">
        <h2>Culture Topic Not Found</h2>
        <p>This chapter of cultural heritage is not documented in the archives yet.</p>
        <Link to="/history-culture" className="btnHome">
          Back to History & Culture
        </Link>
      </div>
    );
  }

  return (
    <div className="cultureDetailPage">
      <header className="cultureDetailHeader">
        <div className="headerContent">
          <Link to="/history-culture" className="homeBreadcrumb">
            ← Return to History & Culture Hub
          </Link>
          <h1>{topic.title}</h1>
          <span className="categoryBadge">{topic.category}</span>
        </div>
      </header>

      <section className="cultureDetailBody">
        <div className="cultureDetailGrid">
          <div className="cultureLeft">
            <div
              className="cultureHeroImage"
              style={{
                backgroundImage: `url(${topic.image_url || topic.imageUrl || "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=800&q=80"})`,
              }}
            />

            <div className="cardBlock">
              <h2>Historical Context & Overview</h2>
              <p>{topic.description}</p>
            </div>

            {topic.details && Object.keys(topic.details).length > 0 && (
              <div className="cardBlock">
                <h2>Fine Details & Characteristics</h2>
                <div className="detailsGrid">
                  {Object.entries(topic.details).map(([key, val]) => (
                    <div className="detailsRow" key={key}>
                      <strong>{key.replace(/_/g, " ")}:</strong>
                      <span className="valText">
                        {Array.isArray(val) ? val.join(", ") : val}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="cultureRight">
            <div className="stickySidebar">
              {/* Connected entities Card */}
              {(relatedCities.length > 0 || relatedFestivals.length > 0) && (
                <div className="quickInfoCard">
                  <h3>Cultural Connections</h3>
                  
                  {relatedCities.length > 0 && (
                    <div className="connRow">
                      <span className="connLabel">📍 Prominent Regions / Hubs:</span>
                      <div className="connList">
                        {relatedCities.map((c) => (
                          <Link to={`/cities/${c.id}`} className="connLink" key={c.id}>
                            {c.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {relatedFestivals.length > 0 && (
                    <div className="connRow">
                      <span className="connLabel">🎉 Associated Festivals:</span>
                      <div className="connList">
                        {relatedFestivals.map((f) => (
                          <Link to={`/festivals/${f.id}`} className="connLink" key={f.id}>
                            {f.title}
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
                    placeholder="Tell other travelers about where to buy authentic crafts, see performances, or what custom values to keep in mind..."
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
