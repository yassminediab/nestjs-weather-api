import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { AddLocationInput, Location } from './dto/location';
import { LocationService } from './location.service';
import { UseFilters, UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { GqlAllExceptionsFilter } from '../../filters/graphql-exception.filter';

@Resolver(() => Location)
@UseFilters(GqlAllExceptionsFilter)
export class LocationResolver {
  constructor(private readonly locationService: LocationService) {}

  @UseGuards(GqlAuthGuard)
  @Query(() => [Location], { name: 'getLocations' })
  getLocations(@CurrentUser() user: any): Promise<Location[]> {
    return this.locationService.getLocations(user?.userId);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Location, { name: 'addLocation' })
  addLocation(
    @Args('input') input: AddLocationInput,
    @CurrentUser() user: any,
  ): Promise<Location> {
    return this.locationService.addLocation(input?.locationId, user?.userId);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Boolean, { name: 'removeLocation' })
  removeLocation(
    @Args('id') id: number,
    @CurrentUser() user: any,
  ): Promise<boolean> {
    return this.locationService.removeLocation(id, user?.userId);
  }
}
