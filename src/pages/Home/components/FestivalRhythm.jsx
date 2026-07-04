import React from "react";
import { Link } from "react-router-dom";
import { CalendarDays, PartyPopper } from "lucide-react";
import SectionHeader from "../../../components/ui/SectionHeader/SectionHeader";
import { FESTIVAL_RHYTHM } from "../data/homeContent";
import "./FestivalRhythm.css";

export default function FestivalRhythm() {
  const { totalFestivals, daysPerFestival, tagline, highlights } = FESTIVAL_RHYTHM;

  return (
    <section className="homeSection homeSection--cream festivalRhythmSection" aria-labelledby="festival-rhythm-heading">
      <div className="homeSectionInner">
        <div className="festivalRhythmHero">
          <div className="festivalRhythmStat">
            <CalendarDays size={32} aria-hidden="true" />
            <div>
              <span className="festivalRhythmNumber">{totalFestivals}+</span>
              <span className="festivalRhythmLabel">Festivals &amp; Fairs</span>
            </div>
          </div>
          <div className="festivalRhythmDivider" aria-hidden="true" />
          <div className="festivalRhythmStat">
            <PartyPopper size={32} aria-hidden="true" />
            <div>
              <span className="festivalRhythmNumber">Every {daysPerFestival} Days</span>
              <span className="festivalRhythmLabel">A new celebration somewhere in Rajasthan</span>
            </div>
          </div>
        </div>

        <SectionHeader title="The Festival Calendar Never Rests" subtitle={tagline} />

        <div className="festivalRhythmGrid">
          {highlights.map((item) => (
            <div key={item.season} className="festivalRhythmCard">
              <span className="festivalRhythmSeason">{item.season}</span>
              <p>{item.events}</p>
            </div>
          ))}
        </div>

        <p className="festivalRhythmNote">
          From the Pushkar Camel Fair drawing 200,000 visitors to village Gangaur processions
          winding through pink lanes — Rajasthan celebrates life with unmatched colour and devotion.
        </p>

        <div className="festivalRhythmCta">
          <Link to="/festivals" className="homeBtnPrimary">
            Browse All {totalFestivals}+ Festivals →
          </Link>
        </div>
      </div>
    </section>
  );
}
