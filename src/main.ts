import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';

import { AdvancedTableComponent } from './components/advanced-table/advanced-table.component';
import { AdvancedDataOverviewManager } from './services/base-class';
import { AgGridPokemonsOverviewManager } from './services/services';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [AdvancedTableComponent],
  template: `
    <h1>Hello from {{ name }}!</h1>
    <a target="_blank" href="https://angular.dev/overview">
      Learn more about Angular
    </a>
    <app-advanced-table [gridManager]="testManager"></app-advanced-table>
  `,
})
export class App<TData, TFilter> {
  name = 'Angular';

  constructor(protected readonly testManager: AgGridPokemonsOverviewManager) {}
}

bootstrapApplication(App, {
  providers: [provideHttpClient()],
});
