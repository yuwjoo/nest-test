import { applyDecorators, Type } from '@nestjs/common';
import { ApiOkResponse, getSchemaPath, ApiExtraModels } from '@nestjs/swagger';
import { ResponseDto } from 'src/response/dto/response.dto';

export interface Options {
  type: Type<any>;
  example?: any;
}

/**
 * @description: 基本响应结构
 */
export const ApiCommonResponse = (options: Options) => {
  return applyDecorators(
    ApiExtraModels(options.type),
    ApiOkResponse({
      schema: {
        title: `CommonResponseOf${options.type.name}`,
        allOf: [
          { $ref: getSchemaPath(ResponseDto) },
          {
            properties: {
              data: { $ref: getSchemaPath(options.type) },
            },
          },
        ],
        example: options.example,
      },
    }),
  );
};
