import React from "react";
import { Link } from "react-router-dom";

export default function AiCallout() {
  return (
    <section className="homeSection homeSection--dark chatCallout" aria-labelledby="ai-callout-heading">
      <div className="homeSectionInner chatCalloutContent">
        <h2 id="ai-callout-heading">Have questions about Rajasthan?</h2>
        <p>
          Ask our conversational AI assistant about translation phrases in
          Marwari, local etiquettes, and historic trivia.
        </p>
        <Link to="/ai-assistant" className="homeBtnLight">
          Chat with AI Guide
        </Link>
      </div>
    </section>
  );
}
