import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { UserService } from '../modules/user/user.service';

@ValidatorConstraint({ async: true })
@Injectable()
export class IsUniqueConstraint implements ValidatorConstraintInterface {
  constructor(private readonly userService: UserService) {}

  async validate(value: any, args?: ValidationArguments): Promise<boolean> {
    const exists = await this.userService.findOneByUsername(value);
    console.log(exists);
    return exists ? false : true;
  }

  defaultMessage(args: ValidationArguments) {
    const [property] = args.constraints;
    console.log(232323);
    return `${property} already exists.`;
  }
}
