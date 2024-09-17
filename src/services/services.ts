import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ColDef } from 'ag-grid-community'; // Column Definition Type Interface
import { AgGridManager } from './ag-grid-manager';
import { QueryParams } from './types';
import { AdvancedDataOverviewManager } from './base-class';

export type PokemonData = { name: string };
export type FilterParams = { [key: string]: string };
export type NewColDefs = {
  nameCol:string 
}
@Injectable({ providedIn: 'root' })
export class AgGridPokemonsOverviewManager
  implements AgGridManager<PokemonData>
{
  constructor(protected httpClient: HttpClient) {}

  columnDefinitions: ColDef[] = [
    {
      headerName: 'Name',
      filter: true,
      valueGetter: (params)=>params.data?.name
    },
  ];

  doFetch(params: QueryParams) {

    return this.httpClient.get<{ results: { name: string }[]; count: number }>(
      `https://pokeapi.co/api/v2/pokemon/`,
      { params }
    );
  }
}
