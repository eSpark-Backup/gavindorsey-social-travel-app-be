import {
  createTrip,
  getTrips,
  getTripById,
  updateTrip,
  deleteTrip,
} from "../services/trip.service.js";
import { asyncWrapper } from "../utils/async_wrapper.js";
import * as response from "../utils/response.js";
import { uploadImage, deleteImage } from "../services/cloudinary.service.js";
import { optimizeImage } from "../utils/imageOptimizer.js";

const create = asyncWrapper(async (req, res) => {
  let image_url = null;
  if (req.file) {
    const optimizedPath = await optimizeImage(req.file.path);
    const uploaded = await uploadImage(optimizedPath, "trips");
    image_url = uploaded.url;
  }

  const { start_date, end_date, location, budget, total_cost, days } = req.body;

  const trip = await createTrip(req.user.user_id, req.user.user_id, {
    imageUrl: image_url,
    startDate: new Date(start_date),
    endDate: new Date(end_date),
    location,
    budget,
    totalCost: total_cost,
    days: days?.map((d) => ({
      dayNumber: d.day_number,
      notes: d.notes,
      cost: d.cost,
    })),
  });

  response.success(res, trip.data, "Trip created successfully");
});

const list = asyncWrapper(async (req, res) => {
  const trips = await getTrips(req.user.user_id);
  response.success(res, trips.data, "Trips fetched successfully");
});

const getById = asyncWrapper(async (req, res) => {
  const { trip_id } = req.params;
  const trip = await getTripById(req.user.user_id, trip_id);
  response.success(res, trip.data, "Trip fetched successfully");
});

const update = asyncWrapper(async (req, res) => {
  const { trip_id } = req.params;
  let image_url = req.body.image_url || null;

  if (req.file) {
    if (req.body.old_public_id) {
      await deleteImage(req.body.old_public_id);
    }
    const optimizedPath = await optimizeImage(req.file.path);
    const uploaded = await uploadImage(optimizedPath, "trips");
    image_url = uploaded.url;
  }

  const { start_date, end_date, location, budget, total_cost, days } = req.body;

  const result = await updateTrip(req.user.user_id, trip_id, {
    imageUrl: image_url,
    startDate: new Date(start_date),
    endDate: new Date(end_date),
    location,
    budget,
    totalCost: total_cost,
    days: days?.map((d) => ({
      dayNumber: d.day_number,
      notes: d.notes,
      cost: d.cost,
    })),
  });

  response.success(res, result.data, "Trip updated successfully");
});

const remove = asyncWrapper(async (req, res) => {
  const { trip_id } = req.params;
  if (req.body.public_id) {
    await deleteImage(req.body.public_id);
  }
  const result = await deleteTrip(req.user.user_id, trip_id);
  response.success(res, result.data, "Trip deleted successfully");
});

export { create, list, getById, update, remove };
