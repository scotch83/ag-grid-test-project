import { zonedTimeToUtc } from 'date-fns-tz';
import { endOfDay, formatISO } from 'date-fns';
import { ColDef } from 'ag-grid-community';
import * as _ from 'lodash';

const RANGE_FROM_KEYWORD = 'RangeFrom';
const RANGE_TO_KEYWORD = 'RangeTo';

export function filterModelToQueryParams<T>(filterModel: unknown): T {
  if (typeof filterModel !== 'object' || !filterModel) {
    return {} as T;
  }

  const filterModelKeys = Object.entries(filterModel);
  const queryParams = filterModelKeys.reduce((queryParams, [key, value]) => {
    const parameters = resolveFilter(
      value,
      key
    );
    
    parameters.forEach(
      (param) => (queryParams[param.queryParamName] = param.value)
    );
    return queryParams;
  }, {} as any);

  return queryParams;
}

function resolveFilter(filter: Filter, key: string): FilterResolveResult[] {
  switch (filter.filterType) {
    case FilterType.TEXT:
      return textResolver(filter as TextFilter, key);
    case FilterType.DATE:
      return dateResolver(filter as DateFilter, key);
    case FilterType.NUMBER:
      return numberResolver(filter as NumberFilter, key);
    default:
      throw new Error(`Unhandled filter type ${filter.filterType}`);
  }
}

export enum FilterType {
  TEXT = 'text',
  DATE = 'date',
  NUMBER = 'number',
}

export enum FilterSubType {
  EQUALS = 'equals',
  IN_RANGE = 'inRange',
  CONTAINS = 'contains',
}

export interface Filter {
  filterType: FilterType;
  type: FilterSubType;
}

export interface TextFilter extends Filter {
  filter: string;
}

export interface DateFilter extends Filter {
  dateFrom: string;
  dateTo: string;
  timezone: string;
}

export interface NumberFilter extends Filter {
  filter: number;
  filterTo: number;
}

export const TIMEZONE_AMSTERDAM = 'Europe/Amsterdam';
function textResolver(
  textFilter: TextFilter,
  key: string
): FilterResolveResult[] {
  return [{ queryParamName: key, value: textFilter.filter }];
}

function dateResolver(
  { dateFrom, dateTo, timezone, type }: DateFilter,
  key: string
): FilterResolveResult[] {
  const tz = timezone ?? TIMEZONE_AMSTERDAM;
  switch (type) {
    case FilterSubType.IN_RANGE: {
      const endOfDayDateTo = endOfDay(new Date(dateTo)).toISOString();
      return inRangeFilterResolveResults(
        key,
        formatDate(dateFrom, tz),
        formatDate(endOfDayDateTo, tz)
      );
    }
    case FilterSubType.EQUALS:
    default:
      return [{ queryParamName: key, value: formatDate(dateFrom, tz) }];
  }
}

function formatDate(value: string, timeZone: string) {
  return formatISO(zonedTimeToUtc(value, timeZone));
}

function numberResolver(
  numberFilter: NumberFilter,
  key: string
): FilterResolveResult[] {
  switch (numberFilter.type) {
    case FilterSubType.IN_RANGE:
      return inRangeFilterResolveResults(
        key,
        numberFilter.filter,
        numberFilter.filterTo
      );
    case FilterSubType.CONTAINS:
      return [{ queryParamName: key, value: numberFilter.filter }];
  }
  return [];
}

function inRangeFilterResolveResults(key: string, from: any, to: any) {
  return [
    { queryParamName: `${key}${RANGE_FROM_KEYWORD}`, value: from },
    { queryParamName: `${key}${RANGE_TO_KEYWORD}`, value: to },
  ];
}

interface FilterResolveResult {
  queryParamName: string;
  value: any;
}

export type AgGridFilterModel = { [key: string]: Filter };

export function columnDefsToFilterConfig(
  columnDefs: ColDef<unknown>[]
): AgGridFilterModel {
  const filterConfig: { [key: string]: Filter } = columnDefs
    .filter((col) => col.filter || col.floatingFilterComponent)
    .map((col) => ({
      [col.colId as string]: {
        filterType: getColFilterType(col),
        type: col.filterParams?.filterOptions?.includes('inRange')
          ? FilterSubType.IN_RANGE
          : FilterSubType.EQUALS,
      },
    }))
    .reduce((result, currentObject) => {
      return { ...result, ...currentObject };
    }, {});
  return filterConfig;
}

function getColFilterType(col: ColDef<unknown>): FilterType {
  if (col.filter === 'agDateColumnFilter') {
    return FilterType.DATE;
  }

  if (col.filter === 'agNumberColumnFilter') {
    return FilterType.NUMBER;
  }

  return FilterType.TEXT;
}
