// routes/trip.routes.js
import express from "express";
import {
  create,
  list,
  getById,
  update,
  remove,
  getMarkerDetails,
} from "../controllers/trip.controller.js";
import {
  createTripValidator,
  updateTripValidator,
  markerDetailsValidator,
} from "../validators/trip.validator.js";
import { validate } from "../middlewares/validate.js";
import { authenticate } from "../middlewares/auth.js";
import { upload } from "../middlewares/upload.js";
import { parseJsonArraysMiddleware } from "../middlewares/parseJsonArraysMiddleware.js";

const router = express.Router();

// All trip routes require authentication
router.use(authenticate);

// Create trip
router.post(
  "/",
  upload.single("image"),
  parseJsonArraysMiddleware,
  validate(createTripValidator, "body"),
  create
);

// List trips
router.get("/", list);

// Get trip by ID
router.get("/:trip_id", getById);

// Update trip
router.put(
  "/:trip_id",
  upload.single("image"),
  parseJsonArraysMiddleware,
  validate(updateTripValidator, "body"),
  update
);

// Delete trip
router.delete("/:trip_id", remove);

// Get combined marker details (safety, weather, air quality)
router.get(
  "/marker/details",
  validate(markerDetailsValidator, "query"),
  getMarkerDetails
);

export { router as tripRoutes };
