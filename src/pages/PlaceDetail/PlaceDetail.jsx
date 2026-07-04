import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Clock, MapPin, Compass, AlertCircle, Sparkles, Send } from 'lucide-react';
import { API_BASE_URL, fetchJson } from '../../config/api.js';
import './PlaceDetail.css';
import useSEO from '../../hooks/useSEO';
import { buildPlaceSEO } from '../../utils/seo';

export default function PlaceDetail() {
  const { id } = useParams();
  const [place, setPlace] = useState(null);
  
  useSEO(buildPlaceSEO(place, id));

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [allRulers, setAllRulers] = useState([]);
  const [allFoods, setAllFoods] = useState([]);
  const [allFestivals, setAllFestivals] = useState([]);
  const [allCulture, setAllCulture] = useState([]);

  // Review Form state
  const [reviewAuthor, setReviewAuthor] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewMsg, setReviewMsg] = useState('');

  useEffect(() => {
    setLoading(true);
    // Fetch Place detail, reviews, and related nodes
    Promise.all([
      fetchJson(`/api/places/${id}`),
      fetch(`${API_BASE_URL}/api/reviews/${id}/place`).then(res => res.ok ? res.json() : []),
      fetchJson('/api/history').catch(() => []),
      fetchJson('/api/foods').catch(() => []),
      fetchJson('/api/festivals').catch(() => []),
      fetchJson('/api/culture').catch(() => [])
    ])
      .then(([placeData, reviewsData, rulersData, foodsData, festivalsData, cultureData]) => {
        setPlace(placeData);
        setReviews(reviewsData);
        setAllRulers(rulersData || []);
        setAllFoods(foodsData || []);
        setAllFestivals(festivalsData || []);
        setAllCulture(cultureData || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load place details:', err);
        setLoading(false);
      });
  }, [id]);

  const relatedRulers = allRulers.filter(r => place?.related_ruler_ids?.includes(r.id));
  const relatedFoods = allFoods.filter(f => place?.related_food_ids?.includes(f.id));
  const relatedFestivals = allFestivals.filter(f => place?.related_festival_ids?.includes(f.id));
  const relatedCulture = allCulture.filter(c => place?.related_culture_ids?.includes(c.id));

  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;

    setSubmittingReview(true);
    fetch(`${API_BASE_URL}/api/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        itemId: id,
        itemType: 'place',
        rating: reviewRating,
        comment: reviewComment,
        author: reviewAuthor || 'Anonymous Traveler'
      })
    })
      .then(res => res.json())
      .then(newReview => {
        setReviews(prev => [newReview, ...prev]);
        setReviewAuthor('');
        setReviewComment('');
        setReviewRating(5);
        setReviewMsg('Thank you! Your review has been logged successfully.');
        setSubmittingReview(false);
      })
      .catch(err => {
        console.error('Failed to post review:', err);
        setSubmittingReview(false);
      });
  };

  if (loading) {
    return (
      <div className="placeLoadingPage">
        <Compass className="spinner" size={48} />
        <p>Deciphering historical scrolls for this monument...</p>
      </div>
    );
  }

  if (!place) {
    return (
      <div className="placeNotFound">
        <h2>Monument Guide Not Found</h2>
        <p>The landmark details could not be retrieved from the database.</p>
        <Link to="/cities" className="btnBack">Back to Cities</Link>
      </div>
    );
  }

  return (
    <div className="placeDetailPage">
      <header className="placeHeader">
        <div className="headerLeft">
          <Link to={`/cities/${place.city_id}`} className="cityBreadcrumb">
            ← Back to {place.city_id.charAt(0).toUpperCase() + place.city_id.slice(1)} Portal
          </Link>
          <h1>{place.title}</h1>
          <span className="categoryTag">{place.category}</span>
        </div>
      </header>

      {/* Media Gallery Grid */}
      <section className="placeGallerySection">
        <div className="galleryGrid">
          {place.image_urls && place.image_urls.length > 0 ? (
            place.image_urls.map((img, idx) => (
              <div 
                key={idx} 
                className={`galleryItem ${idx === 0 ? 'mainFeaturedImg' : ''}`}
                style={{ backgroundImage: `url(${img})` }}
              />
            ))
          ) : (
            <div className="galleryItem mainFeaturedImg" style={{ backgroundImage: `url(https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80)` }} />
          )}
        </div>
      </section>

      {/* Details Columns */}
      <section className="placeContentSection">
        <div className="contentGrid">
          
          <div className="contentLeftColumn">
            <div className="cardBlock">
              <h2>Overview</h2>
              <p className="overviewText">{place.overview}</p>
            </div>

            {place.history && (
              <div className="cardBlock">
                <h2>History & Legends</h2>
                <p className="historyText">{place.history}</p>
              </div>
            )}

            {/* Travel Guidelines Cards */}
            <div className="cardBlock guidelinesBlock">
              <h2>Traveler Guidelines</h2>
              <div className="guidelinesGrid">
                {place.parking && (
                  <div className="guideCard">
                    <h4>🚗 Parking Availability</h4>
                    <p>{place.parking}</p>
                  </div>
                )}
                {place.photography_rules && (
                  <div className="guideCard">
                    <h4>📷 Photography Rules</h4>
                    <p>{place.photography_rules}</p>
                  </div>
                )}
                {place.things_to_avoid && (
                  <div className="guideCard dangerCard">
                    <h4>⚠️ Things to Avoid</h4>
                    <p>{place.things_to_avoid}</p>
                  </div>
                )}
                {place.travel_tips && (
                  <div className="guideCard tipsCard">
                    <h4>💡 Insider Travel Tips</h4>
                    <p>{place.travel_tips}</p>
                  </div>
                )}
              </div>
            </div>

            {/* FAQ Accordion List */}
            {place.faq && place.faq.length > 0 && (
              <div className="cardBlock faqBlock">
                <h2>Frequently Asked Questions</h2>
                <div className="faqList">
                  {place.faq.map((item, idx) => (
                    <div className="faqItem" key={idx}>
                      <h4>Q: {item.q}</h4>
                      <p>A: {item.a}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {/* Relational Connections */}
            {(relatedRulers.length > 0 || relatedFoods.length > 0 || relatedFestivals.length > 0 || relatedCulture.length > 0) && (
              <div className="cardBlock placeConnectionsCard">
                <h2>Royal Historical & Cultural Connections</h2>
                <p className="connectionsIntro">Explore related chapters in our Rajasthan Encyclopedia linked to this monument:</p>
                
                <div className="connectionsList">
                  {relatedRulers.length > 0 && (
                    <div className="connectionItemRow">
                      <span className="connectionLabel">👑 Related Rulers:</span>
                      <div className="connectionVal">
                        {relatedRulers.map(r => (
                          <Link to={`/rulers/${r.id}`} className="connectionLink" key={r.id}>
                            {r.name} ({r.dynasty})
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {relatedFoods.length > 0 && (
                    <div className="connectionItemRow">
                      <span className="connectionLabel">🍲 Local Foods:</span>
                      <div className="connectionVal">
                        {relatedFoods.map(f => (
                          <Link to={`/foods/${f.id}`} className="connectionLink" key={f.id}>
                            {f.title}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {relatedFestivals.length > 0 && (
                    <div className="connectionItemRow">
                      <span className="connectionLabel">🎉 Festivals Celebrated Here:</span>
                      <div className="connectionVal">
                        {relatedFestivals.map(f => (
                          <Link to={`/festivals/${f.id}`} className="connectionLink" key={f.id}>
                            {f.title}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {relatedCulture.length > 0 && (
                    <div className="connectionItemRow">
                      <span className="connectionLabel">🎨 Traditional Arts & Crafts:</span>
                      <div className="connectionVal">
                        {relatedCulture.map(c => (
                          <Link to="/history-culture" className="connectionLink" key={c.id}>
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

          {/* Quick info Sidebar */}
          <div className="contentRightColumn">
            <div className="stickySidebar">
              <div className="quickInfoCard">
                <h3>Visiting Parameters</h3>
                
                <div className="parameterRow">
                  <Clock size={18} className="paramIcon" />
                  <div>
                    <span>TIMINGS</span>
                    <strong>{place.timings}</strong>
                  </div>
                </div>

                <div className="parameterRow">
                  <MapPin size={18} className="paramIcon" />
                  <div>
                    <span>ENTRY TICKETS</span>
                    <strong>{place.entry_fee}</strong>
                  </div>
                </div>

                <div className="parameterRow">
                  <AlertCircle size={18} className="paramIcon" />
                  <div>
                    <span>BEST TIME TO VISIT</span>
                    <strong>{place.best_time}</strong>
                  </div>
                </div>
              </div>

              {/* REVIEWS SECTION */}
              <div className="reviewsBlockCard">
                <h3>Reviews & Experiences ({reviews.length})</h3>
                
                {/* Form */}
                <form className="reviewSubmitForm" onSubmit={handleSubmitReview}>
                  <h4>Leave Your Review</h4>
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
                    placeholder="Share your travel experiences, ticketing tips, guide availability..."
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    required
                  ></textarea>

                  <button type="submit" className="btnSubmitReview" disabled={submittingReview}>
                    <Send size={14} /> Submit Review
                  </button>
                </form>

                {/* List */}
                <div className="reviewsList">
                  {reviews.length > 0 ? (
                    reviews.map(rev => (
                      <div className="reviewItemCard" key={rev.id}>
                        <div className="reviewHeader">
                          <strong>{rev.author}</strong>
                          <span className="revRating">★ {rev.rating}/5</span>
                        </div>
                        <p className="revComment">{rev.comment}</p>
                        <span className="revDate">
                          {new Date(rev.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="noReviewsYet">No reviews yet. Be the first to share your experience!</p>
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
