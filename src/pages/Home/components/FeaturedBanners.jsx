import React from "react";
import { Link } from "react-router-dom";
import { Utensils, Calendar } from "lucide-react";
import SectionHeader from "../../../components/ui/SectionHeader/SectionHeader";
import "./FeaturedBanners.css";

export default function FeaturedBanners() {
  return (
    <section className="homeSection homeSection--cream highlightSections--continued">
      <div className="homeSectionInner">
        <SectionHeader
          title="Taste & Celebrate"
          subtitle="Jump straight into Rajasthan's royal kitchen and its world-famous festival calendar."
        />
        <div className="highlightGrid">
          <div className="highlightBanner foodBanner">
            <div className="bannerContent">
              <Utensils size={36} className="bannerIcon" />
              <h3>Rajasthani Gourmet</h3>
              <p>
                Discover historical recipes like Dal Baati Churma and fiery
                Laal Maas directly from Mewar royal kitchens.
              </p>
              <Link to="/foods" className="bannerLink">
                Learn Recipes
              </Link>
            </div>
          </div>
          <div className="highlightBanner festivalBanner">
            <div className="bannerContent">
              <Calendar size={36} className="bannerIcon" />
              <h3>Cultural Festivals</h3>
              <p>
                Check the calendar dates, locations, travel tips, and dress
                codes for the Pushkar Fair and Gangaur Festival.
              </p>
              <Link to="/festivals" className="bannerLink">
                View Festivals
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
