import express from "express";

// Import all controllers
import { getDistricts, getDistrictById } from "../controllers/districts.js";
import { getCities, getCityById } from "../controllers/cities.js";
import { getPlaces, getPlaceById } from "../controllers/places.js";
import { getDynasties, getDynastyById } from "../controllers/dynasties.js";
import {
  getHistoryRulers,
  getHistoryRulerById,
} from "../controllers/history_rulers.js";
import {
  getHistoricalEvents,
  getHistoricalEventById,
} from "../controllers/historical_events.js";
import { getFoods, getFoodById } from "../controllers/foods.js";
import { getFestivals, getFestivalById } from "../controllers/festivals.js";
import { getFolkArts, getFolkArtById } from "../controllers/folk_arts.js";
import {
  getFolkMusicInstruments,
  getFolkMusicInstrumentById,
} from "../controllers/folk_music_instruments.js";
import {
  getHandicrafts,
  getHandicraftById,
} from "../controllers/handicrafts.js";
import { getAttire, getAttireById } from "../controllers/attire.js";
import { getLanguages, getLanguageById } from "../controllers/languages.js";
import {
  getCommunitiesTribes,
  getCommunityTribeById,
} from "../controllers/communities_tribes.js";
import {
  getCulturalEtiquette,
  getCulturalEtiquetteById,
} from "../controllers/cultural_etiquette.js";
import {
  getUnescoSites,
  getUnescoSiteById,
} from "../controllers/unesco_sites.js";
import {
  getRoyalWeddingVenues,
  getRoyalWeddingVenueById,
} from "../controllers/royal_wedding_venues.js";
import {
  getUniqueExperiences,
  getUniqueExperienceById,
} from "../controllers/unique_experiences.js";
import { getListings, createListing } from "../controllers/listings.js";
import { getReviews, createReview } from "../controllers/reviews.js";

// Legacy Adapters
import { getCulture, getCultureById } from "../controllers/culture.js";
import { getHistory, getRulerById } from "../controllers/history.js";

const router = express.Router();

// Districts
router.get("/districts", getDistricts);
router.get("/districts/:id", getDistrictById);

// Cities
router.get("/cities", getCities);
router.get("/cities/:id", getCityById);

// Places
router.get("/places", getPlaces);
router.get("/places/:id", getPlaceById);

// Dynasties
router.get("/dynasties", getDynasties);
router.get("/dynasties/:id", getDynastyById);

// History Rulers
router.get("/history-rulers", getHistoryRulers);
router.get("/history-rulers/:id", getHistoryRulerById);

// Historical Events
router.get("/historical-events", getHistoricalEvents);
router.get("/historical-events/:id", getHistoricalEventById);

// Foods
router.get("/foods", getFoods);
router.get("/foods/:id", getFoodById);

// Festivals
router.get("/festivals", getFestivals);
router.get("/festivals/:id", getFestivalById);

// Folk Arts
router.get("/folk-arts", getFolkArts);
router.get("/folk-arts/:id", getFolkArtById);

// Folk Music & Instruments
router.get("/folk-music-instruments", getFolkMusicInstruments);
router.get("/folk-music-instruments/:id", getFolkMusicInstrumentById);

// Handicrafts
router.get("/handicrafts", getHandicrafts);
router.get("/handicrafts/:id", getHandicraftById);

// Attire
router.get("/attire", getAttire);
router.get("/attire/:id", getAttireById);

// Languages
router.get("/languages", getLanguages);
router.get("/languages/:id", getLanguageById);

// Communities & Tribes
router.get("/communities-tribes", getCommunitiesTribes);
router.get("/communities-tribes/:id", getCommunityTribeById);

// Cultural Etiquette
router.get("/cultural-etiquette", getCulturalEtiquette);
router.get("/cultural-etiquette/:id", getCulturalEtiquetteById);

// UNESCO Sites
router.get("/unesco-sites", getUnescoSites);
router.get("/unesco-sites/:id", getUnescoSiteById);

// Royal Wedding Venues
router.get("/royal-wedding-venues", getRoyalWeddingVenues);
router.get("/royal-wedding-venues/:id", getRoyalWeddingVenueById);

// Unique Experiences
router.get("/unique-experiences", getUniqueExperiences);
router.get("/unique-experiences/:id", getUniqueExperienceById);

// Listings
router.get("/listings", getListings);
router.post("/listings", createListing);

// Reviews
router.get("/reviews/:itemId/:itemType", getReviews);
router.post("/reviews", createReview);

// Legacy Adapters to preserve frontend compatibility
router.get("/culture", getCulture);
router.get("/culture/:id", getCultureById);
router.get("/history", getHistory);
router.get("/history/:id", getRulerById);

export default router;
