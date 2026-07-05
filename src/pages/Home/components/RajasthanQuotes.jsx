import React, { useState, useEffect } from "react";
import { Quote } from "lucide-react";
import SectionHeader from "../../../components/ui/SectionHeader/SectionHeader";
import { RAJASTHAN_QUOTES } from "../data/homeContent";
import "./RajasthanQuotes.css";

export default function RajasthanQuotes() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(
      () => setActive((prev) => (prev + 1) % RAJASTHAN_QUOTES.length),
      7000
    );
    return () => clearInterval(timer);
  }, [paused]);

  const quote = RAJASTHAN_QUOTES[active];

  return (
    <section
      className="homeSection homeSection--cream rajasthanQuotesSection"
      aria-labelledby="rajasthan-quotes-heading"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="homeSectionInner">
        <SectionHeader
          id="rajasthan-quotes-heading"
          title="Voices of the Desert"
          subtitle="Proverbs, greetings, and wisdom passed down through Rajput courts and village firesides."
        />
        <div className="rajasthanQuotesHighlight">
          <div className="rajasthanQuoteCard">
            <Quote className="rajasthanQuoteIcon" size={36} aria-hidden="true" />
            <blockquote>
              <p className="rajasthanQuoteHindi">{quote.text}</p>
              <p className="rajasthanQuoteTranslation">{quote.translation}</p>
              <footer className="rajasthanQuoteContext">— {quote.context}</footer>
            </blockquote>
            <div className="rajasthanQuoteDots" role="tablist" aria-label="Quote carousel">
              {RAJASTHAN_QUOTES.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  role="tab"
                  aria-selected={idx === active}
                  aria-label={`Quote ${idx + 1}`}
                  className={`rajasthanQuoteDot ${idx === active ? "active" : ""}`}
                  onClick={() => setActive(idx)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
