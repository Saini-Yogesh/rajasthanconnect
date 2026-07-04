import React from "react";
import { Link } from "react-router-dom";
import { Compass, MapPin } from "lucide-react";

const MAP_CITIES = [
  {
    id: "jaipur",
    name: "Jaipur",
    x: 75,
    y: 35,
    tagline: "The Pink City",
    desc: "Explore Hawa Mahal, Amber Fort and local markets.",
  },
  {
    id: "jodhpur",
    name: "Jodhpur",
    x: 45,
    y: 48,
    tagline: "The Blue City",
    desc: "Home of Mehrangarh Fort and iconic blue houses.",
  },
  {
    id: "udaipur",
    name: "Udaipur",
    x: 40,
    y: 75,
    tagline: "City of Lakes",
    desc: "Famous for floating marble palaces and Pichola sunsets.",
  },
  {
    id: "jaisalmer",
    name: "Jaisalmer",
    x: 15,
    y: 40,
    tagline: "The Golden Fort",
    desc: "Discover Sonar Qila and desert safaris at Sam Dunes.",
  },
  {
    id: "pushkar",
    name: "Pushkar",
    x: 55,
    y: 52,
    tagline: "The Holy Town",
    desc: "Sacred lakes, Brahma Temple, and the giant Camel Fair.",
  },
];

export default function InteractiveMap({ hoveredCity, setHoveredCity }) {
  return (
    <div className="hubCard mapPortalCard">
      <div className="cardHeader">
        <Compass className="headerIcon" />
        <h3>Interactive Kingdoms Map</h3>
        <p>
          Hover or tap on glowing nodes to preview Rajasthan's royal capitals.
        </p>
      </div>
      <div className="rajasthanMapCanvas">
        <div className="mapBackground"></div>
        {MAP_CITIES.map((city) => (
          <Link
            to={`/cities/${city.id}`}
            key={city.id}
            className="mapPin"
            style={{ left: `${city.x}%`, top: `${city.y}%` }}
            onMouseEnter={() => setHoveredCity(city)}
            onMouseLeave={() => setHoveredCity(null)}
          >
            <MapPin size={24} className="pinIcon" />
            <span className="pinPulse"></span>
            <span className="pinLabel">{city.name}</span>
          </Link>
        ))}
        {hoveredCity && (
          <div className="mapPopup">
            <h4>{hoveredCity.name}</h4>
            <span className="popupTagline">{hoveredCity.tagline}</span>
            <p>{hoveredCity.desc}</p>
            <span className="popupLink">Explore Portal →</span>
          </div>
        )}
      </div>
    </div>
  );
}
