import { registerDecorator, ValidationOptions } from 'class-validator';
import { IsUniqueConstraint } from '../isUniqueConstraint';

export function IsUnique(
  property: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [property],
      validator: IsUniqueConstraint,
    });
  };
}
