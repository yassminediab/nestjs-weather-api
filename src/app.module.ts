import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WeatherModule } from './modules/weather/weather.module';
import { ConfigModule } from '@nestjs/config';
import { redisStore } from 'cache-manager-redis-yet';
import { AuthModule } from './modules/auth/auth-module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppDataSource } from './dataSource/data-source';
import { UserModule } from './modules/user/user.module';
import { LocationModule } from './modules/location/location.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { CacheModule } from '@nestjs/cache-manager';
import { CacheStore } from '@nestjs/common/cache';
import { LoggerModule } from './logging/logger.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60,
        limit: 10,
      },
    ]),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: true,
      autoSchemaFile: join(process.cwd(), 'src/graphql/schema.gql'), // Auto-generate schema
    }),
    TypeOrmModule.forRoot(AppDataSource.options),
    AuthModule,
    WeatherModule,
    UserModule,
    LocationModule,
    LoggerModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard, // use your custom guard here
    },
  ],
})
export class AppModule {}
