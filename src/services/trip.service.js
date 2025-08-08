import { prisma } from "../prisma.js";
import { CustomError } from "../utils/custom_error.js";

export const createTrip = async (userId, createdBy, data) => {
  const { days, ...tripData } = data;

  const trip = await prisma.trip.create({
    data: {
      userId,
      createdBy,
      ...tripData,
      days: days
        ? {
            create: days, // correctly wrap days array in `create`
          }
        : undefined,
    },
    include: { days: true },
  });
  return { data: trip };
};

export const getTrips = async (userId) => {
  const trips = await prisma.trip.findMany({
    where: { userId },
    include: { days: true },
    orderBy: { createdAt: "desc" },
  });
  return { data: trips };
};

export const getTripById = async (userId, tripId) => {
  const trip = await prisma.trip.findFirst({
    where: { id: tripId, userId },
    include: { days: true },
  });
  if (!trip) throw new CustomError(404, "Trip not found");
  return { data: trip };
};

export const updateTrip = async (userId, tripId, data) => {
  const trip = await prisma.trip.updateMany({
    where: { id: tripId, userId },
    data,
  });
  if (!trip.count) throw new CustomError(404, "Trip not found");
  return { data: "Trip updated successfully" };
};

export const deleteTrip = async (userId, tripId) => {
  const trip = await prisma.trip.deleteMany({
    where: { id: tripId, userId },
  });
  if (!trip.count) throw new CustomError(404, "Trip not found");
  return { data: "Trip deleted successfully" };
};
