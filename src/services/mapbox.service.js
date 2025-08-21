import axiosInstance, { limiters } from "../config/axios.js";
import { CustomError } from "../utils/custom_error.js";

const MAPBOX_BASE = "https://api.mapbox.com";
const MAPBOX_KEY = process.env.MAPBOX_API_KEY;

export const getCoordinatesFromAddress = async (address) => {
  if (!address) throw new CustomError("Address is required", 400);

  return limiters.mapbox.schedule(async () => {
    try {
      const { data } = await axiosInstance.get(
        `${MAPBOX_BASE}/geocoding/v5/mapbox.places/${encodeURIComponent(
          address
        )}.json`,
        { params: { access_token: MAPBOX_KEY, limit: 1 } }
      );

      if (!data?.features?.length) {
        throw new CustomError("Location not found", 404);
      }

      const [lng, lat] = data.features[0].center;
      const name = data.features[0].place_name || null;

      return { lat: lat, lon: lng, name };
    } catch (err) {
      throw new CustomError(
        "Failed to fetch coordinates from Mapbox",
        502,
        err
      );
    }
  });
};

/**
 * Reverse geocoding: coordinates -> place name
 */
export const getAddressFromCoordinates = async (lat, lon) => {
  if (!lat || !lon)
    throw new CustomError("lat and lon are required", 400);

  return limiters.mapbox.schedule(async () => {
    try {
      const { data } = await axiosInstance.get(
        `${MAPBOX_BASE}/geocoding/v5/mapbox.places/${lon},${lat}.json`,
        { params: { access_token: MAPBOX_KEY, limit: 1 } }
      );

      if (!data?.features?.length) {
        throw new CustomError("Address not found", 404);
      }

      return { name: data.features[0].place_name };
    } catch (err) {
      throw new CustomError("Failed to fetch address from Mapbox", 502, err);
    }
  });
};
