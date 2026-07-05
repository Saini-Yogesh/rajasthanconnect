import React from "react";
import { Link } from "react-router-dom";
import { Compass, Sparkles, MessageCircle, MapPin } from "lucide-react";
import "./Footercss.css";

const FOOTER_LINKS = [
  {
    heading: "Explore Rajasthan",
    links: [
      { to: "/cities", label: "Royal Cities" },
      { to: "/districts", label: "Districts" },
      { to: "/places", label: "Forts & Palaces" },
      { to: "/experiences", label: "Unique Experiences" },
      { to: "/royal-weddings", label: "Royal Wedding Venues" },
      { to: "/unesco-sites", label: "UNESCO World Heritage" },
    ],
  },
  {
    heading: "Culture & History",
    links: [
      { to: "/history-culture", label: "History & Dynasties" },
      { to: "/dynasties", label: "Royal Dynasties" },
      { to: "/events", label: "Historical Events" },
      { to: "/folk-arts", label: "Folk Arts" },
      { to: "/folk-music", label: "Folk Music & Instruments" },
      { to: "/attire", label: "Traditional Attire" },
    ],
  },
  {
    heading: "Heritage & Community",
    links: [
      { to: "/handicrafts", label: "Handicrafts" },
      { to: "/foods", label: "Royal Cuisine" },
      { to: "/festivals", label: "Festivals & Melas" },
      { to: "/languages", label: "Languages" },
      { to: "/communities", label: "Communities & Tribes" },
    ],
  },
  {
    heading: "Services",
    links: [
      { to: "/directory", label: "Local Directory" },
      { to: "/planner", label: "AI Trip Planner" },
      { to: "/ai-assistant", label: "Ask AI Guide" },
      { to: "/directory?register=true", label: "Register Business" },
      { to: "/feedback", label: "Share Feedback" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="footer">
      {/* Jali border */}
      <div className="footerJaliBorder" aria-hidden="true" />

      <div className="footerInner">
        {/* Brand */}
        <div className="footerBrand">
          <Link to="/" className="footerLogo">
            <Compass size={28} color="var(--color-primary)" />
            <span>
              Rajasthan<span className="footerLogoAccent">Connect</span>
            </span>
          </Link>
          <p className="footerTagline">
            The digital encyclopedia of the Land of Kings. Explore royal
            history, vibrant culture, and connect with verified local guides.
          </p>
          <div className="footerAiLinks">
            <Link to="/planner" className="footerAiBtn">
              <Sparkles size={14} /> AI Trip Planner
            </Link>
            <Link to="/ai-assistant" className="footerAiBtn">
              <MessageCircle size={14} /> Ask AI Guide
            </Link>
          </div>
          <p className="footerLocation">
            <MapPin size={13} /> Rajasthan, India 🇮🇳
          </p>
        </div>

        {/* Links grid */}
        <div className="footerLinksGrid">
          {FOOTER_LINKS.map((col) => (
            <div key={col.heading} className="footerLinksCol">
              <h4 className="footerColHeading">{col.heading}</h4>
              <ul className="footerLinkList">
                {col.links.map((l) => (
                  <li key={l.to}>
                    <Link to={l.to} className="footerLink">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="footerBottom">
        <p>
          &copy; {new Date().getFullYear()} RajasthanConnect. Built with ❤️ for
          the Land of Kings.
        </p>
        <p className="footerBottomRight">
          Preserving heritage · One story at a time
        </p>
      </div>
    </footer>
  );
}
