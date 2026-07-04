import React from "react";
import { Link } from "react-router-dom";
import {
  MapPin,
  Landmark,
  PartyPopper,
  Utensils,
  Palette,
  Users,
  Languages,
  Building2,
} from "lucide-react";
import SectionHeader from "../../../components/ui/SectionHeader/SectionHeader";
import { RAJASTHAN_STATS } from "../data/homeContent";
import "./DiversityStats.css";

const ICONS = {
  "Cities & Towns": MapPin,
  Districts: Building2,
  "Heritage Places": Landmark,
  "Festivals & Fairs": PartyPopper,
  "Royal Dishes": Utensils,
  Handicrafts: Palette,
  Communities: Users,
  Languages: Languages,
};

export default function DiversityStats() {
  return (
    <section className="homeSection homeSection--cream diversityStatsSection" aria-labelledby="diversity-stats-heading">
      <div className="homeSectionInner">
        <SectionHeader
          title="Rajasthan at a Glance"
          subtitle="India's largest state by area — a living encyclopedia of forts, flavours, festivals, and folk traditions."
        />
        <div className="diversityStatsGrid">
          {RAJASTHAN_STATS.map((stat) => {
            const Icon = ICONS[stat.label] || MapPin;
            return (
              <Link
                key={stat.label}
                to={stat.link}
                className="diversityStatCard"
              >
                <div className="diversityStatIcon" aria-hidden="true">
                  <Icon size={22} />
                </div>
                <span className="diversityStatValue">{stat.value}</span>
                <h3 className="diversityStatLabel">{stat.label}</h3>
                <p className="diversityStatDetail">{stat.detail}</p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
