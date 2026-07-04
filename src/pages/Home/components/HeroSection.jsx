import React from "react";
import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";

export default function HeroSection({ greeting }) {
  return (
    <header className="heroBanner">
      <div className="heroOverlay"></div>
      <div className="heroContent">
        <span className="heroPre">{greeting}</span>
        <h1>
          Rajasthan<span>Connect</span>
        </h1>
        <div className="heroDivider"></div>
        <p>
          India's greatest open-air museum — <strong>48+ cities</strong>,{" "}
          <strong>76+ festivals</strong>, <strong>70+ royal dishes</strong>, and centuries of
          Rajput valour. Explore forts, dynasties, folk arts, and connect with verified local guides.
        </p>
        <div className="heroActions">
          <Link to="/cities" className="btnPrimary">
            Explore Cities
          </Link>
          <Link to="/planner" className="btnSecondary">
            <Sparkles size={16} /> AI Trip Planner
          </Link>
        </div>
      </div>
    </header>
  );
}
