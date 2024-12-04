import { ApiProperty } from "@nestjs/swagger";

export class BulkDataPatchDto {
  @ApiProperty({
    type: 'object'
  })
  identifiers: Record<string, unknown>;

  @ApiProperty({
    type: 'object'
  })
  update: Record<string, unknown>;
}
