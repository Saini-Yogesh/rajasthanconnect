import React, { useState } from 'react';
import { Compass, Sparkles, MapPin, Calendar, CircleDollarSign, Loader2, ArrowRight } from 'lucide-react';
import { API_BASE_URL } from '../../config/api.js';
import './TripPlanner.css';
import useSEO from '../../hooks/useSEO';
import { LIST_SEO } from '../../utils/seo';

export default function TripPlanner() {
  useSEO(LIST_SEO.planner);

  // Wizard states
  const [startingCity, setStartingCity] = useState('Jaipur');
  const [days, setDays] = useState(3);
  const [budget, setBudget] = useState(15000);
  const [selectedInterests, setSelectedInterests] = useState(['History', 'Food', 'Culture']);
  
  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [plannerError, setPlannerError] = useState("");

  const handleInterestToggle = (interest) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(prev => prev.filter(i => i !== interest));
    } else {
      setSelectedInterests(prev => [...prev, interest]);
    }
  };

  const handleGenerate = (e) => {
    e.preventDefault();
    
    // Frontend validation
    if (days === "") {
      setPlannerError("Please enter a duration (1-7 days).");
      return;
    }
    const daysNum = Number(days);
    if (!Number.isInteger(daysNum) || daysNum < 1 || daysNum > 7) {
      setPlannerError("Please enter a valid whole number of days between 1 and 7.");
      return;
    }

    if (budget === "") {
      setPlannerError("Please enter a budget.");
      return;
    }
    const budgetNum = Number(budget);
    if (!Number.isInteger(budgetNum) || budgetNum < 1000) {
      setPlannerError("Please enter a valid budget of at least 1,000 INR.");
      return;
    }

    setLoading(true);
    setItinerary(null);
    setPlannerError("");

    fetch(`${API_BASE_URL}/api/ai/plan-trip`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        startingCity,
        days: daysNum,
        budget: budgetNum,
        interests: selectedInterests
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.error || !data.days) {
          setPlannerError(data.error || "Could not generate itinerary right now. Please try again in a moment.");
          return;
        }
        setItinerary(data);
      })
      .catch(() => {
        setPlannerError("Could not reach the planner service. Please try again shortly.");
      })
      .finally(() => setLoading(false));
  };



  const interestsList = ['History', 'Food', 'Culture', 'Shopping', 'Desert Safari', 'Photography', 'Wildlife', 'Adventure'];

  return (
    <div className="plannerPage">
      <header className="plannerHeader">
        <Sparkles className="headerIcon" size={40} />
        <h1>AI Sightseeing Itinerary Planner</h1>
        <p>Input your parameters, and our AI engine will formulate a day-by-day sightseeing timeline detailing timings, hotspots, and pricing.</p>
      </header>

      <section className="plannerBody">
        <div className="plannerGrid">
          
          {/* Input Form Column */}
          <div className="plannerLeftCol">
            <div className="wizardCard">
              <form onSubmit={handleGenerate} className="wizardForm">
                
                <div className="formGroup">
                  <label><MapPin size={16} /> Starting City</label>
                  <select value={startingCity} onChange={(e) => setStartingCity(e.target.value)}>
                    <option value="Jaipur">Jaipur (Pink City)</option>
                    <option value="Jodhpur">Jodhpur (Blue City)</option>
                    <option value="Udaipur">Udaipur (City of Lakes)</option>
                    <option value="Jaisalmer">Jaisalmer (Golden City)</option>
                  </select>
                </div>

                <div className="formRow">
                  <div className="formGroup">
                    <label><Calendar size={16} /> Duration (Days)</label>
                    <input 
                      type="number" 
                      min="1" 
                      max="7" 
                      placeholder="3"
                      value={days} 
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === '') {
                          setDays('');
                        } else {
                          const parsed = parseInt(val, 10);
                          if (!isNaN(parsed)) {
                            setDays(parsed);
                          }
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === '.' || e.key === 'e' || e.key === 'E' || e.key === '+' || e.key === '-') {
                          e.preventDefault();
                        }
                      }}
                    />
                  </div>

                  <div className="formGroup">
                    <label><CircleDollarSign size={16} /> Budget (INR)</label>
                    <input 
                      type="number" 
                      min="1000" 
                      placeholder="15000"
                      value={budget} 
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === '') {
                          setBudget('');
                        } else {
                          const parsed = parseInt(val, 10);
                          if (!isNaN(parsed)) {
                            setBudget(parsed);
                          }
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === '.' || e.key === 'e' || e.key === 'E' || e.key === '+' || e.key === '-') {
                          e.preventDefault();
                        }
                      }}
                    />
                  </div>
                </div>

                <div className="formGroup">
                  <label>Selected Interests</label>
                  <div className="checkboxGrid">
                    {interestsList.map(interest => (
                      <button
                        type="button"
                        key={interest}
                        className={`interestSelectBtn ${selectedInterests.includes(interest) ? 'active' : ''}`}
                        onClick={() => handleInterestToggle(interest)}
                      >
                        {interest}
                      </button>
                    ))}
                  </div>
                </div>

                <button type="submit" className="btnGenerate" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="spinnerIcon" size={18} /> Generating Timeline...
                    </>
                  ) : (
                    <>
                      Formulate Itinerary <ArrowRight size={18} />
                    </>
                  )}
                </button>

              </form>
            </div>


          </div>

          {/* Results Column */}
          <div className="plannerRightCol">
            {loading ? (
              <div className="loadingTimeline">
                <Compass className="spinIcon" size={60} />
                <h3>Generating Sightseeing Itinerary</h3>
                <p>AI is parsing weather norms, traffic constraints, ticket timings, and local maps...</p>
              </div>
            ) : plannerError ? (
              <div className="timelineIdleState">
                <Compass size={64} className="idleIcon" />
                <h3>Planner Unavailable</h3>
                <p>{plannerError}</p>
              </div>
            ) : itinerary ? (
              <div className="itineraryDisplay">
                <div className="itineraryHeader">
                  <h2>{itinerary.title}</h2>
                  <p>Estimated Budget Used: <strong>{itinerary.totalEstimatedCost} INR</strong></p>
                </div>

                {/* Day-by-Day Timeline List */}
                <div className="timelineContainer">
                  {itinerary.days && itinerary.days.map(day => (
                    <div className="timelineDaySection" key={day.dayNumber}>
                      <div className="dayHeader">
                        <h3>Day {day.dayNumber}</h3>
                        <p>{day.theme}</p>
                      </div>

                      <div className="activitiesTimelineList">
                        {day.schedule && day.schedule.map((act, aIdx) => (
                          <div className="timelineActivityRow" key={aIdx}>
                            <div className="timeBullet">
                              <span>{act.time}</span>
                            </div>
                            <div className="activityCard">
                              <span className="travelTimeText">{act.travelTime} travel</span>
                              <h4>{act.activity}</h4>
                              <p className="activityLoc">📍 {act.location}</p>
                              <p className="activityDetails">{act.details}</p>
                              <span className="activityCost">Cost: {act.cost} INR</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Travel Tips List */}
                {itinerary.travelTips && (
                  <div className="travelTipsBox">
                    <h3>💡 Local Guidelines & Tips</h3>
                    <ul>
                      {itinerary.travelTips.map((tip, idx) => (
                        <li key={idx}>{tip}</li>
                      ))}
                    </ul>
                  </div>
                )}

              </div>
            ) : (
              <div className="timelineIdleState">
                <Compass size={64} className="idleIcon" />
                <h3>No Itinerary Formulated</h3>
                <p>Configure the checklist on the left and submit to generate a custom day-by-day royal plan.</p>
              </div>
            )}
          </div>

        </div>
      </section>
    </div>
  );
}
