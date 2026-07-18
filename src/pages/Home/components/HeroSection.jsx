import React from "react";
import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";

export default function HeroSection({ greeting }) {
  return (
    <header className="heroBanner">
      <picture>
        {/* Mobile source (Portrait aspect ratio 9:16) */}
        <source
          media="(max-width: 767px)"
          srcSet="
            https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&ar=9:16&w=400&q=60&fm=webp 400w,
            https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&ar=9:16&w=600&q=60&fm=webp 600w,
            https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&ar=9:16&w=800&q=60&fm=webp 800w
          "
          sizes="100vw"
        />
        {/* Desktop/Default source (Landscape aspect ratio 16:9) */}
        <source
          media="(min-width: 768px)"
          srcSet="
            https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&ar=16:9&w=1000&q=60&fm=webp 1000w,
            https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&ar=16:9&w=1400&q=60&fm=webp 1400w,
            https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&ar=16:9&w=1920&q=60&fm=webp 1920w
          "
          sizes="100vw"
        />
        <img
          src="https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&ar=16:9&w=1200&q=60&fm=webp"
          alt="Royal Palace of Rajasthan"
          className="heroBackgroundImage"
          fetchPriority="high"
          loading="eager"
        />
      </picture>
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
