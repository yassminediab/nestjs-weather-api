import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Query,
  UseFilters,
  UseGuards, UseInterceptors,
} from '@nestjs/common';
import { WeatherService } from './weather.service';
import { GlobalExceptionFilter } from '../../filters/global-exception.filter';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { TransformInterceptor } from '../../interceptors/transform.interceptor';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';

@UseGuards(ThrottlerGuard)
@Controller('weather')
@UseFilters(GlobalExceptionFilter)
@UseInterceptors(TransformInterceptor)
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @Throttle({ default: { limit: 100, ttl: 60000 } })
  @Get(':city')
  @ApiOkResponse({
    description: 'Get Current Weather.',
    type: Response,
  })
  @ApiOperation({
    summary: 'Get Current Weather',
    description: 'Get Current Weather',
    operationId: 'Get Current Weather',
  })
  async getCurrentWeather(@Param('city') city: string) {
    if (!city) {
      throw new HttpException('City name is required', HttpStatus.BAD_REQUEST);
    }
    try {
      return this.weatherService.getWeather(city);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Failed to retrieve current weather data.',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Throttle({ default: { limit: 100, ttl: 60000 } })
  @Get('forecast/:city')
  @ApiOkResponse({
    description: 'Get Forecast .',
    type: Response,
  })
  @ApiOperation({
    summary: 'Get Forecast ',
    description: 'Get Forecast ',
    operationId: 'Get Forecast ',
  })
  async getForecast(@Param('city') city: string, @Query('days') days?: string) {
    if (!city) {
      throw new HttpException('City name is required', HttpStatus.BAD_REQUEST);
    }

    const forecastDays = parseInt(days, 10) || 5;

    try {
      return this.weatherService.getForecast(city, forecastDays);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Failed to retrieve forecast data.',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
