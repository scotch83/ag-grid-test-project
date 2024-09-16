import { AdvancedDataOverviewManager, AgGridColumnDefinitionProvider } from './base-class';
type Extended<TData> = AdvancedDataOverviewManager<TData> & AgGridColumnDefinitionProvider;
export interface AgGridManager<
  TData
> extends  Extended<TData>{}
