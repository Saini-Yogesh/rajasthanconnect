import React from "react";
import { Music, Palette, Crown, Wind } from "lucide-react";
import SectionHeader from "../../../components/ui/SectionHeader/SectionHeader";

const CULTURAL_HIGHLIGHTS = [
  {
    icon: Music,
    color: "#c2410c",
    bg: "#fff7ed",
    title: "Folk Music Traditions",
    subtitle: "Manganiyar · Kalbeliya · Langas",
    desc: "The desert songs of Rajasthan have been performed for royalty for 800 years. Manganiyar musicians use a single khamaycha to produce sounds rivaling a full orchestra.",
    badge: "UNESCO Intangible Heritage",
  },
  {
    icon: Palette,
    color: "#b45309",
    bg: "#fef9c3",
    title: "Living Art Forms",
    subtitle: "Miniature Painting · Phad · Pichwai",
    desc: "Rajasthani miniature paintings use gold leaf and natural pigments made from precious stones. A single Pichwai painting can take 6–18 months of continuous work.",
    badge: "2,000-Year Tradition",
  },
  {
    icon: Crown,
    color: "#7c3aed",
    bg: "#f5f3ff",
    title: "Royal Attire & Jewels",
    subtitle: "Pagri · Ghagra Choli · Kundan",
    desc: "A Rajput groom's wedding pagri (turban) is tied fresh each morning — it has 1,001 folds representing each virtue of valour. Kundan jewellery is set with uncut gemstones in 24K gold.",
    badge: "Royalty Since 700 AD",
  },
  {
    icon: Wind,
    color: "#0369a1",
    bg: "#f0f9ff",
    title: "Performing Arts",
    subtitle: "Kathputli · Bhavai · Chari Dance",
    desc: "Kathputli puppet shows narrate legends of Amar Singh Rathore. Chari dancers balance lit pots on their heads while performing — with zero rehearsal safety nets!",
    badge: "Street Theatre Since 900 AD",
  },
];

export default function LivingCulture() {
  return (
    <section className="homeSection homeSection--white culturalSection" aria-labelledby="living-culture-heading">
      <div className="homeSectionInner">
        <SectionHeader
          id="living-culture-heading"
          title="Living Culture of Rajasthan"
          subtitle="Ancient traditions that are still alive — passed from master to student for over a thousand years."
        />
        <div className="culturalGrid">
          {CULTURAL_HIGHLIGHTS.map((item, i) => {
            const Icon = item.icon;
            return (
              <div
                className="culturalCard"
                key={i}
                style={{ "--card-accent": item.color, "--card-bg": item.bg }}
              >
                <div
                  className="culturalIconBox"
                  style={{ background: item.bg }}
                >
                  <Icon size={28} style={{ color: item.color }} />
                </div>
                <span
                  className="culturalBadge"
                  style={{ background: item.color }}
                >
                  {item.badge}
                </span>
                <h3>{item.title}</h3>
                <p className="culturalSubtitle">{item.subtitle}</p>
                <p className="culturalDesc">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
