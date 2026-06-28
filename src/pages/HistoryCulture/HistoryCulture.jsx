import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Compass, BookOpen, ShieldAlert, Award, ArrowUpRight } from 'lucide-react';
import { API_BASE_URL } from '../../config/api.js';
import './HistoryCulture.css';

export default function HistoryCulture() {
  const [cultureTopics, setCultureTopics] = useState([]);
  const [rulers, setRulers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('dynasties');

  useEffect(() => {
    Promise.all([
      fetch(`${API_BASE_URL}/api/culture`).then(res => res.json()),
      fetch(`${API_BASE_URL}/api/history`).then(res => res.json())
    ])
      .then(([cultureData, rulersData]) => {
        setCultureTopics(cultureData);
        setRulers(rulersData);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load history/culture details:', err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="culturePage">
      <header className="cultureHeader">
        <div className="headerContent">
          <h1>History & Cultural Heritage</h1>
          <p>Chronicles of Rajput dynasties, profiles of iconic kings, and guides on folk dances, clothing, and custom etiquettes.</p>
        </div>
      </header>

      {/* Chapters selection tab */}
      <div className="cultureTabsBar">
        <button 
          className={`tabBtn ${activeSection === 'dynasties' ? 'active' : ''}`}
          onClick={() => setActiveSection('dynasties')}
        >
          🏰 Rajput Dynasties & Kings
        </button>
        <button 
          className={`tabBtn ${activeSection === 'arts' ? 'active' : ''}`}
          onClick={() => setActiveSection('arts')}
        >
          💃 Folk Arts & Attire
        </button>
        <button 
          className={`tabBtn ${activeSection === 'etiquette' ? 'active' : ''}`}
          onClick={() => setActiveSection('etiquette')}
        >
          🤝 Cultural Etiquette & Pilgrimage
        </button>
      </div>

      <div className="cultureMainContent">
        {loading ? (
          <div className="cultureLoading">
            <Compass className="spinner" size={48} />
            <p>Uncovering royal archives and scripts...</p>
          </div>
        ) : (
          <div className="panelsContainer">
            
            {/* PANEL: DYNATIES & KINGS */}
            {activeSection === 'dynasties' && (
              <div className="panelDynasties">
                <div className="introNotes">
                  <h3>Chronicles of Chivalry</h3>
                  <p>
                    For centuries, Rajasthan was governed by various Rajput clans under independent kingdoms. 
                    The Sisodias of Mewar (Udaipur/Chittorgarh), the Rathores of Marwar (Jodhpur), the Kachwahas of Dhundhar (Jaipur), 
                    and the Bhatis of Jaisalmer forged legacies of valor, military resistance, and monumental architecture.
                  </p>
                </div>

                <div className="rulersGrid">
                  {rulers.map(ruler => (
                    <div className="rulerCard" key={ruler.id}>
                      <div 
                        className="rulerImg" 
                        style={{ backgroundImage: `url(${ruler.image_url || 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=500&q=80'})` }}
                      />
                      <div className="rulerInfo">
                        <span className="reignTag">👑 Reign: {ruler.reign_period}</span>
                        <h3>{ruler.name}</h3>
                        <p className="dynastyLabel"><strong>Dynasty:</strong> {ruler.dynasty}</p>
                        <p className="rulerBio">{ruler.biography}</p>
                        
                        <div className="achievementsBlock">
                          <h4>Key Achievements</h4>
                          <ul>
                            {ruler.achievements && ruler.achievements.map((ach, idx) => (
                              <li key={idx}>{ach}</li>
                            ))}
                          </ul>
                        </div>

                        {ruler.battles && ruler.battles.length > 0 && (
                          <div className="battlesBlock">
                            <h4>Historic Battles</h4>
                            {ruler.battles.map((battle, bIdx) => (
                              <div className="battleRow" key={bIdx}>
                                <strong>{battle.name}</strong>
                                <p>{battle.description}</p>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Relational Connections */}
                        {(ruler.related_city_ids?.length > 0 || ruler.related_place_ids?.length > 0) && (
                          <div className="connectedEntitiesBlock">
                            {ruler.related_city_ids?.length > 0 && (
                              <div className="connectedSubRow">
                                <span>Capital City:</span>
                                <div className="entityLinks">
                                  {ruler.related_city_ids.map(cityId => (
                                    <Link to={`/cities/${cityId}`} className="entityTagLink" key={cityId}>
                                      📍 {cityId.charAt(0).toUpperCase() + cityId.slice(1)}
                                    </Link>
                                  ))}
                                </div>
                              </div>
                            )}
                            {ruler.related_place_ids?.length > 0 && (
                              <div className="connectedSubRow">
                                <span>Associated Forts:</span>
                                <div className="entityLinks">
                                  {ruler.related_place_ids.map(placeId => (
                                    <Link to={`/places/${placeId}`} className="entityTagLink" key={placeId}>
                                      🏰 {placeId.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                                    </Link>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* PANEL: ARTS & ATTIRE */}
            {activeSection === 'arts' && (
              <div className="panelArts">
                <div className="artsGrid">
                  {cultureTopics.map(topic => (
                    <div className="artCard" key={topic.id}>
                      <div 
                        className="artImg" 
                        style={{ backgroundImage: `url(${topic.image_url || 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=500&q=80'})` }}
                      />
                      <div className="artInfo">
                        <span className="categoryBadge">{topic.category}</span>
                        <h3>{topic.title}</h3>
                        <p className="artDesc">{topic.description}</p>
                        
                        {topic.details && (
                          <div className="detailsBlock">
                            {Object.entries(topic.details).map(([key, val]) => (
                              <div className="detailsRow" key={key}>
                                <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong>
                                <span className="valText">
                                  {Array.isArray(val) ? val.join(', ') : val}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Relational Connections */}
                        {(topic.related_city_ids?.length > 0 || topic.related_festival_ids?.length > 0) && (
                          <div className="connectedEntitiesBlock">
                            {topic.related_city_ids?.length > 0 && (
                              <div className="connectedSubRow">
                                <span>Key Hubs:</span>
                                <div className="entityLinks">
                                  {topic.related_city_ids.map(cityId => (
                                    <Link to={`/cities/${cityId}`} className="entityTagLink" key={cityId}>
                                      📍 {cityId.charAt(0).toUpperCase() + cityId.slice(1)}
                                    </Link>
                                  ))}
                                </div>
                              </div>
                            )}
                            {topic.related_festival_ids?.length > 0 && (
                              <div className="connectedSubRow">
                                <span>Associated Festivals:</span>
                                <div className="entityLinks">
                                  {topic.related_festival_ids.map(festId => (
                                    <Link to={`/festivals/${festId}`} className="entityTagLink" key={festId}>
                                      🎉 {festId.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                                    </Link>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* PANEL: ETIQUETTE & PILGRIMAGE */}
            {activeSection === 'etiquette' && (
              <div className="panelEtiquette">
                <div className="etiquetteGrid">
                  
                  {/* Etiquette card */}
                  <div className="infoBlockCard">
                    <h3>🤝 Cultural Etiquettes & Guest Norms</h3>
                    <p>
                      Rajasthanis treat guests as manifestations of God (represented by the Sanskrit maxim <em>"Atithi Devo Bhava"</em>). 
                      When traveling, keeping these custom behaviors in mind is helpful:
                    </p>
                    <div className="guidelinePoints">
                      <div className="pointRow">
                        <strong>🙏 Greetings</strong>
                        <p>Greet locals with folded hands saying <em>"Khamma Ghani"</em> or <em>"Namaste"</em>. It shows high respect.</p>
                      </div>
                      <div className="pointRow">
                        <strong>🥾 Footwear</strong>
                        <p>Always remove your shoes before entering temples, shrines, residential kitchens, or carpeted living rooms.</p>
                      </div>
                      <div className="pointRow">
                        <strong>📸 Photography Consent</strong>
                        <p>Ask for permission before photographing women, children, active religious rites, or residential properties.</p>
                      </div>
                      <div className="pointRow">
                        <strong>👗 Appropriate Dress</strong>
                        <p>Dress modestly, keeping shoulders and knees covered when visiting sacred shrines and holy spaces.</p>
                      </div>
                    </div>
                  </div>

                  {/* Pilgrimage Circuits */}
                  <div className="infoBlockCard">
                    <h3>🙏 Famous Pilgrimage Circuits</h3>
                    <p>Rajasthan is a holy sanctuary for multiple faiths, featuring centuries-old shrines and ashrams:</p>
                    <div className="circuitList">
                      <div className="circuitRow">
                        <h4>Pushkar (Brahma Temple)</h4>
                        <p>One of the very few temples in the world dedicated to Lord Brahma. Surrounding the holy Pushkar Lake, it is a crucial site for Hindu devotees.</p>
                      </div>
                      <div className="circuitRow">
                        <h4>Ajmer Sharif Dargah</h4>
                        <p>The shrine of Sufi saint Hazrat Khwaja Moinuddin Chishti. It is visited by millions of people across all religions seeking blessings.</p>
                      </div>
                      <div className="circuitRow">
                        <h4>Dilwara Jain Temples (Mount Abu)</h4>
                        <p>A group of five marble temples built between the 11th and 13th centuries, legendary for their unparalleled stone engravings.</p>
                      </div>
                      <div className="circuitRow">
                        <h4>Karni Mata Temple (Deshnoke)</h4>
                        <p>Known globally as the Temple of Rats, where thousands of black rats (kabbas) are considered sacred and fed milk daily.</p>
                      </div>
                    </div>
                  </div>

                  {/* Royal Weddings */}
                  <div className="infoBlockCard fullWidthBlock">
                    <h3>👑 Royal Weddings & Destination Venues</h3>
                    <p>
                      Rajasthan is globally renowned as the ultimate destination for luxury royal weddings. 
                      Couples from across the globe choose the heritage hotels, floating lake palaces, and historic forts of Udaipur, Jaipur, and Jodhpur for weddings:
                    </p>
                    <div className="weddingGrid">
                      <div className="weddingVenue">
                        <strong>Taj Lake Palace (Udaipur)</strong>
                        <p>A floating white-marble palace on Lake Pichola, offering a fairy-tale royal heritage backdrop.</p>
                      </div>
                      <div className="weddingVenue">
                        <strong>Umaid Bhawan Palace (Jodhpur)</strong>
                        <p>One of the world's largest private residences, constructed with yellow sandstone, hosting high-profile weddings.</p>
                      </div>
                      <div className="weddingVenue">
                        <strong>Rambagh Palace (Jaipur)</strong>
                        <p>The former residence of the Maharaja of Jaipur, featuring sprawling Mughal gardens and royal banquet halls.</p>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            )}

          </div>
        )}
      </div>
    </div>
  );
}
