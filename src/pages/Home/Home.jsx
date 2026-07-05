import React, { useState, useEffect, Suspense, lazy } from "react";
import useSEO from "../../hooks/useSEO";
import { LIST_SEO } from "../../utils/seo";
import LazySection from "../../components/ui/LazySection/LazySection";
import "./Home.css";
import "./homeTheme.css";

// ─── Statically imported top-of-fold components ───────────────────────────────
import HeroSection from "./components/HeroSection";
import FactsTicker from "./components/FactsTicker";
import DiversityStats from "./components/DiversityStats";
import RajasthanIntro from "./components/RajasthanIntro";
import SectionHeader from "../../components/ui/SectionHeader/SectionHeader";

// ─── Lazily loaded below-the-fold components ──────────────────────────────────
const InteractiveMap = lazy(() => import("./components/InteractiveMap"));
const TriviaQuiz = lazy(() => import("./components/TriviaQuiz"));
const RajasthanQuotes = lazy(() => import("./components/RajasthanQuotes"));
const PortalGrid = lazy(() => import("./components/PortalGrid"));
const CommunitiesLanguages = lazy(() => import("./components/CommunitiesLanguages"));
const FeaturedBanners = lazy(() => import("./components/FeaturedBanners"));
const CuisineShowcase = lazy(() => import("./components/CuisineShowcase"));
const LivingCulture = lazy(() => import("./components/LivingCulture"));
const FestivalRhythm = lazy(() => import("./components/FestivalRhythm"));
const FestivalsFasting = lazy(() => import("./components/FestivalsFasting"));
const AiCallout = lazy(() => import("./components/AiCallout"));

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

      <LazySection placeholderHeight="500px">
        <Suspense fallback={<div style={{ height: "500px" }} />}>
          <section className="homeSection homeSection--cream interactiveHubSection" aria-labelledby="interactive-hub-heading">
            <div className="homeSectionInner">
              <SectionHeader
                id="interactive-hub-heading"
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
        </Suspense>
      </LazySection>

      <LazySection placeholderHeight="250px">
        <Suspense fallback={<div style={{ height: "250px" }} />}>
          <RajasthanQuotes />
        </Suspense>
      </LazySection>

      <LazySection placeholderHeight="450px">
        <Suspense fallback={<div style={{ height: "450px" }} />}>
          <PortalGrid />
        </Suspense>
      </LazySection>

      <LazySection placeholderHeight="400px">
        <Suspense fallback={<div style={{ height: "400px" }} />}>
          <CommunitiesLanguages />
        </Suspense>
      </LazySection>

      <LazySection placeholderHeight="350px">
        <Suspense fallback={<div style={{ height: "350px" }} />}>
          <FeaturedBanners />
        </Suspense>
      </LazySection>

      <LazySection placeholderHeight="450px">
        <Suspense fallback={<div style={{ height: "450px" }} />}>
          <CuisineShowcase />
        </Suspense>
      </LazySection>

      <LazySection placeholderHeight="450px">
        <Suspense fallback={<div style={{ height: "450px" }} />}>
          <LivingCulture />
        </Suspense>
      </LazySection>

      <LazySection placeholderHeight="400px">
        <Suspense fallback={<div style={{ height: "400px" }} />}>
          <FestivalRhythm />
        </Suspense>
      </LazySection>

      <LazySection placeholderHeight="500px">
        <Suspense fallback={<div style={{ height: "500px" }} />}>
          <FestivalsFasting />
        </Suspense>
      </LazySection>

      <LazySection placeholderHeight="200px">
        <Suspense fallback={<div style={{ height: "200px" }} />}>
          <AiCallout />
        </Suspense>
      </LazySection>
    </div>
  );
}
