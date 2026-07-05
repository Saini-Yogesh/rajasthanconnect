import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Compass, ShieldAlert, Award, Star } from 'lucide-react';
import { fetchJson } from '../../config/api.js';
import './CityDetail.css';
import useSEO from '../../hooks/useSEO';
import { buildCitySEO } from '../../utils/seo';
import { rulerLinkLabel } from '../../utils/display';

export default function CityDetail() {
  const { id } = useParams();
  const [city, setCity] = useState(null);
  
  useSEO(buildCitySEO(city, id));

  const [places, setPlaces] = useState([]);
  const [listings, setListings] = useState([]);
  const [allFoods, setAllFoods] = useState([]);
  const [allFestivals, setAllFestivals] = useState([]);
  const [allRulers, setAllRulers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    setLoading(true);
    // Fetch City detail, places, listings and other nodes to connect
    Promise.all([
      fetchJson(`/api/cities/${id}`),
      fetchJson(`/api/places?city_id=${id}`).catch(() => []),
      fetchJson(`/api/listings?cityId=${id}`).catch(() => []),
      fetchJson('/api/foods').catch(() => []),
      fetchJson('/api/festivals').catch(() => []),
      fetchJson('/api/history').catch(() => [])
    ])
      .then(([cityData, placesData, listingsData, foodsData, festivalsData, rulersData]) => {
        setCity(cityData);
        setPlaces(placesData);
        setListings(listingsData);
        setAllFoods(foodsData || []);
        setAllFestivals(festivalsData || []);
        setAllRulers(rulersData || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load city details:', err);
        setLoading(false);
      });
  }, [id]);

  const relatedFoods = allFoods.filter(f => f.related_city_ids?.includes(id));
  const relatedFestivals = allFestivals.filter(f => f.related_city_ids?.includes(id));
  const relatedRulers = allRulers.filter(r => r.related_city_ids?.includes(id));

  if (loading) {
    return (
      <div className="cityLoadingPage">
        <Compass className="spinner" size={48} />
        <p>Entering the gates of the royal city portal...</p>
      </div>
    );
  }

  if (!city) {
    return (
      <div className="cityNotFound">
        <h2>City Portal Not Found</h2>
        <p>The city you are looking for has not been logged in the digital encyclopedia yet.</p>
        <Link to="/cities" className="btnBack">Back to Cities</Link>
      </div>
    );
  }

  return (
    <div className="cityDetailPage">
      {/* Banner */}
      <div 
        className="cityBanner" 
        style={{ backgroundImage: `url(${city.imageUrl || city.image_url || 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80'})` }}
      >
        <div className="bannerOverlay"></div>
        <div className="bannerContent">
          <span className="bannerSubtitle">{city.tagline}</span>
          <h1>{city.name}</h1>
          <div className="bannerDivider"></div>
          <p className="bestVisitTime">
            <MapPin size={16} /> <strong>Best Season:</strong> {city.bestTime || city.best_time}
          </p>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="tabsBarContainer">
        <div className="tabsBar">
          <button 
            className={`tabBtn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button 
            className={`tabBtn ${activeTab === 'places' ? 'active' : ''}`}
            onClick={() => setActiveTab('places')}
          >
            Places to Visit ({places.length})
          </button>
          <button 
            className={`tabBtn ${activeTab === 'guides' ? 'active' : ''}`}
            onClick={() => setActiveTab('guides')}
          >
            Guides & Stays
          </button>
          <button 
            className={`tabBtn ${activeTab === 'emergency' ? 'active' : ''}`}
            onClick={() => setActiveTab('emergency')}
          >
            Emergency Directory
          </button>
        </div>
      </div>

      {/* Tab Content Panels */}
      <div className="tabContentPanel">
        
        {/* PANEL: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="panelOverview">
            <div className="overviewLeft">
              <h3>About {city.name}</h3>
              <p className="cityDescriptionLarge">{city.description}</p>
              
              <div className="weatherCard">
                <h4>Seasonal Weather Norms</h4>
                <div className="weatherGrid">
                  <div className="weatherItem">
                    <span>☀️ Summer</span>
                    <strong>{(city.weatherInfo || city.weather_info)?.summer || 'N/A'}</strong>
                  </div>
                  <div className="weatherItem">
                    <span>🌧️ Monsoon</span>
                    <strong>{(city.weatherInfo || city.weather_info)?.monsoon || 'N/A'}</strong>
                  </div>
                  <div className="weatherItem">
                    <span>❄️ Winter</span>
                    <strong>{(city.weatherInfo || city.weather_info)?.winter || 'N/A'}</strong>
                  </div>
                </div>
              </div>
            </div>

            <div className="overviewRight">
              <div className="transportCard">
                <h3>Getting Around {city.name}</h3>
                {(city.transportInfo || city.transport_info) ? (
                  <div className="transportList">
                    {Object.entries(city.transportInfo || city.transport_info).map(([type, info]) => (
                      <div className="transportItem" key={type}>
                        <span className="transportType">{type.toUpperCase()}</span>
                        <p>{info}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>Transport details loading...</p>
                )}
              </div>
            </div>
            
            {/* Relational Connections */}
            {(relatedRulers.length > 0 || relatedFoods.length > 0 || relatedFestivals.length > 0) && (
              <div className="cityConnectionsSection">
                <h3 className="connectionsTitle">📖 Associated Historical & Cultural Chapters</h3>
                <div className="connectionsGrid">
                  {relatedRulers.length > 0 && (
                    <div className="connectionBlock">
                      <h4>👑 Kings & Dynasties</h4>
                      <div className="connectionLinks">
                        {relatedRulers.map(r => (
                          <Link to={`/rulers/${r.id}`} className="connectionLink" key={r.id}>
                            {rulerLinkLabel(r)}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                  {relatedFoods.length > 0 && (
                    <div className="connectionBlock">
                      <h4>🍲 Culinary Heritage</h4>
                      <div className="connectionLinks">
                        {relatedFoods.map(f => (
                          <Link to={`/foods/${f.id}`} className="connectionLink" key={f.id}>
                            {f.title}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                  {relatedFestivals.length > 0 && (
                    <div className="connectionBlock">
                      <h4>🎉 Grand Celebrations</h4>
                      <div className="connectionLinks">
                        {relatedFestivals.map(f => (
                          <Link to={`/festivals/${f.id}`} className="connectionLink" key={f.id}>
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
        )}

        {/* PANEL: PLACES TO VISIT */}
        {activeTab === 'places' && (
          <div className="panelPlaces">
            {places.length > 0 ? (
              <div className="placesDisplayGrid">
                {places.map(place => (
                  <div className="placeItemCard" key={place.id}>
                    <div 
                      className="placeCardImg" 
                      style={{ backgroundImage: `url(${place.image_urls?.[0] || 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=500&q=80'})` }}
                    >
                      <span className="placeCategoryBadge">{place.category}</span>
                    </div>
                    <div className="placeCardDetails">
                      <div className="ratingHeader">
                        <h3>{place.title}</h3>
                        <span className="ratingLabel">
                          <Star size={14} className="starIconFilled" /> {place.rating || '4.8'}
                        </span>
                      </div>
                      <p className="placeCardDesc">{place.overview.substring(0, 120)}...</p>
                      
                      <div className="placeMetaDetails">
                        <span><strong>Timings:</strong> {place.timings}</span>
                        <span><strong>Entry:</strong> {place.entry_fee}</span>
                      </div>

                      <Link to={`/places/${place.id}`} className="btnExplorePlace">
                        View Complete Guide
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="noPlacesLogged">
                <p>No monuments logged for this city yet. Check back soon!</p>
              </div>
            )}
          </div>
        )}

        {/* PANEL: GUIDES & STAYS */}
        {activeTab === 'guides' && (
          <div className="panelGuides">
            {listings.length > 0 ? (
              <div className="guidesGrid">
                {listings.map(list => (
                  <div className="listingCompactCard" key={list.id}>
                    <div className="listingText">
                      <div className="badgeRow">
                        <span className="listCat">{list.category}</span>
                        {list.is_verified && <span className="verifiedBadge"><Award size={12} /> Verified</span>}
                      </div>
                      <h3>{list.title}</h3>
                      <p className="listSubcat">{list.subcategory}</p>
                      <p className="listDesc">{list.description}</p>
                      <p className="listPrice">💰 {list.pricing}</p>
                      
                      <div className="listingContact">
                        <span>📞 {list.contact_phone}</span>
                        {list.whatsapp && <span>💬 WhatsApp: {list.whatsapp}</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="noGuidesLogged">
                <p>No verified guides or hotels listed for this city. Use the Directory to register one.</p>
                <Link to="/directory?register=true" className="btnRegisterDirect">Register Business</Link>
              </div>
            )}
          </div>
        )}

        {/* PANEL: EMERGENCY DIRECTORY */}
        {activeTab === 'emergency' && (
          <div className="panelEmergency">
            <div className="emergencyAlertCard">
              <ShieldAlert className="alertIcon" size={32} />
              <div>
                <h3>Emergency Services for Travelers</h3>
                <p>Always seek assistance from verified Tourist Police booths. Avoid isolated areas late at night.</p>
              </div>
            </div>

            <div className="contactsContainer">
              <div className="contactListCard">
                <h3>Emergency Helplines</h3>
                <div className="contactRow">
                  <span>National Tourist Helpline</span>
                  <strong>1363 (24/7 Multilingual Support)</strong>
                </div>
                <div className="contactRow">
                  <span>Police Helpline</span>
                  <strong>100 or 112</strong>
                </div>
                <div className="contactRow">
                  <span>Ambulance</span>
                  <strong>102 or 108</strong>
                </div>
              </div>

              {(city.emergency_contacts || city.emergencyContacts) && (
                <div className="contactListCard">
                  <h3>Local {city.name} Helpline Numbers</h3>
                  {Object.entries(city.emergency_contacts || city.emergencyContacts).map(([role, num]) => (
                    <div className="contactRow" key={role}>
                      <span className="contactRole">{role.toUpperCase()}</span>
                      <strong>{num}</strong>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
