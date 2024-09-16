import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { QueryParams } from './types';

export type PaginatedResponse<TData> = { count: number; results: TData[] };

export interface AdvancedDataOverviewManager<TData, TColDef> {
  columnDefinitions: TColDef[];
  doFetch(params: QueryParams): Observable<PaginatedResponse<TData>>;
}
