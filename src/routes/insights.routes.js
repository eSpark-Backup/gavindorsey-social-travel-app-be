// src/routes/insights.routes.js
import express from "express";
import {
  fetchInsights,
  fetchTripInsights,
} from "../controllers/insights.controller.js";
import { validate } from "../middlewares/validate.js";
import {
  insightsValidator,
  tripInsightsValidator,
} from "../validators/insights.validator.js";

const router = express.Router();

// GET /api/insights?lat=&lon=&days=
router.get("/", validate(insightsValidator, "query"), fetchInsights);

// GET /api/insights/trip/:tripId
router.get(
  "/trip/:tripId",
  validate(tripInsightsValidator, "params"),
  fetchTripInsights
);

export default router;
