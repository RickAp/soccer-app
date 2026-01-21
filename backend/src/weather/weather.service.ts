import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

export interface WeatherData {
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  windDirection: number;
  description: string;
  icon: string;
  city: string;
  country: string;
  clouds: number;
  pressure: number;
  visibility: number;
}

export interface ForecastData extends WeatherData {
  datetime: string;
}

interface OpenWeatherResponse {
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    pressure: number;
  };
  wind: {
    speed: number;
    deg: number;
  };
  weather: {
    description: string;
    icon: string;
  }[];
  clouds: {
    all: number;
  };
  visibility: number;
  name: string;
  sys: {
    country: string;
  };
}

interface ForecastResponse {
  list: {
    dt_txt: string;
    main: {
      temp: number;
      feels_like: number;
      humidity: number;
      pressure: number;
    };
    wind: {
      speed: number;
      deg: number;
    };
    weather: {
      description: string;
      icon: string;
    }[];
    clouds: {
      all: number;
    };
    visibility: number;
  }[];
  city: {
    name: string;
    country: string;
  };
}

@Injectable()
export class WeatherService {
  private readonly logger = new Logger(WeatherService.name);
  private readonly baseUrl = 'https://api.openweathermap.org/data/2.5';
  private readonly apiKey: string;

  constructor(private config: ConfigService) {
    this.apiKey = this.config.get('OPENWEATHER_API_KEY') || '';
  }

  async getCurrentWeather(city: string): Promise<WeatherData | null> {
    try {
      const response = await axios.get<OpenWeatherResponse>(
        `${this.baseUrl}/weather`,
        {
          params: {
            q: city,
            appid: this.apiKey,
            units: 'metric',
            lang: 'es',
          },
        }
      );

      const data = response.data;
      return {
        temperature: Math.round(data.main.temp),
        feelsLike: Math.round(data.main.feels_like),
        humidity: data.main.humidity,
        windSpeed: Math.round(data.wind.speed * 3.6),
        windDirection: data.wind.deg,
        description: data.weather[0].description,
        icon: data.weather[0].icon,
        city: data.name,
        country: data.sys.country,
        clouds: data.clouds.all,
        pressure: data.main.pressure,
        visibility: data.visibility / 1000,
      };
    } catch (error) {
      this.logger.error(`Error fetching weather for ${city}: ${error}`);
      return null;
    }
  }

  async getForecast(city: string, matchDate: string): Promise<ForecastData | null> {
    try {
      const response = await axios.get<ForecastResponse>(
        `${this.baseUrl}/forecast`,
        {
          params: {
            q: city,
            appid: this.apiKey,
            units: 'metric',
            lang: 'es',
          },
        }
      );

      const targetDate = new Date(matchDate);
      const forecasts = response.data.list;
      
      let closest = forecasts[0];
      let minDiff = Math.abs(new Date(forecasts[0].dt_txt).getTime() - targetDate.getTime());

      for (const forecast of forecasts) {
        const diff = Math.abs(new Date(forecast.dt_txt).getTime() - targetDate.getTime());
        if (diff < minDiff) {
          minDiff = diff;
          closest = forecast;
        }
      }

      return {
        datetime: closest.dt_txt,
        temperature: Math.round(closest.main.temp),
        feelsLike: Math.round(closest.main.feels_like),
        humidity: closest.main.humidity,
        windSpeed: Math.round(closest.wind.speed * 3.6),
        windDirection: closest.wind.deg,
        description: closest.weather[0].description,
        icon: closest.weather[0].icon,
        city: response.data.city.name,
        country: response.data.city.country,
        clouds: closest.clouds.all,
        pressure: closest.main.pressure,
        visibility: closest.visibility / 1000,
      };
    } catch (error) {
      this.logger.error(`Error fetching forecast for ${city}: ${error}`);
      return null;
    }
  }
}

