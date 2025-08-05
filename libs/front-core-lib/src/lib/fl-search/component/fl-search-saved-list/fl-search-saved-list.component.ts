import { Component, inject,OnInit } from '@angular/core';

import { FlSavedSearch } from '../../model/fl-saved-search.class';
import { FlSearchState } from '../../model/fl-search.state';

/**
 * Works inside the {@link FlSearchComponent} to list the saved search and trigger search on click
 */
@Component({
  selector: 'fl-search-saved-list',
  templateUrl: './fl-search-saved-list.component.html',
  styleUrls: ['./fl-search-saved-list.component.scss'],
  standalone: false,
})
export class FlSearchSavedListComponent implements OnInit {
  private searchState = inject<FlSearchState<any>>(FlSearchState);

  savedSearch: FlSavedSearch[];

  ngOnInit(): void {
    this.savedSearch = this.searchState.getConfig().savedSearch;
  }

  callSavedSearch(savedSearch: FlSavedSearch): void {
    this.searchState.patchFormFromSaveSearch(savedSearch);
  }
}
