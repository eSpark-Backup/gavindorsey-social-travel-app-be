import axiosInstance, { limiters } from "../config/axios.js";
import { CustomError } from "../utils/custom_error.js";
import dotenv from "dotenv";
dotenv.config()

const OWM_BASE = "https://api.openweathermap.org/data/2.5/weather";
const OWM_KEY = process.env.OPENWEATHERMAP_API_KEY;

export const getWeatherInfo = async (lat, lon) => {
  if (!lat || !lon) {
    throw new CustomError(
      "missing_coordinates",
      400,
      "Latitude and longitude are required"
    );
  }

  return limiters.openweather.schedule(async () => {
    try {
      const { data } = await axiosInstance.get(OWM_BASE, {
        params: { lat, lon, appid: OWM_KEY, units: "metric" },
      });

      // One Call API: current weather data
      return {
        temperature: data.main?.temp ?? null,
        feels_like: data.main?.feels_like ?? null,
        weather: data.weather?.[0]?.description || "Unknown",
      };
    } catch (err) {
      // Use consistent axios error formatting
      throw CustomError.handleAxiosError(
        err,
        "Failed to fetch weather from OpenWeather"
      );
    }
  });
};
