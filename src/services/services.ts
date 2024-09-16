import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ColDef } from 'ag-grid-community'; // Column Definition Type Interface
import { AgGridManager } from './ag-grid-manager';
import { QueryParams } from './types';
import { AdvancedDataOverviewManager } from './base-class';

export type PokemonData = { name: string };
export type FilterParams = { [key: string]: string };
@Injectable({ providedIn: 'root' })
export class AgGridPokemonsOverviewManager
  implements AdvancedDataOverviewManager<PokemonData>
{
  constructor(protected httpClient: HttpClient) {}

  columnDefinitions: FilterParams[] = [
    {
      headerName: 'Name',
      colId: 'name',
    },
  ];

  doFetch(params: QueryParams) {

    return this.httpClient.get<{ results: { name: string }[]; count: number }>(
      `https://pokeapi.co/api/v2/pokemon/`,
      { params }
    );
  }
}
