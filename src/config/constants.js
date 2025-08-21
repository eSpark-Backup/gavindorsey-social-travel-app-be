export const CACHE_TTL = {
  WEATHER: 300, // 5 minutes
  AIR_QUALITY: 900, // 15 minutes
  SAFETY: 120, // 2 minutes
};

export const COORD_PRECISION = 3; // rounds lat/lng to ~110m for better cache hits

export const RATE_LIMITS = {
  MAPBOX: { maxConcurrent: 5, minTime: 200 }, // ~5 req/sec
  OPENWEATHER: { maxConcurrent: 5, minTime: 200 }, // ~5 req/sec
  TOMTOM: { maxConcurrent: 3, minTime: 300 }, // ~3 req/sec
};

export const HTTP_TIMEOUT = 3000; // 3 seconds
export const HTTP_RETRIES = 2; // number of retry attempts
