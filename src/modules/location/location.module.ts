import { Module } from '@nestjs/common';
import { LocationService } from './location.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocationResolver } from './location.resolver';
import { Location } from './entities/location.entity';
import { User } from '../auth/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Location, User])],
  providers: [LocationService, LocationResolver],
  exports: [LocationService],
})
export class LocationModule {}
