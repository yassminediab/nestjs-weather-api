import { MaxLength, IsString, MinLength } from 'class-validator';
import { IsUnique } from '../../../validator/dicorator/isUnique';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @IsString()
  @ApiProperty()
  @MinLength(4, { message: 'Username must be at least 4 characters long' })
  @MaxLength(20, { message: 'Username must not exceed 20 characters' })
  //@IsUnique('username', { message: 'Username is already taken' })
  username: string;

  @IsString()
  @ApiProperty()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  @MaxLength(50, { message: 'Password must not exceed 50 characters' })
  password: string;
}
