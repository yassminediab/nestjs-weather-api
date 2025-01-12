import { Field, ObjectType, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';

@ObjectType()
export class Location {
  @Field()
  @ApiProperty()
  id: number;

  @Field()
  @ApiProperty()
  city: string;
}

@InputType()
export class AddLocationInput {
  @Field()
  @ApiProperty()
  locationId: number;
}
