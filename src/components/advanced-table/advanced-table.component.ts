import { input, Component } from '@angular/core';
import {
  GridOptions,
  ColDef,
  ColGroupDef,
  IGetRowsParams,
  FilterModel,
} from 'ag-grid-community'; // Column Definition Type Interface
import { AgGridAngular } from 'ag-grid-angular'; // Angular Data Grid Component
import { firstValueFrom } from 'rxjs';
import { AdvancedDataOverviewManager } from '../../services/base-class';
import { QueryParams } from '../../services/types';
import { filterModelToQueryParams } from '../../../filterModelParse';

@Component({
  selector: 'app-advanced-table',
  standalone: true,
  imports: [AgGridAngular],
  templateUrl: './advanced-table.component.html',
  styleUrl: './advanced-table.component.css',
})
export class AdvancedTableComponent<TData> {
  cacheBlockSize = 100;
  gridOptions: GridOptions = {
    rowModelType: 'infinite',
    cacheBlockSize: this.cacheBlockSize,
    suppressRowClickSelection: true,
    datasource: {
      getRows: (params: IGetRowsParams) => this.getRows(params),
    },
  };
  gridManager = input.required<AdvancedDataOverviewManager<TData, ColDef>>();

  constructor() {}

  onGridReady(event: any) {}
  onFilterChanged(event: any) {}

  async getRows(params: IGetRowsParams) {
    const queryParams = this.paramsFactory(params);
    const res = await firstValueFrom(this.gridManager().doFetch(queryParams));
    params.successCallback(res.results, res.count);
  }

  protected paramsFactory(rowParams: IGetRowsParams): QueryParams {
    const filter = filterModelToQueryParams<QueryParams>(rowParams.filterModel);
    return {
      ...filter,
      limit: rowParams.endRow - rowParams.startRow,
      offset: rowParams.startRow,
    };
  }
}
