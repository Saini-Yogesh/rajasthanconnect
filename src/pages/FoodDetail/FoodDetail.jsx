import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Compass, BookOpen, Utensils, Star, Send } from 'lucide-react';
import { API_BASE_URL } from '../../config/api.js';
import './FoodDetail.css';

export default function FoodDetail() {
  const { id } = useParams();
  const [food, setFood] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [allCities, setAllCities] = useState([]);
  const [allFestivals, setAllFestivals] = useState([]);
  const [loading, setLoading] = useState(true);

  // Review state
  const [author, setAuthor] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [msg, setMsg] = useState('');

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch(`${API_BASE_URL}/api/foods/${id}`).then(res => res.json()),
      fetch(`${API_BASE_URL}/api/reviews/${id}/food`).then(res => res.json()),
      fetch(`${API_BASE_URL}/api/cities`).then(res => res.json()),
      fetch(`${API_BASE_URL}/api/festivals`).then(res => res.json())
    ])
      .then(([foodData, reviewsData, citiesData, festivalsData]) => {
        setFood(foodData);
        setReviews(reviewsData);
        setAllCities(citiesData || []);
        setAllFestivals(festivalsData || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load food details:', err);
        setLoading(false);
      });
  }, [id]);

  const relatedCities = allCities.filter(c => food?.related_city_ids?.includes(c.id));
  const relatedFestivals = allFestivals.filter(f => food?.related_festival_ids?.includes(f.id));

  const handlePostReview = (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    fetch(`${API_BASE_URL}/api/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        itemId: id,
        itemType: 'food',
        rating,
        comment,
        author: author || 'Anonymous Foodie'
      })
    })
      .then(res => res.json())
      .then(newReview => {
        setReviews(prev => [newReview, ...prev]);
        setAuthor('');
        setComment('');
        setRating(5);
        setMsg('Review posted successfully!');
      })
      .catch(err => console.error(err));
  };

  if (loading) {
    return (
      <div className="foodLoading">
        <Compass className="spinner" size={48} />
        <p>Gathering royal gourmet guides...</p>
      </div>
    );
  }

  if (!food) {
    return (
      <div className="foodNotFound">
        <h2>Gourmet Guide Not Found</h2>
        <p>This recipe has not been cataloged in our encyclopedia yet.</p>
        <Link to="/" className="btnHome">Back to Home</Link>
      </div>
    );
  }

  return (
    <div className="foodDetailPage">
      <header className="foodHeader">
        <div className="headerContent">
          <Link to="/" className="homeBreadcrumb">← Return to Chapter Hub</Link>
          <h1>{food.title}</h1>
          <p className="originLabel">📍 **Origin:** {food.origin}</p>
        </div>
      </header>

      {/* Hero Banner Grid */}
      <section className="foodBodySection">
        <div className="foodGrid">
          
          <div className="foodLeftCol">
            {/* Image */}
            <div 
              className="foodHeroImg" 
              style={{ backgroundImage: `url(${food.image_url || 'https://images.unsplash.com/photo-1585938338392-50a59970d8ee?auto=format&fit=crop&w=800&q=80'})` }}
            />

            <div className="cardBlock">
              <h2>Historical Background</h2>
              <p className="historyText">{food.history}</p>
            </div>

            <div className="recipeBlock flexGrid">
              <div className="ingredientsCard">
                <h3>📋 Ingredients Checklist</h3>
                <ul>
                  {food.ingredients && food.ingredients.map((ing, idx) => (
                    <li key={idx}>{ing}</li>
                  ))}
                </ul>
              </div>

              <div className="instructionsCard">
                <h3>🍳 Cookery Instructions</h3>
                <ol>
                  {food.recipe && food.recipe.map((step, idx) => (
                    <li key={idx}>{step}</li>
                  ))}
                </ol>
              </div>
            </div>

            {/* Relational Connections */}
            {(relatedCities.length > 0 || relatedFestivals.length > 0) && (
              <div className="cardBlock foodConnectionsCard">
                <h2>📖 Regional & Festive Chapters</h2>
                <div className="foodConnectionsLinks">
                  {relatedCities.length > 0 && (
                    <div className="foodConnRow">
                      <span className="foodConnLabel">Originated or Popular In:</span>
                      <div className="foodConnList">
                        {relatedCities.map(c => (
                          <Link to={`/cities/${c.id}`} className="foodConnLink" key={c.id}>
                            {c.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {relatedFestivals.length > 0 && (
                    <div className="foodConnRow">
                      <span className="foodConnLabel">Traditionally Prepared During:</span>
                      <div className="foodConnList">
                        {relatedFestivals.map(f => (
                          <Link to={`/festivals/${f.id}`} className="foodConnLink" key={f.id}>
                            {f.title}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="foodRightCol">
            <div className="stickySidebar">
              
              {/* Nutritional block */}
              <div className="nutritionalCard">
                <h3>Nutritional Value</h3>
                <p>{food.nutritional_value}</p>
                {food.festivals_served && (
                  <div className="festivalsServed">
                    <strong>Commonly served during:</strong>
                    <div className="badgeList">
                      {food.festivals_served.map(fest => (
                        <span className="festBadge" key={fest}>{fest}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Best Restaurants */}
              <div className="restaurantsCard">
                <h3>Best Eateries to Try</h3>
                {food.best_restaurants && food.best_restaurants.length > 0 ? (
                  <div className="restaurantList">
                    {food.best_restaurants.map((rest, idx) => (
                      <div className="restItem" key={idx}>
                        <h4>{rest.name}</h4>
                        <p>📍 {rest.address}, {rest.city}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>Check the main local directory for listings.</p>
                )}
              </div>

              {/* Reviews Card */}
              <div className="reviewsCard">
                <h3>Food Reviews ({reviews.length})</h3>
                
                <form onSubmit={handlePostReview} className="foodReviewForm">
                  {msg && <p className="successAlert">{msg}</p>}
                  <div className="formRow">
                    <input 
                      type="text" 
                      placeholder="Your name..." 
                      value={author}
                      onChange={(e) => setAuthor(e.target.value)}
                    />
                    <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
                      <option value="5">⭐⭐⭐⭐⭐</option>
                      <option value="4">⭐⭐⭐⭐</option>
                      <option value="3">⭐⭐⭐</option>
                      <option value="2">⭐⭐</option>
                      <option value="1">⭐</option>
                    </select>
                  </div>
                  <textarea 
                    placeholder="Rate the food, spiciness, ghee levels..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    required
                  ></textarea>
                  <button type="submit" className="btnSubmit"><Send size={12} /> Post Review</button>
                </form>

                <div className="foodReviewsList">
                  {reviews.length > 0 ? (
                    reviews.map(rev => (
                      <div className="foodRevCard" key={rev.id}>
                        <div className="revHeader">
                          <strong>{rev.author}</strong>
                          <span>★ {rev.rating}</span>
                        </div>
                        <p>{rev.comment}</p>
                      </div>
                    ))
                  ) : (
                    <p className="noReviews">No reviews yet.</p>
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
