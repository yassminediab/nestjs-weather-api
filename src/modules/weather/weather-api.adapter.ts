import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { HttpService } from '../../utilities/http/http.service';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';

@Injectable()
export class WeatherApiAdapter {
  constructor(
    private readonly httpService: HttpService,
    @Inject('Config')
    private readonly config: {
      apiBaseUrl: string;
      apiKey: string;
    },
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  private readonly logger = new Logger(WeatherApiAdapter.name);

  async fetchCurrentWeather(city: string): Promise<any> {
    try {
      const cacheKey: string = `weather_${city}`;
      const data: any = await this.cacheManager.get(cacheKey);
      if (data) {
        this.logger.debug(`Reading Data from Cache with city ${city}`);
        return JSON.parse(data);
      }
      const endpoint = `${this.config.apiBaseUrl}/current.json?key=${this.config.apiKey}&q=${city}`;
      this.logger.debug(`Init Weather API Call for City  ${city}`);
      const response = await this.httpService.get(endpoint);

      const ttl: number = 15 * 60 * 1000;
      await this.cacheManager.set(
        cacheKey,
        JSON.stringify(response?.data),
        ttl,
      );
      this.logger.debug(`Saving Data in Cache for city ${city}`);

      return response.data;
    } catch (error) {
      if (error.response) {
        const { status, data } = error.response;
        this.logger.error(
          `Error from third party with city ${city} and error ${data.error?.message}`,
        );
        throw new HttpException(
          {
            statusCode: status,
            message:
              data.error?.message || 'Error fetching current weather data.',
          },
          status,
        );
      }

      this.logger.error(
        `unexpected Error from third party with city ${city} and error ${error.message}`,
      );

      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message:
            'An unexpected error occurred while fetching current weather data.',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async fetchForecast(city: string, days: number): Promise<any> {
    try {
      const cacheKey: string = `forecast_${city}_${days}`;
      const data: any = await this.cacheManager.get(cacheKey);
      if (data) {
        this.logger.debug(
          `Reading data from cache with forecast for city ${city} and ${days} days`,
        );
        return JSON.parse(data);
      }

      this.logger.debug(
        `Reading data from third party with forecast for city ${city} and ${days} days`,
      );
      const endpoint = `${this.config.apiBaseUrl}/forecast.json?key=${this.config.apiKey}&q=${city}&days=${days}`;
      const response: AxiosResponse = await this.httpService.get(endpoint);

      this.logger.debug(
        `Saving data in cache with forecast for city ${city} and ${days} days`,
      );
      const ttl: number = 3 * 60 * 60 * 1000;
      await this.cacheManager.set(
        cacheKey,
        JSON.stringify(response?.data),
        ttl,
      );

      return response.data;
    } catch (error) {
      if (error.response) {
        const { status, data } = error.response;
        this.logger.error(
          `Error from third party forecast with city ${city} , ${days} days  and error ${data.error?.message}`,
        );
        throw new HttpException(
          {
            statusCode: status,
            message: data.error?.message || 'Error fetching forecast data.',
          },
          status,
        );
      }

      this.logger.error(
        `unexpected Error from third party forecast with city ${city} , ${days} days and error ${error.message}`,
      );
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'An unexpected error occurred while fetching forecast data.',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
