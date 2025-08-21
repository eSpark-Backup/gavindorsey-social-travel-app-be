// controllers/trip.controller.js
import {
  createTrip,
  getTrips,
  getTripById,
  updateTrip,
  deleteTrip,
} from "../services/trip.service.js";
import { asyncWrapper } from "../utils/async_wrapper.js";
import * as response from "../utils/response.js";
import { getSafetyInfo } from "../services/safety.service.js";
import { getWeatherInfo } from "../services/weather.service.js";
import { getAirQualityInfo } from "../services/airquality.service.js";
import { CustomError } from "../utils/custom_error.js";

// Create trip
const create = asyncWrapper(async (req, res) => {
  const { startDate, endDate, location, budget, totalCost, days, markers } =
    req.body;

  const formattedDays = days?.map((d) => ({
    dayNumber: d.dayNumber,
    notes: d.notes,
    cost: d.cost,
  }));

  const formattedMarkers = markers?.map((m) => ({
    name: m.name,
    description: m.description || null,
    lat: parseFloat(m.lat),
    lon: parseFloat(m.lon),
    address: m.address || null,
  }));

  const { data } = await createTrip(
    req.user.user_id,
    req.user.user_id,
    {
      startDate: startDate ? new Date(startDate) : null,
      endDate: endDate ? new Date(endDate) : null,
      location,
      budget,
      totalCost,
      days: formattedDays,
      markers: formattedMarkers,
    },
    req.file?.buffer
  );

  response.success(res, data, "Trip created successfully");
});

// List trips
const list = asyncWrapper(async (req, res) => {
  const { data, pagination } = await getTrips(req.user.user_id, req.query);
  response.success(
    res,
    { trips: data, pagination },
    "Trips fetched successfully"
  );
});

// Get trip by ID
const getById = asyncWrapper(async (req, res) => {
  const { trip_id } = req.params;
  const { data } = await getTripById(req.user.user_id, trip_id);
  response.success(res, data, "Trip fetched successfully");
});

// Update trip
const update = asyncWrapper(async (req, res) => {
  const { trip_id } = req.params;
  const {
    startDate,
    endDate,
    location,
    budget,
    totalCost,
    days,
    markers,
    imageUrl,
  } = req.body;

  const formattedDays = days?.map((d) => ({
    dayNumber: d.dayNumber,
    notes: d.notes,
    cost: d.cost,
  }));

  const formattedMarkers = markers?.map((m) => ({
    name: m.name,
    description: m.description || null,
    lat: parseFloat(m.lat),
    lon: parseFloat(m.lon),
    address: m.address || null,
  }));

  const { data } = await updateTrip(
    req.user.user_id,
    trip_id,
    {
      imageUrl: imageUrl || null,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      location,
      budget,
      totalCost,
      days: formattedDays,
      markers: formattedMarkers,
    },
    req.file?.buffer
  );

  response.success(res, data, "Trip updated successfully");
});

// Delete trip
const remove = asyncWrapper(async (req, res) => {
  const { trip_id } = req.params;
  const { data } = await deleteTrip(req.user.user_id, trip_id);
  response.success(res, data, "Trip deleted successfully");
});

// Get marker details
const getMarkerDetails = asyncWrapper(async (req, res) => {
  const { lat, lon } = req.query;

  if (!lat || !lon) {
    throw new CustomError(
      "missing_coordinates",
      400,
      "Latitude and longitude are required"
    );
  }

  const [safety_info, weather_info, air_quality_info] = await Promise.all([
    getSafetyInfo(lat, lon),
    getWeatherInfo(lat, lon),
    getAirQualityInfo(lat, lon),
  ]);

  response.success(
    res,
    { safety_info, weather_info, air_quality_info },
    "Marker details fetched successfully"
  );
});

export { create, list, getById, update, remove, getMarkerDetails };
