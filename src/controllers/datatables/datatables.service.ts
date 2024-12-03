import { Injectable } from '@nestjs/common';
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
  base_query: Joi.object({
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

type TDataTable = {
  id: string;
  name: string;
  base_query: {
    type: 'fetch',
    url: string;
    auth: {
      type: 'basic';
      username: string;
      password: string;
    };
  };
  mapping: Array<TDataTableMapping>;
};

type TDataTableBaseType = {
  name: string;
  selector: string;
  required: boolean;
  isIdentifier: boolean;
};

type TDataTableUuidMapping = TDataTableBaseType & {
  type: 'uuid';
};

type TDataTableSelectMapping = TDataTableBaseType & {
  type: 'select';
  data_source: {
    type: 'constant',
    values: Array<{
      value: string | number;
      label: string;
    }>;
  }
};

type TDataTableIntegerMapping = TDataTableBaseType & {
  type: 'integer';
};

type TDataTableDateTimeMapping = TDataTableBaseType & {
  type: 'date-time';
};

type TDataTableStringMapping = TDataTableBaseType & {
  type: 'string';
};

type TDataTableDecimalMapping = TDataTableBaseType & {
  type: 'decimal';
  display?: {
    type: 'percentage-colored',
    maxValue: number;
    steps: [{
      color: string;
      value?: number;
    }];
  }
};

type TDataTableMapping = TDataTableUuidMapping
  | TDataTableSelectMapping
  | TDataTableIntegerMapping
  | TDataTableDateTimeMapping
  | TDataTableStringMapping
  | TDataTableDecimalMapping;

@Injectable()
export class DatatablesService {
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
}
