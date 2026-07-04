import React from "react";
import { Link } from "react-router-dom";
import { Compass, BookOpen, Palette, Star, Wind, Moon, ListCollapse, Sparkles } from "lucide-react";
import SectionHeader from "../../../components/ui/SectionHeader/SectionHeader";

export default function PortalGrid() {
  return (
    <section className="homeSection homeSection--white portalGridSection">
      <div className="homeSectionInner">
        <SectionHeader
          title="Encyclopedia Chapters"
          subtitle="Select a portal below to dive deep into the land of kings."
        />
        <div className="portalGrid">
          <Link to="/cities" className="portalCard">
            <div className="cardIcon"><Compass size={32} /></div>
            <h3>Cities &amp; Portals</h3>
            <p>Travel logs, weather info, maps, and local emergency directories for Jaipur, Jodhpur, Udaipur, and more.</p>
            <span className="cardLink">Explore Cities →</span>
          </Link>
          <Link to="/history-culture" className="portalCard">
            <div className="cardIcon"><BookOpen size={32} /></div>
            <h3>History &amp; Culture</h3>
            <p>Chronicles of Rajput dynasties, biographies of rulers like Maharana Pratap, traditional attire, and folk arts.</p>
            <span className="cardLink">View History →</span>
          </Link>
          <Link to="/handicrafts" className="portalCard">
            <div className="cardIcon"><Palette size={32} /></div>
            <h3>Handicrafts &amp; Crafts</h3>
            <p>Blue pottery, block printing, Bandhani, Meenakari jewellery — 500+ year old artisan traditions still alive today.</p>
            <span className="cardLink">Explore Crafts →</span>
          </Link>
          <Link to="/experiences" className="portalCard">
            <div className="cardIcon"><Star size={32} /></div>
            <h3>Unique Experiences</h3>
            <p>Desert camel safaris, hot air balloons over Pushkar, royal palace stays, and cooking classes in Udaipur.</p>
            <span className="cardLink">Plan Experiences →</span>
          </Link>
          <Link to="/folk-arts" className="portalCard">
            <div className="cardIcon"><Wind size={32} /></div>
            <h3>Folk Arts &amp; Music</h3>
            <p>Ghoomar, Kathputli puppets, Manganiyar music — living traditions that have performed for royalty for 800 years.</p>
            <span className="cardLink">Discover Arts →</span>
          </Link>
          <Link to="/unesco-sites" className="portalCard">
            <div className="cardIcon"><Moon size={32} /></div>
            <h3>UNESCO Heritage Sites</h3>
            <p>Hill Forts of Rajasthan, Jantar Mantar, and Keoladeo — world-renowned treasures recognized by UNESCO.</p>
            <span className="cardLink">View UNESCO Sites →</span>
          </Link>
          <Link to="/directory" className="portalCard">
            <div className="cardIcon"><ListCollapse size={32} /></div>
            <h3>Local Provider Directory</h3>
            <p>Find licensed heritage walking tour guides, hotels, transport providers, and block-printing workshops.</p>
            <span className="cardLink">Open Directory →</span>
          </Link>
          <Link to="/planner" className="portalCard highlightCard">
            <div className="cardIcon"><Sparkles size={32} /></div>
            <h3>AI Sightseeing Planner</h3>
            <p>Generate a customized, day-by-day sightseeing timeline tailored to your budget, duration, and interests.</p>
            <span className="cardLink">Plan Your Trip →</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
