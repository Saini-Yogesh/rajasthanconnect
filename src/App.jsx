import React, { useEffect, Suspense, lazy } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import LoadingSpinner from "./components/ui/LoadingSpinner/LoadingSpinner";
import "./Appcss.css";

// ─── Homepage remains statically imported for fast initial load ──────────────────
import Home from "./pages/Home/Home";

// ─── Existing pages (Code Splitting) ───────────────────────────────────────────
const CitiesList = lazy(() => import("./pages/CitiesList/CitiesList"));
const CityDetail = lazy(() => import("./pages/CityDetail/CityDetail"));
const PlaceDetail = lazy(() => import("./pages/PlaceDetail/PlaceDetail"));
const FoodDetail = lazy(() => import("./pages/FoodDetail/FoodDetail"));
const FoodsList = lazy(() => import("./pages/FoodsList/FoodsList"));
const FestivalDetail = lazy(() => import("./pages/FestivalDetail/FestivalDetail"));
const FestivalsList = lazy(() => import("./pages/FestivalsList/FestivalsList"));
const HistoryCulture = lazy(() => import("./pages/HistoryCulture/HistoryCulture"));
const CultureDetail = lazy(() => import("./pages/CultureDetail/CultureDetail"));
const RulerDetail = lazy(() => import("./pages/RulerDetail/RulerDetail"));
const TripPlanner = lazy(() => import("./pages/TripPlanner/TripPlanner"));
const AiAssistant = lazy(() => import("./pages/AiAssistant/AiAssistant"));
const DirectoryListings = lazy(() => import("./pages/DirectoryListings/DirectoryListings"));
const ListingDetail = lazy(() => import("./pages/ListingDetail/ListingDetail"));
const DirectoryRegister = lazy(() => import("./pages/DirectoryRegister/DirectoryRegister"));
const NotFound = lazy(() => import("./pages/NotFound/NotFound"));

// ─── New pages (Code Splitting) ────────────────────────────────────────────────
const PlacesList = lazy(() => import("./pages/PlacesList/PlacesList"));
const HandicraftsList = lazy(() => import("./pages/HandicraftsList/HandicraftsList"));
const HandicraftDetail = lazy(() => import("./pages/HandicraftDetail/HandicraftDetail"));
const FolkArtsList = lazy(() => import("./pages/FolkArtsList/FolkArtsList"));
const FolkArtDetail = lazy(() => import("./pages/FolkArtDetail/FolkArtDetail"));
const FolkMusicList = lazy(() => import("./pages/FolkMusicList/FolkMusicList"));
const FolkMusicDetail = lazy(() => import("./pages/FolkMusicDetail/FolkMusicDetail"));
const AttireList = lazy(() => import("./pages/AttireList/AttireList"));
const AttireDetail = lazy(() => import("./pages/AttireDetail/AttireDetail"));
const LanguagesList = lazy(() => import("./pages/LanguagesList/LanguagesList"));
const CommunitiesList = lazy(() => import("./pages/CommunitiesList/CommunitiesList"));
const CommunityDetail = lazy(() => import("./pages/CommunityDetail/CommunityDetail"));
const ExperiencesList = lazy(() => import("./pages/ExperiencesList/ExperiencesList"));
const ExperienceDetail = lazy(() => import("./pages/ExperienceDetail/ExperienceDetail"));
const RoyalWeddingsList = lazy(() => import("./pages/RoyalWeddingsList/RoyalWeddingsList"));
const RoyalWeddingDetail = lazy(() => import("./pages/RoyalWeddingDetail/RoyalWeddingDetail"));
const UnescoSitesList = lazy(() => import("./pages/UnescoSitesList/UnescoSitesList"));
const UnescoSiteDetail = lazy(() => import("./pages/UnescoSiteDetail/UnescoSiteDetail"));
const DistrictsList = lazy(() => import("./pages/DistrictsList/DistrictsList"));
const DistrictDetail = lazy(() => import("./pages/DistrictDetail/DistrictDetail"));
const DynastiesList = lazy(() => import("./pages/DynastiesList/DynastiesList"));
const HistoricalEventsList = lazy(() => import("./pages/HistoricalEventsList/HistoricalEventsList"));
const Feedback = lazy(() => import("./pages/Feedback/Feedback"));

// ─── Scroll to top on route change ───────────────────────────────────────────
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

// ─── Route wrapper for pages that need top-padding (navbar clearance) ─────────
function Page({ children }) {
  return <div className="pageWithNav">{children}</div>;
}

export default function App() {
  return (
    <div className="appWrapper">
      <ScrollToTop />
      <Navbar />

      <main className="mainContent">
        <Suspense fallback={<LoadingSpinner message="Loading Page..." size="lg" />}>
          <Routes>
            {/* Home — manages its own full-bleed hero */}
            <Route path="/" element={<Home />} />

            {/* ── Cities & Places ───────────────────────── */}
            <Route path="/cities"          element={<Page><CitiesList /></Page>} />
            <Route path="/cities/:id"      element={<Page><CityDetail /></Page>} />
            <Route path="/places"          element={<Page><PlacesList /></Page>} />
            <Route path="/places/:id"      element={<Page><PlaceDetail /></Page>} />
            <Route path="/districts"       element={<Page><DistrictsList /></Page>} />
            <Route path="/districts/:id"   element={<Page><DistrictDetail /></Page>} />

            {/* ── Cuisine ───────────────────────────────── */}
            <Route path="/foods"           element={<Page><FoodsList /></Page>} />
            <Route path="/foods/:id"       element={<Page><FoodDetail /></Page>} />

            {/* ── Festivals ─────────────────────────────── */}
            <Route path="/festivals"       element={<Page><FestivalsList /></Page>} />
            <Route path="/festivals/:id"   element={<Page><FestivalDetail /></Page>} />

            {/* ── History & Culture ─────────────────────── */}
            <Route path="/history-culture" element={<Page><HistoryCulture /></Page>} />
            <Route path="/culture/:id"     element={<Page><CultureDetail /></Page>} />
            <Route path="/rulers/:id"      element={<Page><RulerDetail /></Page>} />
            <Route path="/dynasties"       element={<Page><DynastiesList /></Page>} />
            <Route path="/events"          element={<Page><HistoricalEventsList /></Page>} />

            {/* ── Handicrafts ───────────────────────────── */}
            <Route path="/handicrafts"     element={<Page><HandicraftsList /></Page>} />
            <Route path="/handicrafts/:id" element={<Page><HandicraftDetail /></Page>} />

            {/* ── Folk Arts ─────────────────────────────── */}
            <Route path="/folk-arts"       element={<Page><FolkArtsList /></Page>} />
            <Route path="/folk-arts/:id"   element={<Page><FolkArtDetail /></Page>} />

            {/* ── Folk Music ────────────────────────────── */}
            <Route path="/folk-music"      element={<Page><FolkMusicList /></Page>} />
            <Route path="/folk-music/:id"  element={<Page><FolkMusicDetail /></Page>} />

            {/* ── Attire ────────────────────────────────── */}
            <Route path="/attire"          element={<Page><AttireList /></Page>} />
            <Route path="/attire/:id"      element={<Page><AttireDetail /></Page>} />

            {/* ── Languages ─────────────────────────────── */}
            <Route path="/languages"       element={<Page><LanguagesList /></Page>} />

            {/* ── Communities & Tribes ──────────────────── */}
            <Route path="/communities"     element={<Page><CommunitiesList /></Page>} />
            <Route path="/communities/:id" element={<Page><CommunityDetail /></Page>} />

            {/* ── Experiences ───────────────────────────── */}
            <Route path="/experiences"     element={<Page><ExperiencesList /></Page>} />
            <Route path="/experiences/:id" element={<Page><ExperienceDetail /></Page>} />

            {/* ── Royal Weddings ────────────────────────── */}
            <Route path="/royal-weddings"     element={<Page><RoyalWeddingsList /></Page>} />
            <Route path="/royal-weddings/:id" element={<Page><RoyalWeddingDetail /></Page>} />

            {/* ── UNESCO Sites ──────────────────────────── */}
            <Route path="/unesco-sites"     element={<Page><UnescoSitesList /></Page>} />
            <Route path="/unesco-sites/:id" element={<Page><UnescoSiteDetail /></Page>} />

            {/* ── Services ──────────────────────────────── */}
            <Route path="/directory"          element={<Page><DirectoryListings /></Page>} />
            <Route path="/directory/register" element={<Page><DirectoryRegister /></Page>} />
            <Route path="/directory/:id"      element={<Page><ListingDetail /></Page>} />
            <Route path="/planner"            element={<Page><TripPlanner /></Page>} />
            <Route path="/ai-assistant"    element={<Page><AiAssistant /></Page>} />
            <Route path="/feedback"        element={<Page><Feedback /></Page>} />

            {/* ── 404 ───────────────────────────────────── */}
            <Route path="*" element={<Page><NotFound /></Page>} />
          </Routes>
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
