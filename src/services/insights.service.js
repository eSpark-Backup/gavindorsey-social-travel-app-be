// src/services/insights.service.js
import axiosInstance from "../config/axios.js";
import { CustomError } from "../utils/custom_error.js";
import { WEATHER_API_BASE } from "../config/constants.js";

/**
 * Fetch zone details from weather.gov API
 * @param {string} zoneId
 * @returns {Promise<Object>}
 */
export const getZoneDetails = async (zoneId) => {
  try {
    const { data } = await axiosInstance.get(
      `${WEATHER_API_BASE}/zones/forecast/${zoneId}`
    );
    if (!data?.features?.length) {
      throw new CustomError(
        "zone_not_found",
        404,
        `No zone found for ID: ${zoneId}`
      );
    }

    const zone = data.features[0].properties;
    return {
      id: zone.id,
      name: zone.name,
      type: zone.type,
      state: zone.state,
    };
  } catch (err) {
    throw CustomError.handleAxiosError(err, "Failed to fetch zone details");
  }
};

/**
 * Fetch weather forecast for a given grid location
 * @param {string} gridId
 * @param {number} gridX
 * @param {number} gridY
 * @returns {Promise<Array>}
 */
export const getWeatherForecast = async (gridId, gridX, gridY) => {
  try {
    const { data } = await axiosInstance.get(
      `${WEATHER_API_BASE}/gridpoints/${gridId}/${gridX},${gridY}/forecast`
    );
    if (!data?.properties?.periods?.length) {
      throw new CustomError(
        "forecast_not_found",
        404,
        "No forecast data found"
      );
    }

    return data.properties.periods.map((period) => ({
      name: period.name,
      temperature: period.temperature,
      temperatureUnit: period.temperatureUnit,
      windSpeed: period.windSpeed,
      windDirection: period.windDirection,
      shortForecast: period.shortForecast,
      detailedForecast: period.detailedForecast,
    }));
  } catch (err) {
    throw CustomError.handleAxiosError(err, "Failed to fetch weather forecast");
  }
};

/**
 * Fetch zone alerts from weather.gov API
 * @param {string} zoneId
 * @returns {Promise<Array>}
 */
export const getZoneAlerts = async (zoneId) => {
  try {
    const { data } = await axiosInstance.get(
      `${WEATHER_API_BASE}/alerts/active/zone/${zoneId}`
    );
    return (
      data?.features?.map((alert) => ({
        id: alert.id,
        event: alert.properties.event,
        severity: alert.properties.severity,
        urgency: alert.properties.urgency,
        headline: alert.properties.headline,
        description: alert.properties.description,
        instruction: alert.properties.instruction,
        effective: alert.properties.effective,
        expires: alert.properties.expires,
      })) || []
    );
  } catch (err) {
    throw CustomError.handleAxiosError(err, "Failed to fetch zone alerts");
  }
};
