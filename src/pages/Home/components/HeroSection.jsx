import React from "react";
import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";

export default function HeroSection({ greeting }) {
  return (
    <header className="heroBanner">
      <img
        src="https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=75&fm=webp"
        srcSet="
          https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=600&q=75&fm=webp 600w,
          https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=75&fm=webp 1200w,
          https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1600&q=75&fm=webp 1600w
        "
        sizes="100vw"
        alt="Royal Palace of Rajasthan"
        className="heroBackgroundImage"
        fetchPriority="high"
        loading="eager"
      />
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
