import { Injectable } from '@angular/core';
import {
  ColDef,
  ColGroupDef
} from 'ag-grid-community'

import { Observable } from 'rxjs';
import { QueryParams } from './types';

export type PaginatedResponse<TData> = { count: number; results: TData[] };

export interface AgGridColumnDefinitionProvider {
  columnDefinitions: (ColDef|ColGroupDef)[];
}

export interface AdvancedDataOverviewManager<TData> {
  doFetch(params: QueryParams): Observable<PaginatedResponse<TData>>;
}
