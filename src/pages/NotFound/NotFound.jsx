import React from "react";
import { Link } from "react-router-dom";
import { Home, ArrowLeft } from "lucide-react";
import useSEO from "../../hooks/useSEO";
import { LIST_SEO } from "../../utils/seo";
import "../Home/homeTheme.css";
import "./NotFound.css";

const POPULAR_LINKS = [
  { to: "/cities", label: "Cities" },
  { to: "/places", label: "Forts & Palaces" },
  { to: "/festivals", label: "Festivals" },
  { to: "/foods", label: "Rajasthani Food" },
];

export default function NotFound() {
  useSEO(LIST_SEO.notFound);

  return (
    <section className="homeSection homeSection--cream notFoundPage" aria-labelledby="not-found-heading">
      <div className="homeSectionInner notFoundInner">
        <p className="notFoundCode" id="not-found-heading">404</p>

        <h1 className="notFoundTitleHi">
          खम्मा घणी सा! आपो रस्तो भटक ग्या हो...
        </h1>
        <p className="notFoundTitleEn">
          Greetings! You have wandered off the royal path.
        </p>

        <p className="notFoundDesc">
          This page does not exist or the route has moved. Head back home or try
          one of these popular routes.
        </p>

        <nav className="notFoundNav" aria-label="Popular pages">
          <ul className="notFoundLinks">
            {POPULAR_LINKS.map(({ to, label }) => (
              <li key={to}>
                <Link to={to} className="notFoundLink">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <Link to="/" className="notFoundHomeBtn">
          <ArrowLeft size={20} aria-hidden="true" />
          Return to Palace Gate
        </Link>
      </div>
    </section>
  );
}
