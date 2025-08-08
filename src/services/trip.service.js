import { prisma } from "../prisma.js";
import { CustomError } from "../utils/custom_error.js";
import { uploadImage, deleteImage } from "../services/cloudinary.service.js";

export const createTrip = async (userId, createdBy, data, fileBuffer) => {
  let imageUrl = null;
  let publicId = null;

  if (fileBuffer) {
    const uploaded = await uploadImage(fileBuffer, "trips");
    imageUrl = uploaded.url;
    publicId = uploaded.public_id;
  }

  const { days, ...tripData } = data;

  const trip = await prisma.trip.create({
    data: {
      userId,
      createdBy,
      ...tripData,
      imageUrl,
      publicId,
      days: days
        ? {
            create: days,
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

export const updateTrip = async (
  userId,
  tripId,
  data,
  fileBuffer,
  oldPublicId
) => {
  let imageUrl = data.imageUrl || null;
  let publicId = data.publicId || null;

  if (fileBuffer) {
    if (oldPublicId) {
      await deleteImage(oldPublicId);
    }
    const uploaded = await uploadImage(fileBuffer, "trips");
    imageUrl = uploaded.url;
    publicId = uploaded.public_id;
  }

  const { days, ...tripData } = data;

  const updatedTripCount = await prisma.trip.updateMany({
    where: { id: tripId, userId },
    data: {
      ...tripData,
      imageUrl,
      publicId,
    },
  });

  if (!updatedTripCount.count) {
    throw new CustomError(404, "Trip not found");
  }

  if (days) {
    await prisma.day.deleteMany({ where: { tripId } });
    await prisma.day.createMany({
      data: days.map((d) => ({
        tripId,
        dayNumber: d.dayNumber,
        notes: d.notes,
        cost: d.cost,
      })),
    });
  }

  const updatedTrip = await prisma.trip.findUnique({
    where: { id: tripId },
    include: { days: true },
  });

  return { data: updatedTrip };
};

export const deleteTrip = async (userId, tripId, publicId) => {
  if (publicId) {
    await deleteImage(publicId);
  }

  const trip = await prisma.trip.deleteMany({
    where: { id: tripId, userId },
  });
  if (!trip.count) throw new CustomError(404, "Trip not found");
  return { data: "Trip deleted successfully" };
};
