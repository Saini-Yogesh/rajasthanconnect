import React from "react";
import { Link } from "react-router-dom";
import { Utensils, ArrowRight } from "lucide-react";
import SectionHeader from "../../../components/ui/SectionHeader/SectionHeader";
import { CUISINE_HIGHLIGHTS } from "../data/homeContent";
import "./CuisineShowcase.css";

export default function CuisineShowcase() {
  return (
    <section className="homeSection homeSection--white cuisineShowcaseSection" aria-labelledby="cuisine-showcase-heading">
      <div className="homeSectionInner">
        <SectionHeader
          title="Royal Cuisine of the Desert"
          subtitle="70+ documented dishes — from warrior feasts cooked over cow-dung fires to palace sweets soaked in saffron rabri."
        />

        <div className="cuisineShowcaseGrid">
          {CUISINE_HIGHLIGHTS.map((dish) => (
            <Link key={dish.name} to={dish.link} className="cuisineShowcaseCard">
              <div className="cuisineShowcaseIcon" aria-hidden="true">
                <Utensils size={18} />
              </div>
              <h3>{dish.name}</h3>
              <span className="cuisineShowcaseOrigin">{dish.origin}</span>
              <p>{dish.note}</p>
              <span className="cuisineShowcaseLink">
                Read recipe <ArrowRight size={13} />
              </span>
            </Link>
          ))}
        </div>

        <div className="cuisineShowcaseCta">
          <Link to="/foods" className="homeBtnPrimary">
            Explore All 70+ Dishes →
          </Link>
        </div>
      </div>
    </section>
  );
}
