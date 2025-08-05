import { Directive, inject,OnDestroy, OnInit } from '@angular/core';
import { MatSort, Sort } from '@angular/material/sort';
import { FlSortDirection } from '@monorepo/front-core-lib/fl-core';
import { Subscription } from 'rxjs';

import { FlSearchState } from '../../model/fl-search.state';

/**
 * Directive to put on a mat-table to connect the sorting of the table with the search state
 */
@Directive({
  selector: 'mat-table[flSearchTableSort]',
  hostDirectives: [
    {
      directive: MatSort,
      inputs: ['matSortDisabled'],
    },
  ],
  standalone: false,
})
export class FlSearchTableSortDirective implements OnInit, OnDestroy {
  private searchState = inject<FlSearchState<any>>(FlSearchState, { optional: true });
  private sort = inject(MatSort);

  private subscription: Subscription;

  ngOnInit(): void {
    if (this.sort.disabled) return;
    // if the search state is not provided, we disable the sort
    if (this.searchState == null) {
      this.sort.disabled = true;
      return;
    }

    this.subscription = this.sort.sortChange.subscribe((event) => this.onSortChange(event));

    // init the sort
    const sortCriteria = this.searchState.getSortCriteria();
    if (sortCriteria) {
      this.sort.active = sortCriteria.key;
      this.sort.direction = sortCriteria.direction === 'ASC' ? 'asc' : 'desc';
    }
  }

  private onSortChange(sort: Sort): void {
    if (!sort.direction) {
      this.searchState.setSortCriteriaAndCallSearch(null);
    } else {
      const direction: FlSortDirection = sort.direction === 'asc' ? 'ASC' : 'DESC';
      this.searchState.setSortCriteriaAndCallSearch({ key: sort.active, direction });
    }
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
