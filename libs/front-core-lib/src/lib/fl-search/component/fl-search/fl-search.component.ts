import { Breakpoints } from '@angular/cdk/layout';
import { Component, inject,OnInit, ViewChild } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { FlDatasourcePaginated } from '@monorepo/front-core-lib/fl-core';

import { FlSearchState } from '../../model/fl-search.state';

/**
 * Search component with a header, a drawer search on the right and result in table on bottom
 *
 * The FlSearchState must be provided and configured and the Fl_SEARCH_CONFIG must also be provided.
 */
@Component({
  selector: 'fl-search',
  templateUrl: './fl-search.component.html',
  styleUrls: ['./fl-search.component.scss'],
  standalone: false,
})
export class FlSearchComponent implements OnInit {
  private searchState = inject<FlSearchState<any>>(FlSearchState);

  @ViewChild(MatDrawer, { static: true }) drawer: MatDrawer;

  datasource: FlDatasourcePaginated<any>;

  // set the screen size where the drawer will be over the content
  drawerOverBreakPoints = [Breakpoints.XSmall, Breakpoints.Small, Breakpoints.Medium];

  ngOnInit(): void {
    this.datasource = this.searchState.datasource;
    this.searchState.setDrawer(this.drawer);
  }

  toggleDrawer(): void {
    this.drawer.toggle();
  }

  loadMoreResults(): void {
    this.datasource.getNextPage();
  }
}
