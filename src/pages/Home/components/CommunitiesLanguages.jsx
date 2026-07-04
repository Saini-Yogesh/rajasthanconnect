import React from "react";
import { Link } from "react-router-dom";
import { Users, Languages, ArrowRight } from "lucide-react";
import SectionHeader from "../../../components/ui/SectionHeader/SectionHeader";
import { COMMUNITY_HIGHLIGHTS, LANGUAGE_HIGHLIGHTS } from "../data/homeContent";
import "./CommunitiesLanguages.css";

export default function CommunitiesLanguages() {
  return (
    <section className="homeSection homeSection--cream commLangSection" aria-labelledby="comm-lang-heading">
      <div className="homeSectionInner">
        <SectionHeader
          title="A Tapestry of Peoples & Tongues"
          subtitle="Rajasthan is not one culture — it is dozens of communities, each with its own dress, dialect, music, and memory."
        />

        <div className="commLangGrid">
          {/* Communities */}
          <div className="commLangPanel">
            <div className="commLangPanelHeader">
              <Users size={22} aria-hidden="true" />
              <h3>Communities &amp; Tribes</h3>
              <Link to="/communities" className="commLangPanelLink">
                View all 25+ <ArrowRight size={14} />
              </Link>
            </div>
            <ul className="commLangList">
              {COMMUNITY_HIGHLIGHTS.map((item) => (
                <li key={item.name}>
                  <Link to={item.link} className="commLangItem">
                    <div className="commLangItemTop">
                      <strong>{item.name}</strong>
                      <span className="commLangRegion">{item.region}</span>
                    </div>
                    <p>{item.trait}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Languages */}
          <div className="commLangPanel commLangPanelAlt">
            <div className="commLangPanelHeader">
              <Languages size={22} aria-hidden="true" />
              <h3>Languages &amp; Dialects</h3>
              <Link to="/languages" className="commLangPanelLink">
                View all 17+ <ArrowRight size={14} />
              </Link>
            </div>
            <ul className="commLangList">
              {LANGUAGE_HIGHLIGHTS.map((item) => (
                <li key={item.name}>
                  <Link to={item.link} className="commLangItem">
                    <div className="commLangItemTop">
                      <strong>{item.name}</strong>
                      <span className="commLangRegion">{item.speakers}</span>
                    </div>
                    <p>
                      <em>{item.phrase}</em> — {item.meaning}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
