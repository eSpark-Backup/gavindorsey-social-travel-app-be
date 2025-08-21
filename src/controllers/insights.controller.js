// src/controllers/insights.controller.js

import * as insightsService from "../services/insights.service.js";
import { asyncWrapper } from "../utils/async_wrapper.js";
import { sendSuccess } from "../utils/response.js";
import { CustomError } from "../utils/custom_error.js";

/**
 * @desc Get insights data
 * @route GET /api/insights
 * @access Private (auth middleware should protect this)
 */
export const getInsights = asyncWrapper(async (req, res) => {
  const { lat, lon, days } = req.query;

  // Validate required params
  if (!lat || !lon) {
    throw new CustomError(
      "missing_coordinates",
      400,
      "Latitude and longitude are required"
    );
  }

  // Fetch insights from service layer
  const insights = await insightsService.getInsights({
    lat,
    lon,
    days: days || 7,
    userId: req.user?.id,
  });

  if (!insights || Object.keys(insights).length === 0) {
    throw new CustomError(
      "no_insights_found",
      404,
      "No insights data found for the given parameters"
    );
  }

  return sendSuccess(res, "Insights fetched successfully", insights);
});

/**
 * @desc Get insights for a specific trip
 * @route GET /api/insights/trip/:tripId
 * @access Private
 */
export const getTripInsights = asyncWrapper(async (req, res) => {
  const { tripId } = req.params;

  if (!tripId) {
    throw new CustomError("missing_trip_id", 400, "Trip ID is required");
  }

  const insights = await insightsService.getTripInsights({
    tripId,
    userId: req.user?.id,
  });

  if (!insights) {
    throw new CustomError(
      "trip_not_found_or_no_data",
      404,
      "No insights found for the specified trip"
    );
  }

  return sendSuccess(res, "Trip insights fetched successfully", insights);
});
