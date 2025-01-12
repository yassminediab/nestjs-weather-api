import { Injectable } from '@nestjs/common';
import { WeatherApiAdapter } from './weather-api.adapter';

@Injectable()
export class WeatherService {
  constructor(private readonly weatherApiAdapter: WeatherApiAdapter) {}

  async getWeather(city: string) {
    return this.weatherApiAdapter.fetchCurrentWeather(city);
  }

  async getForecast(city: string, days: number) {
    return this.weatherApiAdapter.fetchForecast(city, days);
  }
}
