import axios from "axios";
import { CustomError } from "../utils/custom_error.js";

const OPENWEATHERMAP_CLIENT_API_KEY = process.env.OPENWEATHERMAP_CLIENT_API_KEY;
const BASE_URL = "https://api.openweathermap.org/data/2.5/air_pollution";

export const getAirQualityInfo = async (lat, lon) => {
  if (!lat || !lon) {
    throw new CustomError("Latitude and longitude are required", 400);
  }

  try {
    const { data } = await axios.get(BASE_URL, {
      params: {
        lat,
        lon,
        appid: OPENWEATHERMAP_CLIENT_API_KEY,
      },
    });

    return {
      success: true,
      data,
    };
  } catch (err) {
    console.error(
      "Error fetching air quality data:",
      err.response?.data || err.message
    );
    throw new CustomError("Failed to fetch air quality data", 500);
  }
};
