import { BadGatewayException, Controller, Get, InternalServerErrorException, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import {
  DatatablesRepositoryService
} from "../../../repositories/datatables-repository/datatables-repository.service.js";

@ApiTags('datatables/data')
@Controller({
  path: 'datatables/:dataTableId/data',
  version: '1',
})
@ApiBearerAuth()
export class DataController {
  constructor(private readonly datatablesRepository: DatatablesRepositoryService) {}

  @Get()
  public async List(
    @Param('dataTableId') dataTableId: string,
  ): Promise<{ data: Array<unknown> }> {
    const dataTable = await this.datatablesRepository.Get(dataTableId);

    if (dataTable.data_source.type === 'fetch') {
      const headers = new Headers();

      if (dataTable.data_source.auth) {
        if (dataTable.data_source.auth.type === 'basic') {
          const { username, password } = dataTable.data_source.auth;

          headers.set('Authorization', `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`);
        }
      }

      const res = await fetch(dataTable.data_source.url, {
        method: 'GET',
        headers,
      });

      if (res.status !== 200) {
        console.error('invalid {status} from upstream', {
          status: res.status,
        });
        throw new BadGatewayException();
      }

      const responseData = await res.json();

      if (!responseData.data) {
        console.error('no data from upstream');
        throw new BadGatewayException();
      }

      return responseData.data;
    }

    throw new InternalServerErrorException();
  }
}
