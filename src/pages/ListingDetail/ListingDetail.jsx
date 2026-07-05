import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Compass, MapPin, Phone, MessageSquare, ShieldCheck, Star, Send, ArrowLeft } from 'lucide-react';
import { API_BASE_URL, fetchJson } from '../../config/api.js';
import './ListingDetail.css';
import useSEO from '../../hooks/useSEO';

export default function ListingDetail() {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Review Form state
  const [reviewAuthor, setReviewAuthor] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewMsg, setReviewMsg] = useState('');

  // Copy state
  const [copiedText, setCopiedText] = useState('');

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(''), 2000);
  };

  const parseNumbers = (numStr) => {
    if (!numStr) return [];
    return numStr.split(/[,;\/]+/).map(n => n.trim()).filter(Boolean);
  };

  // SEO
  useSEO({
    title: listing ? `${listing.title} — ${listing.category} in ${listing.location_address}` : 'Service Provider Directory',
    description: listing ? `${listing.title} is a verified ${listing.category} service provider in ${listing.location_address}. ${listing.description.slice(0, 120)}` : 'Directory listing details.',
    keywords: listing ? `${listing.title}, ${listing.category} Rajasthan, ${listing.location_address} directory` : 'Rajasthan directory',
    url: `${window.location.origin}/directory/${id}`
  });

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetchJson(`/api/listings/${id}`),
      fetch(`${API_BASE_URL}/api/reviews/${id}/listing`).then(res => res.ok ? res.json() : [])
    ])
      .then(([listingData, reviewsData]) => {
        setListing(listingData);
        setReviews(reviewsData);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load listing details:', err);
        setLoading(false);
      });
  }, [id]);

  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;

    setSubmittingReview(true);
    fetch(`${API_BASE_URL}/api/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        itemId: id,
        itemType: 'listing',
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
      <div className="listingLoadingPage">
        <Compass className="spinner" size={48} />
        <p>Loading directory partner information...</p>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="listingNotFound">
        <h2>Listing Not Found</h2>
        <p>This directory provider listing could not be found or verified.</p>
        <Link to="/directory" className="btnBack"><ArrowLeft size={16} /> Back to Directory</Link>
      </div>
    );
  }

  // Format phone & whatsapp URL
  const cleanPhone = (num) => {
    if (!num) return '';
    return num.replace(/[^0-9+]/g, '');
  };

  const phoneNumbers = listing ? parseNumbers(listing.contact_phone) : [];
  const whatsappNumbers = listing ? parseNumbers(listing.whatsapp) : [];

  const firstPhone = phoneNumbers[0] || '';
  const firstWhatsapp = whatsappNumbers[0] || '';
  const cleanedWhatsapp = cleanPhone(firstWhatsapp);
  const whatsappUrl = `https://wa.me/${cleanedWhatsapp.startsWith('+') ? cleanedWhatsapp.slice(1) : cleanedWhatsapp}`;

  return (
    <div className="listingDetailPage">
      <div className="detailContainer">
        
        {/* Back Link */}
        <Link to="/directory" className="backToDirLink">
          <ArrowLeft size={16} /> Back to Directory Explorer
        </Link>

        <div className="listingDetailLayout">
          
          {/* Main Info Column */}
          <div className="listingMainCol">
            
            <div className="listingCardHeaderBlock">
              <div className="badgeRow">
                <span className="listingCategoryBadge">{listing.category}</span>
                {listing.is_verified && (
                  <span className="listingVerifiedBadge">
                    <ShieldCheck size={14} /> Verified Partner
                  </span>
                )}
              </div>
              <h1>{listing.title}</h1>
              <p className="listingSubcategory">{listing.subcategory || 'Professional Services'}</p>
              
              <div className="headerRating">
                <div className="ratingStars">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={18} 
                      className={i < Math.floor(listing.rating || 5) ? "starFilled" : "starEmpty"} 
                    />
                  ))}
                </div>
                <span className="ratingText"><strong>{listing.rating || '5.0'}</strong> ({reviews.length} reviews)</span>
              </div>
            </div>

            <div className="listingMainContentCard">
              <h2>About this Service</h2>
              <p className="listingDescriptionText">{listing.description}</p>
              
              <div className="listingInfoRow">
                <div className="infoBlockItem">
                  <h3>📍 Location / Address</h3>
                  <p><MapPin size={16} className="inlineIcon" /> {listing.location_address}</p>
                </div>
                <div className="infoBlockItem">
                  <h3>💰 Estimate Pricing</h3>
                  <p><strong>{listing.pricing || 'Contact for rates'}</strong></p>
                </div>
              </div>
            </div>

            {/* Reviews Section */}
            <div className="listingReviewsCard">
              <h2>Traveler Reviews ({reviews.length})</h2>

              {/* Review Input Form */}
              <form onSubmit={handleSubmitReview} className="listingReviewForm">
                <h3>Write a Review</h3>
                {reviewMsg && <p className="reviewSuccessMsg">{reviewMsg}</p>}
                
                <div className="reviewFormRow">
                  <div className="formGroup">
                    <label>Your Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Rahul Sharma"
                      value={reviewAuthor}
                      onChange={(e) => setReviewAuthor(e.target.value)}
                    />
                  </div>
                  <div className="formGroup">
                    <label>Rating</label>
                    <select 
                      value={reviewRating} 
                      onChange={(e) => setReviewRating(Number(e.target.value))}
                    >
                      <option value="5">⭐⭐⭐⭐⭐ Excellent</option>
                      <option value="4">⭐⭐⭐⭐ Good</option>
                      <option value="3">⭐⭐⭐ Average</option>
                      <option value="2">⭐⭐ Fair</option>
                      <option value="1">⭐ Poor</option>
                    </select>
                  </div>
                </div>

                <div className="formGroup">
                  <label>Comment</label>
                  <textarea 
                    rows="4" 
                    placeholder="Share your experience working with this service provider..."
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    required
                  ></textarea>
                </div>

                <button type="submit" className="btnSubmitReview" disabled={submittingReview}>
                  {submittingReview ? 'Submitting...' : <><Send size={16} /> Post Review</>}
                </button>
              </form>

              {/* Reviews List */}
              <div className="reviewsFeed">
                {reviews.length === 0 ? (
                  <p className="noReviewsYet">No reviews yet. Be the first to share your experience!</p>
                ) : (
                  reviews.map((rev) => (
                    <div className="reviewFeedItem" key={rev.id}>
                      <div className="reviewItemHeader">
                        <strong>{rev.author}</strong>
                        <div className="ratingBadge">
                          <Star size={12} className="starFilled" /> {rev.rating}/5
                        </div>
                      </div>
                      <p className="reviewComment">{rev.comment}</p>
                      <span className="reviewDate">
                        {new Date(rev.created_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </span>
                    </div>
                  ))
                )}
              </div>

            </div>

          </div>

          {/* Sidebar / Quick Actions Column */}
          <div className="listingSidebarCol">
            <div className="actionCard">
              <h3>Connect & Inquiry</h3>
              <p>Verify details and coordinate services directly with the local provider.</p>
              
              <div className="sidebarContactDisplay">
                {phoneNumbers.length > 0 && (
                  <div className="sidebarContactSection">
                    <h4>📞 Contact Phone</h4>
                    {phoneNumbers.map((num, idx) => (
                      <div className="sidebarContactRow" key={idx}>
                        <span className="contactNumText">{num}</span>
                        <button 
                          className="btnCopyContactNumber" 
                          onClick={() => handleCopy(num)}
                          title="Copy Number"
                        >
                          {copiedText === num ? 'Copied!' : 'Copy'}
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {whatsappNumbers.length > 0 && (
                  <div className="sidebarContactSection">
                    <h4>💬 WhatsApp</h4>
                    {whatsappNumbers.map((num, idx) => (
                      <div className="sidebarContactRow" key={idx}>
                        <span className="contactNumText">{num}</span>
                        <button 
                          className="btnCopyContactNumber" 
                          onClick={() => handleCopy(num)}
                          title="Copy Number"
                        >
                          {copiedText === num ? 'Copied!' : 'Copy'}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="actionButtons">
                {firstPhone && (
                  <a href={`tel:${firstPhone}`} className="btnActionCall">
                    <Phone size={18} /> Call Provider
                  </a>
                )}
                {firstWhatsapp && (
                  <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="btnActionWhatsapp">
                    <MessageSquare size={18} /> Chat via WhatsApp
                  </a>
                )}
              </div>

              <div className="securityNotice">
                <ShieldCheck size={16} className="noticeIcon" />
                <p>Rajasthan Connect encourages negotiating rates and verifying guide licensing badges beforehand.</p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
