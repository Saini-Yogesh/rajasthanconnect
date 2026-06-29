import express from "express";

import { getCities, getCityById } from "../controllers/cities.js";
import { getPlaces, getPlaceById } from "../controllers/places.js";
import { getFoods, getFoodById } from "../controllers/foods.js";
import { getFestivals, getFestivalById } from "../controllers/festivals.js";
import { getCulture, getCultureById } from "../controllers/culture.js";
import { getHistory, getRulerById } from "../controllers/history.js";
import { getListings, createListing } from "../controllers/listings.js";
import { getReviews, createReview } from "../controllers/reviews.js";

const router = express.Router();

router.get("/cities", getCities);
router.get("/cities/:id", getCityById);

router.get("/places", getPlaces);
router.get("/places/:id", getPlaceById);

router.get("/foods", getFoods);
router.get("/foods/:id", getFoodById);

router.get("/festivals", getFestivals);
router.get("/festivals/:id", getFestivalById);

router.get("/culture", getCulture);
router.get("/culture/:id", getCultureById);

router.get("/history", getHistory);
router.get("/history/:id", getRulerById);

router.get("/listings", getListings);
router.post("/listings", createListing);

router.get("/reviews/:itemId/:itemType", getReviews);
router.post("/reviews", createReview);

export default router;
