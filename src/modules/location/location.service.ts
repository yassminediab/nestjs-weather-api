import {
  BadRequestException,
  Injectable, Logger,
  NotFoundException,
} from '@nestjs/common';
import { Location } from './entities/location.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../auth/entities/user.entity';

@Injectable()
export class LocationService {
  constructor(
    @InjectRepository(Location)
    private locationRepository: Repository<Location>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}
  private readonly logger = new Logger(LocationService.name);

  async addLocation(locationId: number, userId: number): Promise<Location> {
    const location = await this.locationRepository.findOne({
      where: { id: locationId },
      relations: ['users'],
    });

    if (!location) {
      this.logger.error(`location  ${locationId} not found for userId ${userId}`);
      throw new NotFoundException('Location not found');
    }

    if (location.users.some((user) => user.id === userId)) {
      this.logger.error(`Location ${locationId} is already added to the user  ${userId}`);
      throw new BadRequestException('Location is already added to the user');
    }

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      this.logger.error(`User ${userId}  not found`);
      throw new NotFoundException('User not found');
    }

    location.users.push(user);
    await this.locationRepository.save(location);
    this.logger.debug(`location added successfully`);

    return location;
  }

  async getLocations(userId: number): Promise<Location[]> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      this.logger.error(`User ${userId}  not found`);
      throw new NotFoundException('User not found');
    }

    return this.locationRepository
      .createQueryBuilder('location')
      .innerJoin('location.users', 'user', 'user.id = :userId', { userId })
      .getMany();
  }

  async removeLocation(locationId: number, userId: number): Promise<boolean> {
    const location = await this.locationRepository.findOne({
      where: { id: locationId },
      relations: ['users'],
    });

    if (!location) {
      this.logger.error(`Location ${locationId} not found`);
      throw new NotFoundException('Location not found');
    }

    location.users = location.users.filter((user) => user.id !== userId);

    await this.locationRepository.save(location);
    this.logger.debug(`Location  ${locationId} removed successfully`);

    return true;
  }
}
