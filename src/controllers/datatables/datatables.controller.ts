import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { DataTableDto } from "../../models/dto/datatable.model.js";
import { DatatablesRepositoryService } from "../../repositories/datatables-repository/datatables-repository.service.js";

@ApiTags('datatables')
@Controller({
  path: 'datatables',
  version: '1',
})
@ApiBearerAuth()
export class DatatablesController {
  constructor(private readonly datatablesRepository: DatatablesRepositoryService) {}

  @Get()
  public async List(): Promise<Array<DataTableDto>> {
    const data = await this.datatablesRepository.List();

    return data.map(DataTableDto.FromDbo);
  }
}
