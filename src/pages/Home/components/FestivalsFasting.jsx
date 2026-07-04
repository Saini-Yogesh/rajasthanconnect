import React from "react";
import { Link } from "react-router-dom";
import { MapPin } from "lucide-react";
import SectionHeader from "../../../components/ui/SectionHeader/SectionHeader";

const FESTIVALS_DATA = [
  {
    id: "desert-festival",
    month: "JAN–FEB",
    name: "Desert Festival",
    city: "Jaisalmer",
    color: "#c2410c",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcROHDId2hErF9bSB06A52Uj5hDtWD6IPHyjaUxXvDndCdqer-6wEhYxjKto&s=10",
    description:
      "Camel races, turban-tying contests, and folk performances against the golden dunes of Sam.",
    tags: ["Camel Race", "Folk Dance", "3 Days"],
  },
  {
    id: "gangaur",
    month: "MAR–APR",
    name: "Gangaur Festival",
    city: "Jaipur · Udaipur",
    color: "#7c3aed",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRLGQF5TDpUqap62HYqcoUi4_6OAgMkMvg4l3o8xfdFc6vvuqsaxjyogkI&s=10",
    description:
      "Women observe 18 days of fasting worshipping Goddess Gauri for the wellbeing of their husbands. Colourful processions wind through royal cities.",
    tags: ["18-Day Fast", "Procession", "Goddess Gauri"],
  },
  {
    id: "teej",
    month: "AUG",
    name: "Teej Festival",
    city: "Statewide",
    color: "#065f46",
    image:
      "https://www.wildvoyager.com/wp-content/uploads/2021/05/teej-1.webp",
    description:
      "The monsoon festival of swings! Women in green lehengas celebrate Parvati's reunion with Shiva. A sacred fast marks this joyful occasion.",
    tags: ["Monsoon", "Sacred Fast", "Swings & Songs"],
  },
  {
    id: "pushkar-fair",
    month: "OCT–NOV",
    name: "Pushkar Camel Fair",
    city: "Pushkar",
    color: "#b45309",
    image:
      "https://images.travelandleisureasia.com/wp-content/uploads/sites/2/2022/10/13165849/Pushkar-Fair-1600x900.jpg",
    description:
      "The world's largest camel fair — 50,000 camels, trading, hot air balloons over the lake, and the holiest Brahma Temple bath.",
    tags: ["World's Largest", "Camel Trade", "Holy Dip"],
  },
  {
    id: "diwali",
    month: "OCT–NOV",
    name: "Diwali in Udaipur",
    city: "Udaipur",
    color: "#9f1239",
    image:
      "https://thumbs.dreamstime.com/b/majestic-city-palace-udaipur-india-illuminated-thousands-lights-diwali-festival-s-reflection-shines-brightly-427407156.jpg",
    description:
      "The City of Lakes glows with 10,000 oil lamps reflected across Pichola. Fireworks from the Lake Palace make this the most photogenic Diwali in India.",
    tags: ["10,000 Diyas", "Lake Reflection", "Fireworks"],
  },
  {
    id: "lathmar-holi",
    month: "MAR",
    name: "Holi at Barsana",
    city: "Bharatpur region",
    color: "#be185d",
    image:
      "https://www.wticabs.com:3001/global/app/v1/aws/getImage/blogimages/1741339959534_1732883696236_Barsana_s__Lathmar_Holi__2024_Celebrations.jpg",
    description:
      "Lathmar Holi — women chase men with sticks while they shield themselves with shields. This 5,000-year tradition is the most energetic Holi in all of India!",
    tags: ["Lathmar", "5,000 Yr Tradition", "2 Days"],
  },
];

export default function FestivalsFasting() {
  return (
    <section className="homeSection homeSection--warm festivalsSection">
      <div className="homeSectionInner">
        <SectionHeader
          title="Festivals & Sacred Fasting"
          subtitle="Every month brings a new reason to celebrate in Rajasthan — from camel races to moonlit fasting vigils."
        />
        <div className="festivalsGrid">
          {FESTIVALS_DATA.map((f, i) => (
            <Link
              to={`/festivals/${f.id}`}
              className="festivalCard"
              key={i}
              style={{ "--fest-color": f.color, textDecoration: "none" }}
            >
              <div
                className="festivalCardImage"
                style={{ backgroundImage: `url(${f.image})` }}
              >
                <div
                  className="festMonthBadge"
                  style={{ background: f.color }}
                >
                  {f.month}
                </div>
              </div>
              <div className="festCardBody">
                <h3>{f.name}</h3>
                <p className="festCity">
                  <MapPin size={12} /> {f.city}
                </p>
                <p className="festDesc">{f.description}</p>
                <div className="festTags">
                  {f.tags.map((tag, j) => (
                    <span
                      key={j}
                      className="festTag"
                      style={{ borderColor: f.color, color: f.color }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <span className="festExploreLink" style={{ color: f.color }}>
                  Explore Guide →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
