import React, { useState, useEffect } from "react";
import { Send, Star } from "lucide-react";
import { API_BASE_URL } from "../../../config/api";
import "./ReviewsSection.css";

export default function ReviewsSection({ itemId, itemType }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewAuthor, setReviewAuthor] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewMsg, setReviewMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Fetch reviews on mount or when itemId changes
  useEffect(() => {
    if (!itemId) return;
    setLoading(true);
    fetch(`${API_BASE_URL}/api/reviews/${itemId}/${itemType}`)
      .then((res) => res.json())
      .then((data) => {
        setReviews(data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load reviews:", err);
        setLoading(false);
      });
  }, [itemId, itemType]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;

    setSubmitting(true);
    setReviewMsg("");

    fetch(`${API_BASE_URL}/api/reviews`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        itemId,
        itemType,
        rating: reviewRating,
        comment: reviewComment,
        author: reviewAuthor.trim() || "Anonymous Traveler",
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to post review");
        return res.json();
      })
      .then((newReview) => {
        setReviews((prev) => [newReview, ...prev]);
        setReviewAuthor("");
        setReviewComment("");
        setReviewRating(5);
        setReviewMsg("Thank you! Your review has been logged successfully.");
        setSubmitting(false);
      })
      .catch((err) => {
        console.error("Failed to post review:", err);
        setSubmitting(false);
      });
  };

  return (
    <div className="reviewsBlockCard">
      <h3>Traveler Reviews & Experiences ({reviews.length})</h3>

      {/* Submission Form */}
      <form className="reviewSubmitForm" onSubmit={handleSubmit}>
        <h4>Leave Your Review</h4>
        {reviewMsg && <p className="reviewSuccessMsg">{reviewMsg}</p>}

        <div className="formRow">
          <input
            type="text"
            placeholder="Your name..."
            value={reviewAuthor}
            onChange={(e) => setReviewAuthor(e.target.value)}
            disabled={submitting}
          />
          <select
            value={reviewRating}
            onChange={(e) => setReviewRating(Number(e.target.value))}
            disabled={submitting}
          >
            <option value="5">⭐⭐⭐⭐⭐ (5/5)</option>
            <option value="4">⭐⭐⭐⭐ (4/5)</option>
            <option value="3">⭐⭐⭐ (3/5)</option>
            <option value="2">⭐⭐ (2/5)</option>
            <option value="1">⭐ (1/5)</option>
          </select>
        </div>

        <textarea
          placeholder="Share your experiences, advice, or tips..."
          value={reviewComment}
          onChange={(e) => setReviewComment(e.target.value)}
          required
          disabled={submitting}
        ></textarea>

        <button type="submit" className="btnSubmitReview" disabled={submitting}>
          <Send size={14} /> {submitting ? "Submitting..." : "Submit Review"}
        </button>
      </form>

      {/* Reviews List */}
      <div className="reviewsList">
        {loading ? (
          <p className="loadingReviews">Loading review logs...</p>
        ) : reviews.length > 0 ? (
          reviews.map((rev) => (
            <div className="reviewItemCard" key={rev.id}>
              <div className="reviewHeader">
                <strong>{rev.author}</strong>
                <span className="revRating">
                  <Star size={12} fill="var(--color-accent)" stroke="var(--color-accent)" /> {rev.rating}/5
                </span>
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
          <p className="noReviewsYet">
            No experience reviews shared yet. Be the first!
          </p>
        )}
      </div>
    </div>
  );
}
