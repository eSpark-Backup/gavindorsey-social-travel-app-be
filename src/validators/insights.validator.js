// src/validators/insights.validator.js
import Joi from "joi";

// Common coordinate rules
const latRule = Joi.number().min(-90).max(90).required().messages({
  "any.required": "lat is required",
  "number.base": "lat must be a number",
  "number.min": "lat must be >= -90",
  "number.max": "lat must be <= 90",
});

const lonRule = Joi.number().min(-180).max(180).required().messages({
  "any.required": "lon is required",
  "number.base": "lon must be a number",
  "number.min": "lon must be >= -180",
  "number.max": "lon must be <= 180",
});

// GET /api/insights?lat=&lon=&days=
export const insightsValidator = {
  query: Joi.object({
    lat: latRule,
    lon: lonRule,
    // Optional: cap days to keep payloads small if we ever use it
    days: Joi.number().integer().min(1).max(7).default(1).messages({
      "number.base": "days must be a number",
      "number.integer": "days must be an integer",
      "number.min": "days must be at least 1",
      "number.max": "days must be at most 7",
    }),
  }).prefs({ convert: true, stripUnknown: true }),
};

// GET /api/insights/trip/:tripId
export const tripInsightsValidator = {
  params: Joi.object({
    tripId: Joi.string().uuid().required().messages({
      "any.required": "tripId is required",
      "string.guid": "tripId must be a valid UUID",
    }),
  }).prefs({ stripUnknown: true }),
};
