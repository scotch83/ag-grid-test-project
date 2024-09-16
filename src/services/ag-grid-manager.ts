import { AdvancedDataOverviewManager, AgGridColumnDefinitionProvider } from './base-class';
import { Injectable } from '@angular/core';
import { ColDef, IGetRowsParams } from 'ag-grid-community'; // Column Definition Type Interface

export interface AgGridManager<
  TData
> extends AdvancedDataOverviewManager<TData>, AgGridColumnDefinitionProvider  {}
