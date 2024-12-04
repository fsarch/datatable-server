import { Injectable } from '@nestjs/common';
import { TDataTable } from "../../models/dbo/datatable.type.js";
import { ConfigService } from "@nestjs/config";
import Joi from "joi";

const BASE_MAPPING_SCHEMA = {
  name: Joi.string().required(),
  selector: Joi.string().required(),
  isIdentifier: Joi.boolean(),
};

export const DATATABLES_CONFIG_VALIDATOR = Joi.array().items(Joi.object({
  id: Joi.string().required(),
  name: Joi.string().required(),
  data_source: Joi.object({
    type: Joi.string().valid('fetch').required(),
    url: Joi.string().required(),
    auth: Joi.object({
      type: Joi.string().valid('basic').required(),
      username: Joi.string().required(),
      password: Joi.string().required(),
    }).required(),
  }).required(),
  update_target: Joi.object({
    type: Joi.string().valid('fetch').required(),
    url: Joi.string().required(),
    auth: Joi.object({
      type: Joi.string().valid('basic').required(),
      username: Joi.string().required(),
      password: Joi.string().required(),
    }).required(),
  }).required(),
  mapping: Joi.array().items(
    Joi.alternatives([
      Joi.object({
        ...BASE_MAPPING_SCHEMA,
        type: Joi.string().valid('uuid').required(),
      }).required(),
      Joi.object({
        ...BASE_MAPPING_SCHEMA,
        type: Joi.string().valid('select').required(),
        data_source: Joi.object({
          type: Joi.string().valid('constant').required(),
          values: Joi.array().items(Joi.object({
            value: Joi.alternatives([
              Joi.string().required(),
              Joi.number().required(),
            ]).required(),
            label: Joi.string().required(),
          })).required(),
        }).required(),
      }).required(),
      Joi.object({
        ...BASE_MAPPING_SCHEMA,
        type: Joi.string().valid('string').required(),
      }).required(),
      Joi.object({
        ...BASE_MAPPING_SCHEMA,
        type: Joi.string().valid('integer').required(),
      }).required(),
      Joi.object({
        ...BASE_MAPPING_SCHEMA,
        type: Joi.string().valid('date-time').required(),
      }).required(),
      Joi.object({
        ...BASE_MAPPING_SCHEMA,
        type: Joi.string().valid('decimal').required(),
        display: Joi.alternatives([
          Joi.object({
            type: Joi.string().valid('input').required(),
          }),
          Joi.object({
            type: Joi.string().valid('percentage-colored').required(),
            maxValue: Joi.number().required(),
            steps: Joi.array()
              .ordered(Joi.object({
                color: Joi.string().required(),
                value: Joi.number(),
              }))
              .items(Joi.object({
                color: Joi.string().required(),
                value: Joi.number().required(),
              })).required(),
          }),
        ]),
      }).required(),
    ]),
  ),
}));

@Injectable()
export class DatatablesRepositoryService {
  private readonly datatablesConfig: Array<{
    value: TDataTable,
    meta: {
      identifier: Array<string>;
    };
  }>;

  constructor(
    private readonly configService: ConfigService,
  ) {
    const datatablesConfig = this.configService.get<Array<TDataTable>>('datatables');
    const validationResult = DATATABLES_CONFIG_VALIDATOR.validate(datatablesConfig);

    if (validationResult.error) {
      console.error(validationResult.error);
      throw new Error('validation error');
    }

    this.datatablesConfig = datatablesConfig.map((datatable) => ({
      value: datatable,
      meta: {
        identifier: datatable.mapping
          .filter((m) => m.isIdentifier)
          .map((m) => m.selector)
      },
    }));
  }

  public async List() {
    return this.datatablesConfig.map((datatable) => datatable.value);
  }

  public async Get(id: string) {
    return (await this.List()).find(d => d.id === id);
  }
}
