import React, { useEffect, lazy, Suspense } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import "./Appcss.css";

// Lazy load page components for route-splitting and FCP/LCP performance optimization
const Home = lazy(() => import("./pages/Home/Home"));
const CitiesList = lazy(() => import("./pages/CitiesList/CitiesList"));
const CityDetail = lazy(() => import("./pages/CityDetail/CityDetail"));
const PlaceDetail = lazy(() => import("./pages/PlaceDetail/PlaceDetail"));
const FoodDetail = lazy(() => import("./pages/FoodDetail/FoodDetail"));
const FoodsList = lazy(() => import("./pages/FoodsList/FoodsList"));
const FestivalDetail = lazy(() => import("./pages/FestivalDetail/FestivalDetail"));
const FestivalsList = lazy(() => import("./pages/FestivalsList/FestivalsList"));
const HistoryCulture = lazy(() => import("./pages/HistoryCulture/HistoryCulture"));
const TripPlanner = lazy(() => import("./pages/TripPlanner/TripPlanner"));
const AiAssistant = lazy(() => import("./pages/AiAssistant/AiAssistant"));
const DirectoryListings = lazy(() => import("./pages/DirectoryListings/DirectoryListings"));
const NotFound = lazy(() => import("./pages/NotFound/NotFound"));

// Premium dynamic route loader fallback component
function RouteLoader() {
  return (
    <div className="routeLoaderContainer">
      <div className="routeLoaderSpinner"></div>
      <p className="routeLoaderText">Loading heritage archives...</p>
    </div>
  );
}

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
        <Suspense fallback={<RouteLoader />}>
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
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}

