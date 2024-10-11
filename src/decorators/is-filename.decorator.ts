import { registerDecorator, ValidationOptions } from 'class-validator';
import { testFilename } from 'src/utils/common';

/**
 * @description: 是否合法文件名
 */
export function IsFilename(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isFilename',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any) {
          return testFilename(value);
        },
      },
    });
  };
}
