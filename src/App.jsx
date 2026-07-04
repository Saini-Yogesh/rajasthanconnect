import React, { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import "./Appcss.css";

// ─── Existing pages ───────────────────────────────────────────────────────────
import Home from "./pages/Home/Home";
import CitiesList from "./pages/CitiesList/CitiesList";
import CityDetail from "./pages/CityDetail/CityDetail";
import PlaceDetail from "./pages/PlaceDetail/PlaceDetail";
import FoodDetail from "./pages/FoodDetail/FoodDetail";
import FoodsList from "./pages/FoodsList/FoodsList";
import FestivalDetail from "./pages/FestivalDetail/FestivalDetail";
import FestivalsList from "./pages/FestivalsList/FestivalsList";
import HistoryCulture from "./pages/HistoryCulture/HistoryCulture";
import CultureDetail from "./pages/CultureDetail/CultureDetail";
import RulerDetail from "./pages/RulerDetail/RulerDetail";
import TripPlanner from "./pages/TripPlanner/TripPlanner";
import AiAssistant from "./pages/AiAssistant/AiAssistant";
import DirectoryListings from "./pages/DirectoryListings/DirectoryListings";
import NotFound from "./pages/NotFound/NotFound";

// ─── New pages ────────────────────────────────────────────────────────────────
import PlacesList from "./pages/PlacesList/PlacesList";
import HandicraftsList from "./pages/HandicraftsList/HandicraftsList";
import HandicraftDetail from "./pages/HandicraftDetail/HandicraftDetail";
import FolkArtsList from "./pages/FolkArtsList/FolkArtsList";
import FolkArtDetail from "./pages/FolkArtDetail/FolkArtDetail";
import FolkMusicList from "./pages/FolkMusicList/FolkMusicList";
import FolkMusicDetail from "./pages/FolkMusicDetail/FolkMusicDetail";
import AttireList from "./pages/AttireList/AttireList";
import AttireDetail from "./pages/AttireDetail/AttireDetail";
import LanguagesList from "./pages/LanguagesList/LanguagesList";
import CommunitiesList from "./pages/CommunitiesList/CommunitiesList";
import CommunityDetail from "./pages/CommunityDetail/CommunityDetail";
import ExperiencesList from "./pages/ExperiencesList/ExperiencesList";
import ExperienceDetail from "./pages/ExperienceDetail/ExperienceDetail";
import RoyalWeddingsList from "./pages/RoyalWeddingsList/RoyalWeddingsList";
import RoyalWeddingDetail from "./pages/RoyalWeddingDetail/RoyalWeddingDetail";
import UnescoSitesList from "./pages/UnescoSitesList/UnescoSitesList";
import UnescoSiteDetail from "./pages/UnescoSiteDetail/UnescoSiteDetail";
import DistrictsList from "./pages/DistrictsList/DistrictsList";
import DynastiesList from "./pages/DynastiesList/DynastiesList";
import HistoricalEventsList from "./pages/HistoricalEventsList/HistoricalEventsList";

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
        <Routes>
          {/* Home — manages its own full-bleed hero */}
          <Route path="/" element={<Home />} />

          {/* ── Cities & Places ───────────────────────── */}
          <Route path="/cities"          element={<Page><CitiesList /></Page>} />
          <Route path="/cities/:id"      element={<Page><CityDetail /></Page>} />
          <Route path="/places"          element={<Page><PlacesList /></Page>} />
          <Route path="/places/:id"      element={<Page><PlaceDetail /></Page>} />
          <Route path="/districts"       element={<Page><DistrictsList /></Page>} />

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
          <Route path="/directory"       element={<Page><DirectoryListings /></Page>} />
          <Route path="/planner"         element={<Page><TripPlanner /></Page>} />
          <Route path="/ai-assistant"    element={<Page><AiAssistant /></Page>} />

          {/* ── 404 ───────────────────────────────────── */}
          <Route path="*" element={<Page><NotFound /></Page>} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}
