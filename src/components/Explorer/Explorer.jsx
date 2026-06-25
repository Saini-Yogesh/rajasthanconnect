import React from 'react';
import { Calendar, Compass, ArrowRight } from 'lucide-react';
import './Explorercss.css';

const CITIES = [
  {
    id: 'jaipur',
    name: 'Jaipur',
    tagline: 'The Pink City',
    description: 'Home to the magnificent Hawa Mahal, Amer Fort, and bustling traditional bazaars filled with textiles and gems.',
    image: '/images/jaipur.webp',
    bestTime: 'Oct - Mar',
    attraction: 'Amer Fort'
  },
  {
    id: 'udaipur',
    name: 'Udaipur',
    tagline: 'The City of Lakes',
    description: 'Often called the Venice of the East, famed for its floating Lake Palace, romantic boat rides, and the majestic Aravalli hills.',
    image: '/images/udaipur.webp',
    bestTime: 'Sep - Mar',
    attraction: 'City Palace'
  },
  {
    id: 'jodhpur',
    name: 'Jodhpur',
    tagline: 'The Blue City',
    description: 'Dominated by the grand Mehrangarh Fort, featuring stunning blue-painted alleys and the majestic Umaid Bhawan Palace.',
    image: '/images/jodhpur.webp',
    bestTime: 'Oct - Mar',
    attraction: 'Mehrangarh Fort'
  },
  {
    id: 'jaisalmer',
    name: 'Jaisalmer',
    tagline: 'The Golden City',
    description: 'A breathtaking sandstone fortress rising from the Thar Desert. Famed for its camel safaris, starlit camps, and havelis.',
    image: '/images/jaisalmer.webp',
    bestTime: 'Nov - Feb',
    attraction: 'Jaisalmer Fort'
  }
];

export default function Explorer({ onSelectCity }) {
  return (
    <section className="explorerSection" id="explore">
      <div className="sectionHeader">
        <span className="subtitle">Discover the Landmarks</span>
        <h2 className="sectionTitle">Explore the Royal Cities</h2>
      </div>

      <div className="cityGrid">
        {CITIES.map((city) => (
          <div 
            key={city.id} 
            className="cityCard"
            onClick={() => onSelectCity(city.name)}
          >
            <div className="imageWrapper">
              <img 
                src={city.image} 
                alt={`${city.name} - ${city.tagline}`} 
                className="placeholderSvg"
                onError={(e) => {
                  // Fallback if image doesn't load
                  e.target.src = 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=600&q=80';
                }}
              />
              <div className="cityColorOverlay"></div>
              <div className="cityNameTag">
                <h3>{city.name}</h3>
                <p style={{ fontSize: '0.85rem', fontWeight: 400, color: 'var(--color-primary)' }}>
                  {city.tagline}
                </p>
              </div>
            </div>

            <div className="cardBody">
              <p className="cardDesc">{city.description}</p>
              
              <div className="statsRow">
                <div className="statItem">
                  <Calendar size={15} color="var(--color-primary)" />
                  <span>
                    <span className="statLabel">Best:</span> {city.bestTime}
                  </span>
                </div>
                <div className="statItem">
                  <Compass size={15} color="var(--color-accent)" />
                  <span>
                    <span className="statLabel">Top:</span> {city.attraction}
                  </span>
                </div>
              </div>

              <button className="cardFooterBtn">
                Find Listings & Guides <ArrowRight size={14} style={{ marginLeft: 5, verticalAlign: 'middle' }} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
