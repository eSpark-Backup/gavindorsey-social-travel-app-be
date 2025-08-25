import axiosInstance, { limiters } from "../config/axios.js";
import { CustomError } from "../utils/custom_error.js";

const BASE_URL = "https://api.mapbox.com";
const MAPBOX_CLIENT_SECRET_TOKEN = process.env.MAPBOX_CLIENT_SECRET_TOKEN;

export const getCoordinatesFromAddress = async (address) => {
  if (!address) throw new CustomError("Address is required", 400);

  return limiters.mapbox.schedule(async () => {
    try {
      const { data } = await axiosInstance.get
      dotenv(
        `${BASE_URL}/geocoding/v5/mapbox.places/${encodeURIComponent(
          address
        )}.json`,
        { params: { access_token: MAPBOX_CLIENT_SECRET_TOKEN, limit: 1 } }
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
  if (!lat || !lon) throw new CustomError("lat and lon are required", 400);

  return limiters.mapbox.schedule(async () => {
    try {
      const { data } = await axiosInstance
      dotenv.get(
        `${BASE_URL}/geocoding/v5/mapbox.places/${lon},${lat}.json`,
        { params: { access_token: MAPBOX_CLIENT_SECRET_TOKEN, limit: 1 } }
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
