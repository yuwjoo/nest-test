import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { PageDataDto } from 'src/response/dto/page-data.dto';
import { ResponseDto } from 'src/response/dto/response.dto';

export interface Options {
  type: Type<any>;
  example?: any;
}

/**
 * @description: 分页响应结构
 */
export const ApiPaginatedResponse = (options: Options) => {
  return applyDecorators(
    ApiExtraModels(options.type),
    ApiOkResponse({
      schema: {
        title: `PaginatedResponseOf${options.type.name}`,
        allOf: [
          { $ref: getSchemaPath(ResponseDto) },
          {
            properties: {
              data: {
                allOf: [
                  { $ref: getSchemaPath(PageDataDto) },
                  {
                    properties: {
                      records: {
                        type: 'array',
                        items: { $ref: getSchemaPath(options.type) },
                      },
                    },
                  },
                ],
              },
            },
          },
        ],
        example: options.example,
      },
    }),
  );
};
