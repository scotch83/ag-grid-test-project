import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ColDef } from 'ag-grid-community'; // Column Definition Type Interface
import { AgGridManager } from './ag-grid-manager';
import { QueryParams } from './types';

export type PokemonData = { name: string };
export type FilterParams = { [key: string]: string };
@Injectable({ providedIn: 'root' })
export class AgGridPokemonsOverviewManager
  implements AgGridManager<PokemonData>
{
  constructor(protected httpClient: HttpClient) {}

  columnDefinitions: ColDef[] = [
    {
      headerName: 'Name',
      colId: 'name',
      filter: true,
      valueGetter: (p) => {
        return p.data?.name ?? '';
      },
    },
  ];

  doFetch(params: QueryParams) {
    return this.httpClient.get<{ results: { name: string }[]; count: number }>(
      `https://pokeapi.co/api/v2/pokemon/`,
      { params }
    );
  }
}
