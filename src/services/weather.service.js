import axiosInstance, { limiters } from "../config/axios.js";
import { CustomError } from "../utils/custom_error.js";
import dotenv from "dotenv";
dotenv.config();

const OPENWEATHERMAP_BASE_URL =
  "https://api.openweathermap.org/data/3.0/onecall";
const OPENWEATHERMAP_CLIENT_API_KEY = process.env.OPENWEATHERMAP_CLIENT_API_KEY;

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
      const { data } = await axiosInstance.get(OPENWEATHERMAP_BASE_URL, {
        params: {
          lat,
          lon,
          appid: OPENWEATHERMAP_CLIENT_API_KEY,
          units: "metric",
        },
      });

      return {
        time: data.current?.dt ?? null,
        sunrise: data.current?.sunrise ?? null,
        sunset: data.current?.sunset ?? null,
        temperature: data.current?.temp ?? null,
        feelsLike: data.current?.feels_like ?? null,
        uvi: data.current?.uvi ?? null,
        humidity: data.current?.humidity ?? null,
        visibility: data.current?.visibility ?? null,
        clouds: data.current?.clouds ?? null,
        windSpeed: data.current?.wind_speed ?? null,
        windDegree: data.current?.wind_deg ?? null,
        windGust: data.current?.wind_gust ?? null,
        weather: data.current.weather?.[0] || "Unknown",
      };
    } catch (err) {
      throw CustomError.handleAxiosError(
        err,
        "Failed to fetch weather from OpenWeather"
      );
    }
  });
};
