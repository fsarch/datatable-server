export type TDataTable = {
  id: string;
  name: string;
  data_source: {
    type: 'fetch',
    url: string;
    auth: {
      type: 'basic';
      username: string;
      password: string;
    };
  };
  update_target: {
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

export type TDataTableBaseMappingType = {
  name: string;
  selector: string;
  required: boolean;
  isIdentifier: boolean;
};

export type TDataTableUuidMapping = TDataTableBaseMappingType & {
  type: 'uuid';
};

export type TDataTableConstantDataSourceValue = {
  value: string | number;
  label: string;
};

export type TDataTableConstantDataSource = {
  type: 'constant',
  values: Array<TDataTableConstantDataSourceValue>;
};

export type TDataTableSelectMapping = TDataTableBaseMappingType & {
  type: 'select';
  data_source: TDataTableConstantDataSource;
};

export type TDataTableIntegerMapping = TDataTableBaseMappingType & {
  type: 'integer';
};

export type TDataTableDateTimeMapping = TDataTableBaseMappingType & {
  type: 'date-time';
};

export type TDataTableStringMapping = TDataTableBaseMappingType & {
  type: 'string';
};

export type TDataTableDecimalInput = {
  type: 'input';
};

export type TDataTablePercentageColoredStep = {
  color: string;
  value?: number;
};

export type TDataTablePercentageColored = {
  type: 'percentage-colored',
  maxValue: number;
  steps: Array<TDataTablePercentageColoredStep>;
};

export type TDataTableDecimalMapping = TDataTableBaseMappingType & {
  type: 'decimal';
  display?: TDataTableDecimalInput | TDataTablePercentageColored;
};

export type TDataTableMapping = TDataTableUuidMapping
  | TDataTableSelectMapping
  | TDataTableIntegerMapping
  | TDataTableDateTimeMapping
  | TDataTableStringMapping
  | TDataTableDecimalMapping;
