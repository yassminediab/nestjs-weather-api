import { Module } from '@nestjs/common';
import { WeatherService } from './weather.service';
import { WeatherController } from './weather.controller';
import { WeatherApiAdapter } from './weather-api.adapter';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HttpService } from '../../utilities/http/http.service';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';
import { CacheStore } from '@nestjs/common/cache';

@Module({
  imports: [
    ConfigModule,
    CacheModule.registerAsync({
      inject: [ConfigService], // Inject ConfigService
      useFactory: async (configService: ConfigService) => {
        const store = await redisStore({
          socket: {
            host: configService.get<string>('REDIS_HOST', 'localhost'),
            port: configService.get<number>('REDIS_PORT', 6379),
          },
        });

        return {
          store: store as unknown as CacheStore,
        };
      },
    }),
  ],
  controllers: [WeatherController],
  providers: [
    WeatherService,
    WeatherApiAdapter,

    HttpService,
    {
      provide: 'Config',
      useFactory: (configService: ConfigService) => {
        return {
          apiBaseUrl: configService.get('WEATHER_API_BASE_URL'),
          apiKey: configService.get('WEATHER_API_KEY'),
        };
      },
      inject: [ConfigService],
    },
  ],
})
export class WeatherModule {}
