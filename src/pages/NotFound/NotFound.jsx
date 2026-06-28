import React from "react";
import { Link } from "react-router-dom";
import { Home } from "lucide-react";
import "./NotFound.css";

export default function NotFound() {
  return (
    <div className="notFoundPage">
      {/* Full-bleed background desert landscape */}
      <div className="desertLandscape">
        {/* Dune Layer 1 (Back) */}
        <svg
          className="dune duneBack"
          viewBox="0 0 1440 200"
          preserveAspectRatio="none"
        >
          <path
            d="M0,100 C360,40 720,160 1080,100 C1260,70 1350,110 1440,120 L1440,200 L0,200 Z"
            fill="#fed7aa"
            opacity="0.5"
          />
        </svg>

        {/* Resting Camel silhouette watermark in the background */}
        <div className="bgCamel" />

        {/* Dune Layer 2 (Front) */}
        <svg
          className="dune duneFront"
          viewBox="0 0 1440 200"
          preserveAspectRatio="none"
        >
          <path
            d="M0,130 C400,60 800,160 1200,110 C1320,95 1380,120 1440,130 L1440,200 L0,200 Z"
            fill="#ffedd5"
          />
        </svg>
      </div>

      <div className="notFoundContent">
        <h1 className="errorTitle">404</h1>
        <h2 className="rajasthaniTitle">
          खम्मा घणी सा! आपो रस्तो भटक ग्या हो...
        </h2>
        <h3 className="englishTitle">
          Greetings! You have wandered off the path...
        </h3>

        <p className="rajasthaniText">
          म्हारो ऊंट भी थक’र बैठ ग्यो है सा, अब आगे कोनी चालैला! (पेज कोनी मिल्यो)
        </p>
        <p className="englishText">
          Even our guide camel has sat down to rest and refuses to go further.
          This route seems broken or the page does not exist.
        </p>

        <div className="actionWrapper">
          <Link to="/" className="btnGoHome">
            <Home size={18} />
            <span>Return to Palace Gate</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
