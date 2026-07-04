import React from "react";
import { Link } from "react-router-dom";
import { uniqueValues } from "../../../utils/arrays";

export default function DynastiesPanel({ rulers }) {
  return (
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
        {rulers.map((ruler) => (
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
              
              {ruler.achievements && ruler.achievements.length > 0 && (
                <div className="achievementsBlock">
                  <h4>Key Achievements</h4>
                  <ul>
                    {ruler.achievements.map((ach, idx) => (
                      <li key={idx}>{ach}</li>
                    ))}
                  </ul>
                </div>
              )}

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
                        {uniqueValues(ruler.related_city_ids).map((cityId) => (
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
                        {uniqueValues(ruler.related_place_ids).map((placeId) => (
                          <Link to={`/places/${placeId}`} className="entityTagLink" key={placeId}>
                            🏰 {placeId.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
              <Link to={`/rulers/${ruler.id}`} className="btnExploreRuler">
                Read Full Biography →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
