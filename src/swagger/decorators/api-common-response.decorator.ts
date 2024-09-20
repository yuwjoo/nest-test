import { applyDecorators, Type } from '@nestjs/common';
import { getSchemaPath, ApiExtraModels, ApiResponse } from '@nestjs/swagger';
import { ResponseDto } from 'src/response/dto/response.dto';
import { RESPONSE_CODE } from 'src/response/types/response.enum';

export interface Options {
  type?: Type<any>;
  isArray?: boolean;
  status?: RESPONSE_CODE;
  example?: any;
}

/**
 * @description: 基本响应结构
 */
export const ApiCommonResponse = (options: Options) => {
  if (options.type) {
    return applyDecorators(
      ApiExtraModels(options.type),
      ApiResponse({
        schema: {
          title: `CommonResponseOf${options.type.name}`,
          allOf: [
            { $ref: getSchemaPath(ResponseDto) },
            {
              properties: {
                data: {
                  type: options.isArray ? 'array' : undefined,
                  $ref: getSchemaPath(options.type),
                },
              },
            },
          ],
          example: options.example,
        },
        status: options.status || RESPONSE_CODE.OK,
      }),
    );
  } else {
    return applyDecorators(
      ApiResponse({
        type: ResponseDto,
        example: options.example,
        status: options.status || RESPONSE_CODE.OK,
      }),
    );
  }
};
