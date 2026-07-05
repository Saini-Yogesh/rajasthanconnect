import React from "react";
import { Link } from "react-router-dom";
import { Mountain, Sun, Droplets, Castle } from "lucide-react";
import SectionHeader from "../../../components/ui/SectionHeader/SectionHeader";
import "./RajasthanIntro.css";

const LANDSCAPES = [
  {
    icon: Sun,
    title: "The Thar Desert",
    text: "Rolling sand dunes, camel caravans, and starlit desert camps across Jaisalmer, Bikaner, and Barmer.",
  },
  {
    icon: Mountain,
    title: "The Aravalli Range",
    text: "India's oldest mountain chain — home to Kumbhalgarh's Great Wall and Mount Abu's hill stations.",
  },
  {
    icon: Droplets,
    title: "Lakes & Oases",
    text: "Udaipur's Pichola, Jaisamand (Asia's second-largest artificial lake), and sacred Pushkar Sarovar.",
  },
  {
    icon: Castle,
    title: "Fortress Country",
    text: "More forts and palaces than any Indian state — Chittorgarh, Mehrangarh, Amber, and 130 more.",
  },
];

export default function RajasthanIntro() {
  return (
    <section className="homeSection homeSection--white rajasthanIntroSection" aria-labelledby="rajasthan-intro-heading">
      <div className="homeSectionInner">
        <SectionHeader
          id="rajasthan-intro-heading"
          title="Land of Contrasts"
          subtitle="342,239 sq km of desert, forest, wetland, and walled cities — where every district speaks a different dialect and cooks a different feast."
        />

        <div className="rajasthanIntroBody">
          <p>
            Rajasthan is not a single story. It is <strong>48 historic cities</strong>,{" "}
            <strong>25 living communities</strong>, <strong>17 dialects</strong>, and a festival
            calendar so full that locals joke there is a mela to attend every few days. From the
            blue lanes of Jodhpur to the golden fort of Jaisalmer, from Marwari merchants to Bhil
            archers — this encyclopedia maps it all.
          </p>
        </div>

        <div className="rajasthanIntroGrid">
          {LANDSCAPES.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="rajasthanIntroCard">
                <Icon size={24} aria-hidden="true" />
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            );
          })}
        </div>

        <div className="rajasthanIntroLinks">
          <Link to="/districts">Explore 33 Districts →</Link>
          <Link to="/events">40+ Historical Events →</Link>
          <Link to="/dynasties">Royal Dynasties →</Link>
        </div>
      </div>
    </section>
  );
}
