import React, { useState, useEffect } from "react";
import useSEO from "../../hooks/useSEO";
import { LIST_SEO } from "../../utils/seo";
import "./Home.css";
import "./homeTheme.css";

import HeroSection from "./components/HeroSection";
import FactsTicker from "./components/FactsTicker";
import DiversityStats from "./components/DiversityStats";
import RajasthanIntro from "./components/RajasthanIntro";
import SectionHeader from "../../components/ui/SectionHeader/SectionHeader";
import InteractiveMap from "./components/InteractiveMap";
import TriviaQuiz from "./components/TriviaQuiz";
import RajasthanQuotes from "./components/RajasthanQuotes";
import PortalGrid from "./components/PortalGrid";
import CommunitiesLanguages from "./components/CommunitiesLanguages";
import FeaturedBanners from "./components/FeaturedBanners";
import CuisineShowcase from "./components/CuisineShowcase";
import LivingCulture from "./components/LivingCulture";
import FestivalRhythm from "./components/FestivalRhythm";
import FestivalsFasting from "./components/FestivalsFasting";
import AiCallout from "./components/AiCallout";

export default function Home() {
  useSEO(LIST_SEO.home);

  const [greeting, setGreeting] = useState("");
  const [activeTrivia, setActiveTrivia] = useState(0);
  const [hoveredCity, setHoveredCity] = useState(null);
  const [quizAnswered, setQuizAnswered] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [activeFact, setActiveFact] = useState(0);
  const [isFactTickerHovered, setIsFactTickerHovered] = useState(false);
  const [isTriviaHovered, setIsTriviaHovered] = useState(false);

  useEffect(() => {
    const h = new Date().getHours();
    if (h < 12) setGreeting("Khamma Ghani! Suprabhat (Good Morning)");
    else if (h < 17)
      setGreeting("Khamma Ghani! Dopehar Shubh (Good Afternoon)");
    else setGreeting("Khamma Ghani! Shubh Sandhya (Good Evening)");
  }, []);

  useEffect(() => {
    if (isTriviaHovered) return;
    const t = setInterval(() => setActiveTrivia((p) => (p + 1) % 5), 8000);
    return () => clearInterval(t);
  }, [isTriviaHovered]);

  useEffect(() => {
    if (isFactTickerHovered) return;
    const t = setInterval(() => setActiveFact((p) => (p + 1) % 20), 5000);
    return () => clearInterval(t);
  }, [isFactTickerHovered]);

  const handleQuizAnswer = (idx) => {
    setSelectedOption(idx);
    setQuizAnswered(idx === 2 ? "correct" : "incorrect");
  };

  const resetQuiz = () => {
    setQuizAnswered(null);
    setSelectedOption(null);
  };

  return (
    <div className="homeContainer">
      <HeroSection greeting={greeting} />

      <FactsTicker
        activeFact={activeFact}
        setActiveFact={setActiveFact}
        setIsFactTickerHovered={setIsFactTickerHovered}
      />

      <DiversityStats />

      <RajasthanIntro />

      <section className="homeSection homeSection--cream interactiveHubSection">
        <div className="homeSectionInner">
          <SectionHeader
            title="Discover Rajasthan Interactively"
            subtitle="Hover the map to explore royal cities, then test your knowledge with trivia and our daily quiz."
          />
          <div className="hubGrid">
            <InteractiveMap
              hoveredCity={hoveredCity}
              setHoveredCity={setHoveredCity}
            />
            <TriviaQuiz
              activeTrivia={activeTrivia}
              setActiveTrivia={setActiveTrivia}
              setIsTriviaHovered={setIsTriviaHovered}
              quizAnswered={quizAnswered}
              handleQuizAnswer={handleQuizAnswer}
              selectedOption={selectedOption}
              resetQuiz={resetQuiz}
            />
          </div>
        </div>
      </section>

      <RajasthanQuotes />

      <PortalGrid />

      <CommunitiesLanguages />

      <FeaturedBanners />

      <CuisineShowcase />

      <LivingCulture />

      <FestivalRhythm />

      <FestivalsFasting />

      <AiCallout />
    </div>
  );
}
