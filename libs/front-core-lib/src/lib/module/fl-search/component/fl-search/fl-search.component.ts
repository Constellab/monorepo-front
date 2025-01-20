import { Component, OnInit, ViewChild } from '@angular/core';
import { FlSearchState } from '../../model/fl-search.state';
import { FlDatasourcePaginated } from '../../../../model/datasource/fl-datasource-paginated.class';
import { MatDrawer } from '@angular/material/sidenav';
import { Breakpoints } from '@angular/cdk/layout';

/**
 * Search component with a header, a drawer search on the right and result in table on bottom
 *
 * The FlSearchState must be provided and configured and the Fl_SEARCH_CONFIG must also be provided.
 */
@Component({
    selector: 'fl-search',
    templateUrl: './fl-search.component.html',
    styleUrls: ['./fl-search.component.scss'],
    standalone: false
})
export class FlSearchComponent implements OnInit {
  @ViewChild(MatDrawer, { static: true }) drawer: MatDrawer;

  datasource: FlDatasourcePaginated<any>;

  // set the screen size where the drawer will be over the content
  drawerOverBreakPoints = [Breakpoints.XSmall, Breakpoints.Small, Breakpoints.Medium];

  constructor(private searchState: FlSearchState<any>) {}

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
