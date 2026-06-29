import React, { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import "./Appcss.css";

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

// Scroll to top on route changes
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <div className="appWrapper">
      <ScrollToTop />
      <Navbar />

      <main className="mainContent">
        <Routes>
          {/* Home - manages its own full-bleed hero with no top padding needed */}
          <Route path="/" element={<Home />} />

          {/* All other pages need padding-top to clear the fixed navbar */}
          <Route
            path="/cities"
            element={
              <div className="pageWithNav">
                <CitiesList />
              </div>
            }
          />
          <Route
            path="/cities/:id"
            element={
              <div className="pageWithNav">
                <CityDetail />
              </div>
            }
          />
          <Route
            path="/places/:id"
            element={
              <div className="pageWithNav">
                <PlaceDetail />
              </div>
            }
          />
          <Route
            path="/foods"
            element={
              <div className="pageWithNav">
                <FoodsList />
              </div>
            }
          />
          <Route
            path="/foods/:id"
            element={
              <div className="pageWithNav">
                <FoodDetail />
              </div>
            }
          />
          <Route
            path="/festivals"
            element={
              <div className="pageWithNav">
                <FestivalsList />
              </div>
            }
          />
          <Route
            path="/festivals/:id"
            element={
              <div className="pageWithNav">
                <FestivalDetail />
              </div>
            }
          />
          <Route
            path="/history-culture"
            element={
              <div className="pageWithNav">
                <HistoryCulture />
              </div>
            }
          />
          <Route
            path="/culture/:id"
            element={
              <div className="pageWithNav">
                <CultureDetail />
              </div>
            }
          />
          <Route
            path="/rulers/:id"
            element={
              <div className="pageWithNav">
                <RulerDetail />
              </div>
            }
          />
          <Route
            path="/planner"
            element={
              <div className="pageWithNav">
                <TripPlanner />
              </div>
            }
          />
          <Route
            path="/ai-assistant"
            element={
              <div className="pageWithNav">
                <AiAssistant />
              </div>
            }
          />
          <Route
            path="/directory"
            element={
              <div className="pageWithNav">
                <DirectoryListings />
              </div>
            }
          />
          <Route
            path="*"
            element={
              <div className="pageWithNav">
                <NotFound />
              </div>
            }
          />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

