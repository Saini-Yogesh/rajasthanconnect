import React from "react";
import { Link } from "react-router-dom";
import { uniqueValues } from "../../../utils/arrays";
import { cultureTopicKey, cultureTopicLink } from "../../../utils/culture";

export default function ArtsPanel({ cultureTopics }) {
  return (
    <div className="panelArts">
      <div className="artsGrid">
        {cultureTopics.map((topic) => (
          <div className="artCard" key={cultureTopicKey(topic)}>
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
                        {uniqueValues(topic.related_city_ids).map((cityId) => (
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
                        {uniqueValues(topic.related_festival_ids).map((festId) => (
                          <Link to={`/festivals/${festId}`} className="entityTagLink" key={festId}>
                            🎉 {festId.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
              <Link to={cultureTopicLink(topic)} className="btnExploreCulture">
                Read Detailed Guide →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
