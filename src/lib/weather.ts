import { HourlyForecast, WeatherData } from '../types';
import { fetchWithCache } from './api';
import { config } from './lguConfig';

/**
 * Map OpenWeatherMap icon codes to Lucide icon names
 */
export const mapWeatherIconToLucide = (iconCode: string): string => {
  const iconMap: Record<string, string> = {
    '01d': 'Sun',
    '01n': 'Moon',
    '02d': 'CloudSun',
    '02n': 'CloudMoon',
    '03d': 'Cloud',
    '03n': 'Cloud',
    '04d': 'Cloud',
    '04n': 'Cloud',
    '09d': 'CloudDrizzle',
    '09n': 'CloudDrizzle',
    '10d': 'CloudRain',
    '10n': 'CloudRain',
    '11d': 'CloudLightning',
    '11n': 'CloudLightning',
    '13d': 'CloudSnow',
    '13n': 'CloudSnow',
    '50d': 'Cloud',
    '50n': 'Cloud',
  };
  return iconMap[iconCode] || 'Cloud';
};

interface RawHourlyEntry {
  dt: number;
  temp: number;
  icon: string;
}

interface RawCityWeather {
  name?: string;
  main?: {
    temp?: number;
    humidity?: number;
    pressure?: number;
  };
  weather?: Array<{
    description?: string;
    icon?: string;
  }>;
  wind?: {
    speed?: number;
  };
  visibility?: number;
  hourly?: RawHourlyEntry[];
}

/**
 * Fetch weather data for configured LGU and transform to frontend type
 */
export const fetchWeatherData = async (): Promise<WeatherData[]> => {
  if (config.location.weather && !config.location.weather.enabled) {
    return [];
  }

  // Normalize city name for API call (handle special characters)
  const cityName =
    config.location.weather?.defaultCity || config.lgu?.name || 'Liliw';
  const cityKey = (config.lgu?.name || 'liliw')
    .toLowerCase()
    .replace(/\s+/g, '_')
    .replace(/ñ/g, 'n');

  try {
    // Attempt fetching specific city
    let data: Record<string, RawCityWeather> | null = null;
    try {
      data = await fetchWithCache(
        `/api/weather?city=${encodeURIComponent(cityName)}`
      );
    } catch {
      // If primary fetch fails (e.g. backend down or 503), attempt update or fail gracefully
      data = null;
    }

    // If KV is empty or city missing, fallback to update
    if (!data || Object.keys(data).length === 0) {
      try {
        data = await fetchWithCache('/api/weather?update=true');
      } catch {
        data = null;
      }
    }

    if (!data) {
      return [];
    }

    const city =
      data[cityKey] ||
      data[cityName.toLowerCase()] ||
      data[(config.lgu?.name || '').toLowerCase()] ||
      data[Object.keys(data)[0]];

    if (!city) {
      // Fallback in case API completely failed
      console.warn(`No weather data returned for ${config.lgu.name}`);
      return [];
    }

    // Transform 3-hour forecast (first 4 entries)
    const hourly: HourlyForecast[] = (city.hourly || [])
      .slice(0, 4)
      .map((h: RawHourlyEntry) => ({
        hour: new Date(h.dt * 1000).toLocaleTimeString([], {
          hour: 'numeric',
          hour12: true,
        }),
        temperature: Math.round(h.temp),
        icon: mapWeatherIconToLucide(h.icon),
      }));

    const weatherData: WeatherData = {
      location: city.name || config.lgu.name,
      temperature: Math.round(city.main?.temp ?? 0),
      condition: city.weather?.[0]?.description ?? 'Unknown',
      humidity: city.main?.humidity ?? 0,
      windSpeed: city.wind?.speed ?? 0,
      icon: mapWeatherIconToLucide(city.weather?.[0]?.icon ?? '01d'),
      hourly,
      pressure: city.main?.pressure ?? 0,
      visibility: Math.round((city.visibility ?? 0) / 1000),
    };

    return [weatherData];
  } catch (err) {
    console.warn('Weather fetch encountered an error:', err);
    return [];
  }
};
