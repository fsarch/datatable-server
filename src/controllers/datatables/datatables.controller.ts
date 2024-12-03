import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { DatatablesService } from "./datatables.service.js";
import { DataTableDto } from "../../models/dto/datatable.model.js";

@ApiTags('datatables')
@Controller({
  path: 'datatables',
  version: '1',
})
@ApiBearerAuth()
export class DatatablesController {
  constructor(private readonly datatablesService: DatatablesService) {}

  @Get()
  public async List(): Promise<Array<DataTableDto>> {
    const data = await this.datatablesService.List();

    return data.map(DataTableDto.FromDbo);
  }
}
