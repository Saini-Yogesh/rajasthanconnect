import React, { useState } from "react";
import { MessageSquare, Bug, Lightbulb, Star, Send, CheckCircle, AlertCircle } from "lucide-react";
import { API_BASE_URL } from "../../config/api.js";
import "./Feedback.css";

const FEEDBACK_TYPES = [
  { value: "suggestion",    label: "💡 Suggestion",       color: "#b45309" },
  { value: "bug",           label: "🐛 Bug Report",        color: "#dc2626" },
  { value: "content",       label: "📝 Content Issue",     color: "#0369a1" },
  { value: "appreciation",  label: "⭐ Appreciation",      color: "#15803d" },
  { value: "other",         label: "💬 Other",             color: "#7c3aed" },
];

const RATINGS = [1, 2, 3, 4, 5];
const RATING_LABELS = ["", "Poor", "Fair", "Good", "Great", "Excellent"];

export default function Feedback() {
  const [form, setForm] = useState({
    name: "", email: "", type: "suggestion",
    subject: "", message: "", rating: 0, page: "",
  });
  const [status, setStatus]       = useState("idle"); // idle | sending | success | error
  const [errorMsg, setErrorMsg]   = useState("");
  const [hoverRating, setHoverRating] = useState(0);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.message.trim()) return;
    setStatus("sending");
    setErrorMsg("");

    try {
      const res = await fetch(`${API_BASE_URL}/api/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();

      if (!res.ok) {
        setErrorMsg(json.message || json.error || "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }

      setStatus("success");
      setForm({ name: "", email: "", type: "suggestion", subject: "", message: "", rating: 0, page: "" });
    } catch {
      setErrorMsg("Could not reach the server. Please check your connection.");
      setStatus("error");
    }
  }

  return (
    <div className="feedbackPage">
      {/* Hero */}
      <div className="feedbackHero">
        <div className="feedbackHeroInner">
          <div className="feedbackHeroIcon">
            <MessageSquare size={32} />
          </div>
          <h1 className="feedbackHeroTitle">Share Your Feedback</h1>
          <p className="feedbackHeroSubtitle">
            Suggestions, bug reports, content issues, or just appreciation — we
            read everything and use it to improve RajasthanConnect.
          </p>
        </div>
        <div className="feedbackHeroPattern" aria-hidden="true" />
      </div>

      {/* Single card */}
      <div className="feedbackContainer">
        <div className="feedbackCard">
          {status === "success" ? (
            <div className="feedbackSuccess">
              <div className="feedbackSuccessIcon">
                <CheckCircle size={52} />
              </div>
              <h2>Thank you!</h2>
              <p>
                Your feedback has been received. We typically review submissions
                within 1–2 days and use them to prioritise improvements.
              </p>
              <button
                className="feedbackBtn"
                onClick={() => setStatus("idle")}
                id="feedback-send-another"
              >
                Send Another
              </button>
            </div>
          ) : (
            <form className="feedbackForm" onSubmit={handleSubmit} noValidate>

              {/* Type pills */}
              <div className="feedbackField">
                <label className="feedbackLabel">Type of feedback</label>
                <div className="feedbackTypeGrid">
                  {FEEDBACK_TYPES.map((t) => (
                    <button
                      key={t.value}
                      type="button"
                      id={`feedback-type-${t.value}`}
                      className={`feedbackTypeBtn${form.type === t.value ? " feedbackTypeBtnActive" : ""}`}
                      style={form.type === t.value ? { "--type-color": t.color } : {}}
                      onClick={() => setForm((p) => ({ ...p, type: t.value }))}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Name + Email */}
              <div className="feedbackRow">
                <div className="feedbackField">
                  <label className="feedbackLabel" htmlFor="feedback-name">
                    Name <span className="feedbackOptional">(optional)</span>
                  </label>
                  <input
                    id="feedback-name" name="name" type="text"
                    className="feedbackInput" placeholder="e.g. Priya Sharma"
                    value={form.name} onChange={handleChange}
                  />
                </div>
                <div className="feedbackField">
                  <label className="feedbackLabel" htmlFor="feedback-email">
                    Email <span className="feedbackOptional">(optional)</span>
                  </label>
                  <input
                    id="feedback-email" name="email" type="email"
                    className="feedbackInput" placeholder="for follow-up replies"
                    value={form.email} onChange={handleChange}
                  />
                </div>
              </div>

              {/* Subject + Page */}
              <div className="feedbackRow">
                <div className="feedbackField">
                  <label className="feedbackLabel" htmlFor="feedback-subject">
                    Subject <span className="feedbackOptional">(optional)</span>
                  </label>
                  <input
                    id="feedback-subject" name="subject" type="text"
                    className="feedbackInput" placeholder="Brief summary"
                    value={form.subject} onChange={handleChange}
                  />
                </div>
                <div className="feedbackField">
                  <label className="feedbackLabel" htmlFor="feedback-page">
                    Related page <span className="feedbackOptional">(optional)</span>
                  </label>
                  <input
                    id="feedback-page" name="page" type="text"
                    className="feedbackInput" placeholder="e.g. /cities/jaipur"
                    value={form.page} onChange={handleChange}
                  />
                </div>
              </div>

              {/* Message */}
              <div className="feedbackField">
                <label className="feedbackLabel" htmlFor="feedback-message">
                  Message <span className="feedbackRequired">*</span>
                </label>
                <textarea
                  id="feedback-message" name="message"
                  className="feedbackTextarea" rows={5}
                  placeholder="Describe your feedback in detail…"
                  value={form.message} onChange={handleChange} required
                />
                <span className="feedbackCharCount">{form.message.length} / 3000</span>
              </div>

              {/* Star rating */}
              <div className="feedbackField">
                <label className="feedbackLabel">
                  Overall experience <span className="feedbackOptional">(optional)</span>
                </label>
                <div className="feedbackStars" role="group" aria-label="Rating">
                  {RATINGS.map((r) => (
                    <button
                      key={r} type="button"
                      id={`feedback-star-${r}`}
                      className={`feedbackStar${r <= (hoverRating || form.rating) ? " feedbackStarActive" : ""}`}
                      onClick={() => setForm((p) => ({ ...p, rating: r }))}
                      onMouseEnter={() => setHoverRating(r)}
                      onMouseLeave={() => setHoverRating(0)}
                      aria-label={`${r} star${r > 1 ? "s" : ""}`}
                    >
                      <Star size={24} fill={r <= (hoverRating || form.rating) ? "currentColor" : "none"} />
                    </button>
                  ))}
                  {(form.rating > 0) && (
                    <span className="feedbackRatingLabel">{RATING_LABELS[form.rating]}</span>
                  )}
                </div>
              </div>

              {/* Error */}
              {status === "error" && (
                <div className="feedbackError" role="alert">
                  <AlertCircle size={16} />
                  {errorMsg}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit" id="feedback-submit"
                className="feedbackBtn feedbackBtnSubmit"
                disabled={status === "sending" || !form.message.trim()}
              >
                {status === "sending" ? (
                  <><span className="feedbackSpinner" aria-hidden="true" /> Sending…</>
                ) : (
                  <><Send size={16} /> Send Feedback</>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
