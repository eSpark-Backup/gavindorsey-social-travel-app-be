import { prisma } from "../prisma.js";
import { CustomError } from "../utils/custom_error.js";
import { uploadImage, deleteImage } from "./cloudinary.service.js";
import { optimizeImage } from "../utils/imageOptimizer.js";
import { buildQueryOptions } from "../utils/queryHelper.js";
import { getSafetyInfo } from "./safety.service.js";
import { getWeatherInfo } from "./weather.service.js";
import { getAirQualityInfo } from "./airquality.service.js";

const VALID_SORT_FIELDS = [
  "createdAt",
  "startDate",
  "endDate",
  "location",
  "budget",
  "totalCost",
];

const sanitizeSortBy = (sort_by) =>
  VALID_SORT_FIELDS.includes(sort_by) ? sort_by : "createdAt";

const sanitizeSortOrder = (sort_order) =>
  sort_order === "asc" || sort_order === "desc" ? sort_order : "desc";

const sanitizePage = (page) => {
  const p = Number(page);
  return isNaN(p) || p < 1 ? 1 : p;
};

const sanitizeLimit = (limit) => {
  const l = Number(limit);
  if (isNaN(l) || l < 1) return 10;
  if (l > 100) return 100;
  return l;
};

const enrichLocationData = async (lat, lon) => {
  const [safety, weather, airQuality] = await Promise.all([
    getSafetyInfo(lat, lon),
    getWeatherInfo(lat, lon),
    getAirQualityInfo(lat, lon),
  ]);

  return {
    safetyJson: safety || {},
    weatherJson: weather || {},
    airJson: airQuality || {},
  };
};

export const createTrip = async (userId, createdBy, data, file_buffer) => {
  let imageUrl = null;
  let publicId = null;

  if (file_buffer) {
    const optimizedBuffer = await optimizeImage(file_buffer);
    const uploaded = await uploadImage(optimizedBuffer, "trips");
    imageUrl = uploaded.url;
    publicId = uploaded.public_id;
  }

  const { days, markers, ...trip_data } = data;

  const enrichedMarkers = markers?.length
    ? await Promise.all(
        markers.map(async (m) => ({
          name: m.name,
          lat: m.lat,
          lon: m.lon,
          ...(await enrichLocationData(m.lat, m.lon)),
        }))
      )
    : [];

  const trip = await prisma.trip.create({
    data: {
      user: { connect: { id: userId } },
      createdBy: createdBy,
      ...trip_data,
      imageUrl,
      publicId,
      days: days?.length
        ? {
            create: days.map((d) => ({
              dayNumber: d.dayNumber ?? null,
              notes: d.notes,
              cost: d.cost,
            })),
          }
        : undefined,
      markers: enrichedMarkers.length ? { create: enrichedMarkers } : undefined,
    },
    include: { days: true, markers: true },
  });

  return { data: trip };
};

export const getTrips = async (userId, query) => {
  const page = sanitizePage(query.page);
  const limit = sanitizeLimit(query.limit);
  const sort_by = sanitizeSortBy(query.sort_by);
  const sort_order = sanitizeSortOrder(query.sort_order);
  const search = (query.search || "").trim();

  const options = buildQueryOptions(
    { page, limit, sort_by, sort_order, search },
    ["location"]
  );

  const trips = await prisma.trip.findMany({
    where: { userId: userId, ...options.where },
    skip: options.skip,
    take: options.take,
    orderBy: options.orderBy,
    include: { days: true, markers: true },
  });

  const total = await prisma.trip.count({
    where: { userId: userId, ...options.where },
  });

  return {
    data: trips,
    pagination: {
      totalItems: total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      itemsPerPage: limit,
    },
  };
};

export const getTripById = async (userId, tripId) => {
  const trip = await prisma.trip.findFirst({
    where: { id: tripId, userId: userId },
    include: { days: true, markers: true },
  });

  if (!trip) throw new CustomError("Trip not found", 404);
  return { data: trip };
};

export const updateTrip = async (userId, tripId, data, file_buffer) => {
  let imageUrl = data.imageUrl ?? data.imageUrl ?? null;
  let publicId = data.publicId ?? data.publicId ?? null;

  if (file_buffer) {
    const optimizedBuffer = await optimizeImage(file_buffer);
    const currentTrip = await prisma.trip.findUnique({
      where: { id: tripId },
    });

    if (currentTrip?.publicId) {
      try {
        await deleteImage(currentTrip.publicId);
      } catch (err) {
        console.error("Error deleting old image:", err);
      }
    }

    const uploaded = await uploadImage(optimizedBuffer, "trips");
    imageUrl = uploaded.url;
    publicId = uploaded.publicId;
  }

  const { days, markers, ...trip_data } = data;

  const updated_count = await prisma.trip.updateMany({
    where: { id: tripId, userId: userId },
    data: {
      ...trip_data,
      imageUrl,
      publicId,
    },
  });

  if (!updated_count.count) throw new CustomError("Trip not found", 404);

  if (days) {
    await prisma.day.deleteMany({ where: { tripId: tripId } });
    await prisma.day.createMany({
      data: days.map((d) => ({
        tripId: tripId,
        dayNumber: d.dayNumber ?? d.day_number,
        notes: d.notes,
        cost: d.cost,
      })),
    });
  }

  if (markers) {
    await prisma.marker.deleteMany({ where: { tripId: tripId } });
    const enrichedMarkers = await Promise.all(
      markers.map(async (m) => ({
        name: m.name,
        lat: m.lat,
        lon: m.lon,
        address: m.address || null,
        ...(await enrichLocationData(m.lat, m.lon)),
      }))
    );
    await prisma.marker.createMany({
      data: enrichedMarkers.map((m) => ({ ...m, tripId: tripId })),
    });
  }

  const updated_trip = await prisma.trip.findUnique({
    where: { id: tripId },
    include: { days: true, markers: true },
  });

  return { data: updated_trip };
};

export const deleteTrip = async (userId, tripId) => {
  const trip = await prisma.trip.findFirst({
    where: { id: tripId, userId: userId },
  });

  if (!trip) throw new CustomError("Trip not found", 404);

  if (trip.publicId) {
    await deleteImage(trip.publicId);
  }

  const deleted = await prisma.trip.deleteMany({
    where: { id: tripId, userId: userId },
  });

  if (!deleted.count) throw new CustomError("Trip not found", 404);

  return { data: "Trip deleted successfully" };
};
