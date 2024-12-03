import { ApiProperty, getSchemaPath } from "@nestjs/swagger";
import { Optional } from "@nestjs/common";
import {
  TDataTable,
  TDataTableBaseMappingType, TDataTableConstantDataSource, TDataTableConstantDataSourceValue,
  TDataTableDateTimeMapping,
  TDataTableDecimalInput,
  TDataTableDecimalMapping,
  TDataTableIntegerMapping,
  TDataTableMapping,
  TDataTablePercentageColored,
  TDataTablePercentageColoredStep, TDataTableSelectMapping,
  TDataTableStringMapping,
  TDataTableUuidMapping
} from "../dbo/datatable.type.js";

export class DataTableAuthDto {
  @ApiProperty()
  public type: 'basic';

  @ApiProperty()
  public username: string;

  @ApiProperty()
  public password: string;
}

export class DataTableFetchBaseQueryDto {
  @ApiProperty()
  public type: 'fetch';

  @ApiProperty()
  public url: string;

  @ApiProperty()
  public auth: DataTableAuthDto;
}

export class DataTableConstantValueDataSourceDto {
  public static FromDbo(dbo: TDataTableConstantDataSourceValue) {
    const dto = new DataTableConstantValueDataSourceDto();

    dto.value = dbo.value;
    dto.label = dbo.label;

    return dto;
  }

  @ApiProperty()
  public value: string | number;

  @ApiProperty()
  public label: string;
}

export class DataTableConstantDataSourceDto {
  public static FromDbo(dbo: TDataTableConstantDataSource) {
    const dto = new DataTableConstantDataSourceDto();

    dto.type = dbo.type;
    dto.values = dbo.values.map(DataTableConstantValueDataSourceDto.FromDbo);

    return dto;
  }

  @ApiProperty()
  public type: 'constant';

  @ApiProperty({
    isArray: true,
    type: DataTableConstantValueDataSourceDto,
  })
  public values: Array<DataTableConstantValueDataSourceDto>;
}

export class DataTableBaseMappingDto {
  public static applyProperties<T extends DataTableBaseMappingDto>(dto: T, dbo: TDataTableBaseMappingType): T {
    dto.isIdentifier = dbo.isIdentifier;
    dto.name = dbo.name;
    dto.selector = dbo.selector;

    return dto;
  }

  @ApiProperty()
  public name: string;

  @ApiProperty()
  public selector: string;

  @ApiProperty()
  public isIdentifier: boolean;
}

export class DataTableUuidMappingDto extends DataTableBaseMappingDto {
  public static FromDbo(dbo: TDataTableUuidMapping) {
    const dto = new DataTableUuidMappingDto();

    dto.type = dbo.type;

    return DataTableBaseMappingDto.applyProperties(dto, dbo);
  }

  @ApiProperty()
  public type: 'uuid';
}

export class DataTableSelectMappingDto extends DataTableBaseMappingDto {
  public static FromDbo(dbo: TDataTableSelectMapping) {
    const dto = new DataTableSelectMappingDto();

    dto.type = dbo.type;
    dto.dataSource = DataTableConstantDataSourceDto.FromDbo(dbo.data_source);

    return DataTableBaseMappingDto.applyProperties(dto, dbo);
  }

  @ApiProperty()
  public type: 'select';

  @ApiProperty()
  public dataSource: DataTableConstantDataSourceDto;
}

export class DataTableStringMappingDto extends DataTableBaseMappingDto {
  public static FromDbo(dbo: TDataTableStringMapping) {
    const dto = new DataTableStringMappingDto();

    dto.type = dbo.type;

    return DataTableBaseMappingDto.applyProperties(dto, dbo);
  }

  @ApiProperty()
  public type: 'string';
}

export class DataTableIntegerMappingDto extends DataTableBaseMappingDto {
  public static FromDbo(dbo: TDataTableIntegerMapping) {
    const dto = new DataTableIntegerMappingDto();

    dto.type = dbo.type;

    return DataTableBaseMappingDto.applyProperties(dto, dbo);
  }

  @ApiProperty()
  public type: 'integer';
}

export class DataTableDateTimeMappingDto extends DataTableBaseMappingDto {
  public static FromDbo(dbo: TDataTableDateTimeMapping) {
    const dto = new DataTableDateTimeMappingDto();

    dto.type = dbo.type;

    return DataTableBaseMappingDto.applyProperties(dto, dbo);
  }

  @ApiProperty()
  public type: 'date-time';
}

export class DataTableDecimalInputDto {
  public static FromDbo(dbo: TDataTableDecimalInput) {
    const dto = new DataTableDecimalInputDto();

    dto.type = dbo.type;

    return dto;
  }

  @ApiProperty()
  public type: 'input';
}

export class DataTableDecimalPercentageColoredStepDto {
  public static FromDbo(dbo: TDataTablePercentageColoredStep) {
    const dto = new DataTableDecimalPercentageColoredStepDto();

    dto.color = dbo.color;
    dto.value = dbo.value;

    return dto;
  }

  @ApiProperty()
  public color: string;

  @ApiProperty()
  public value: number;
}

export class DataTableDecimalPercentageColoredDto {
  public static FromDbo(dbo: TDataTablePercentageColored) {
    const dto = new DataTableDecimalPercentageColoredDto();

    dto.type = dbo.type;
    dto.maxValue = dbo.maxValue;
    dto.steps = dbo.steps.map(DataTableDecimalPercentageColoredStepDto.FromDbo);

    return dto;
  }

  @ApiProperty()
  public type: 'percentage-colored';

  @ApiProperty()
  public maxValue: number;

  @ApiProperty({
    isArray: true,
  })
  public steps: Array<DataTableDecimalPercentageColoredStepDto>;
}

export class DataTableDecimalMappingDto extends DataTableBaseMappingDto {
  public static FromDbo(dbo: TDataTableDecimalMapping) {
    const dto = new DataTableDecimalMappingDto();

    dto.type = dbo.type;
    if (dto.display) {
      if (dto.display.type === 'input') {
        dto.display = DataTableDecimalInputDto.FromDbo(dbo.display as TDataTableDecimalInput);
      } else if (dto.display.type === 'percentage-colored') {
        dto.display = DataTableDecimalPercentageColoredDto.FromDbo(dbo.display as TDataTablePercentageColored);
      }
    }

    return DataTableBaseMappingDto.applyProperties(dto, dbo);
  }

  @ApiProperty()
  public type: 'decimal';

  @ApiProperty({
    oneOf: [
      { $ref: getSchemaPath(DataTableDecimalInputDto) },
      { $ref: getSchemaPath(DataTableDecimalPercentageColoredDto) },
    ],
  })
  @Optional()
  public display: DataTableDecimalInputDto | DataTableDecimalPercentageColoredDto;
}

function mapDataTableMapping(mapping: TDataTableMapping): DataTableMappingDtoType {
  switch (mapping.type) {
    case "date-time":
      return DataTableDateTimeMappingDto.FromDbo(mapping);
    case "decimal":
      return DataTableDecimalMappingDto.FromDbo(mapping);
    case 'string':
      return DataTableStringMappingDto.FromDbo(mapping);
    case 'integer':
      return DataTableIntegerMappingDto.FromDbo(mapping);
    case 'uuid':
      return DataTableUuidMappingDto.FromDbo(mapping);
    case 'select':
      return DataTableSelectMappingDto.FromDbo(mapping);
  }
}

type DataTableMappingDtoType = DataTableUuidMappingDto
  | DataTableSelectMappingDto
  | DataTableStringMappingDto
  | DataTableIntegerMappingDto
  | DataTableDateTimeMappingDto
  | DataTableDecimalMappingDto;

export class DataTableDto {
  public static FromDbo(datatable: TDataTable): DataTableDto {
    const dto = new DataTableDto();

    dto.id = datatable.id;
    dto.name = datatable.name;
    dto.mapping = datatable.mapping.map(mapDataTableMapping);

    return dto;
  }

  @ApiProperty()
  public id: string;

  @ApiProperty()
  public name: string;

  @ApiProperty({
    isArray: true,
    oneOf: [
      { $ref: getSchemaPath(DataTableUuidMappingDto) },
      { $ref: getSchemaPath(DataTableSelectMappingDto) },
      { $ref: getSchemaPath(DataTableStringMappingDto) },
      { $ref: getSchemaPath(DataTableIntegerMappingDto) },
      { $ref: getSchemaPath(DataTableDateTimeMappingDto) },
      { $ref: getSchemaPath(DataTableDecimalMappingDto) },
    ],
  })
  public mapping: Array<DataTableMappingDtoType>;
}
