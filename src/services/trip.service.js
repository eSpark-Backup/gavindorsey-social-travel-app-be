import { prisma } from "../prisma.js";
import { CustomError } from "../utils/custom_error.js";
import { uploadImage, deleteImage } from "../services/cloudinary.service.js";
import { optimizeImage } from "../utils/imageOptimizer.js";

export const createTrip = async (userId, createdBy, data, fileBuffer) => {
  let imageUrl = null;
  let publicId = null;

  if (fileBuffer) {
    const optimizedBuffer = await optimizeImage(fileBuffer);
    const uploaded = await uploadImage(optimizedBuffer, "trips");
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
  if (!trip) throw new CustomError("Trip not found", 404);
  return { data: trip };
};

export const updateTrip = async (userId, tripId, data, fileBuffer) => {
  let imageUrl = data.imageUrl || null;
  let publicId = data.publicId || null;

  // If a new image is provided, handle image replacement
  if (fileBuffer) {
    const optimizedBuffer = await optimizeImage(fileBuffer);
    // Retrieve the current image's publicId from the database
    const currentTrip = await prisma.trip.findUnique({
      where: { id: tripId },
    });

    // If a current image exists, delete it before uploading the new one
    if (currentTrip?.publicId) {
      try {
        await deleteImage(currentTrip.publicId);
      } catch (error) {
        console.error("Error deleting old image:", error);
        // Optionally, you could decide whether to throw or continue with the new upload
      }
    }

    // Upload the new image and get the URL and public ID
    const uploaded = await uploadImage(optimizedBuffer, "trips");
    imageUrl = uploaded.url;
    publicId = uploaded.public_id;
  }

  const { days, ...tripData } = data;

  // Update the trip with the new image URL and public ID
  const updatedTripCount = await prisma.trip.updateMany({
    where: { id: tripId, userId },
    data: {
      ...tripData,
      imageUrl,
      publicId,
    },
  });

  if (!updatedTripCount.count) {
    throw new CustomError("Trip not found", 404);
  }

  // Update the days if provided
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

  // Fetch the updated trip
  const updatedTrip = await prisma.trip.findUnique({
    where: { id: tripId },
    include: { days: true },
  });

  return { data: updatedTrip };
};


export const deleteTrip = async (userId, tripId) => {
  const trip = await prisma.trip.findFirst({
    where: { id: tripId, userId },
  });

  if (!trip) {
    throw new CustomError("Trip not found", 404);
  }

  // Delete image from Cloudinary if publicId exists
  if (trip.publicId) {
    await deleteImage(trip.publicId);
  }

  // Delete the trip record
  const deleted = await prisma.trip.deleteMany({
    where: { id: tripId, userId },
  });

  if (!deleted.count) {
    throw new CustomError("Trip not found", 404);
  }

  return { data: "Trip deleted successfully" };
};

