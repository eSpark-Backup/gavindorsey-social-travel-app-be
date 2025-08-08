import {
  createTrip,
  getTrips,
  getTripById,
  updateTrip,
  deleteTrip,
} from "../services/trip.service.js";
import { asyncWrapper } from "../utils/async_wrapper.js";
import * as response from "../utils/response.js";

const create = asyncWrapper(async (req, res) => {
  const { start_date, end_date, location, budget, total_cost, days } = req.body;

  const trip = await createTrip(
    req.user.user_id,
    req.user.user_id,
    {
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
    },
    req.file?.buffer
  );

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
  const {
    start_date,
    end_date,
    location,
    budget,
    total_cost,
    days,
    old_public_id,
    image_url,
  } = req.body;

  const result = await updateTrip(
    req.user.user_id,
    trip_id,
    {
      imageUrl: image_url || null,
      startDate: start_date ? new Date(start_date) : undefined,
      endDate: end_date ? new Date(end_date) : undefined,
      location,
      budget,
      totalCost: total_cost,
      days: days?.map((d) => ({
        dayNumber: d.day_number,
        notes: d.notes,
        cost: d.cost,
      })),
    },
    req.file?.buffer,
    old_public_id
  );

  response.success(res, result.data, "Trip updated successfully");
});

const remove = asyncWrapper(async (req, res) => {
  const { trip_id } = req.params;
  const { public_id } = req.body;

  const result = await deleteTrip(req.user.user_id, trip_id, public_id);

  response.success(res, result.data, "Trip deleted successfully");
});

export { create, list, getById, update, remove };
