import { inject, Injectable, OnDestroy } from '@angular/core';
import { FlDatasourcePaginated, FlDatasourceSortCriteria } from '@monorepo/front-core-lib/fl-core';
import { FormGroup } from '@angular/forms';
import { MatDrawer } from '@angular/material/sidenav';
import { FlSearchConfig } from './fl-search-state-config.class';
import { ActivatedRoute, Router } from '@angular/router';
import { FlAdvancedSearchObjectUrl, FlSearchPageUrlHelper, FlSearchUrlObject } from './fl-search-url.helper';
import { debounceTime, filter, first } from 'rxjs/operators';
import { ClCoreJsonConvert, ClSubscriptionHandler } from '@monorepo/core-lib';
import { FlSavedSearch } from './fl-saved-search.class';
import { merge, Subject } from 'rxjs';

/**
 * Use to manage the start of a search component.
 */
@Injectable()
export class FlSearchState<T> implements OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  private config: FlSearchConfig;
  // datasource containing the data
  public datasource: FlDatasourcePaginated<T, any>;

  // form group instance of the advanced form
  public advancedSearchFormGroup: FormGroup;

  public sortCriteria: FlDatasourceSortCriteria;

  // timestamp code of the last search to prevent calling the same search twice
  private lastSearchTimestamp: string;

  private drawer: MatDrawer;
  private subscriptions = new ClSubscriptionHandler();

  // list of filter that are added programmatically and override search criteria
  private hiddenFilters: Record<string, any> = {};

  // list of column tags filter keys for Table resource column filter
  private columnTagsFilterKeys: string[] = [];

  // subject used to prevent search call on form change
  // it is call when the form is submitted to override the form change (to avoid calling search twice)
  private skipSearch = new Subject<{ _skipSearch: true }>();

  private isDestroyed = false;

  public disabled: boolean = false;

  public setDrawer(drawer: MatDrawer): void {
    this.drawer = drawer;
  }

  /**
   * Init the search page and call first search
   */
  public init(config: FlSearchConfig, datasource: FlDatasourcePaginated<T, any>): void {
    this.config = config;
    this.advancedSearchFormGroup = config.buildAdvancedForm();
    this.sortCriteria = config.defaultSort;
    this.datasource = datasource;

    this.listenToFromChange();
    if (config.storeSearchInUrl) {
      this.subscribeToNavigation();
    } else {
      this.initFirstSearch();
    }
  }

  public submitForm(): void {
    if (this.disabled) return;
    this.callAdvancedSearchFromForm();
    // emit a skip to cancel current form change
    this.skipSearch.next({ _skipSearch: true });

    // if the drawer is in over mode (small screens) close it
    if (this.drawer?.mode === 'over') {
      this.closeDrawer();
    }
  }

  // call advanced search form advanced search form
  private callAdvancedSearchFromForm(): void {
    const filterCriteria = this.advancedSearchFormGroup.getRawValue();
    this.callAdvancedSearch(filterCriteria, this.sortCriteria);

    // get sort and build the search url
    const sortCriteria = this.getSortCriteria();
    const searchUrl: FlAdvancedSearchObjectUrl = {
      filtersCriteria: filterCriteria,
      sortKey: sortCriteria?.key,
      sortDirection: sortCriteria?.direction,
    };

    const timestamp = this.generateSearchTimestamp();

    if (this.config.storeSearchInUrl) {
      this.saveAdvancedSearchInUrl(searchUrl, timestamp);
    }
  }

  // call advanced search from a saved search
  public patchFormFromSaveSearch(savedSearch: FlSavedSearch): void {
    if (this.disabled) return;
    this.resetAdvancedFormGroup(savedSearch.filtersCriteria);
  }

  public patchFormValueAndCallSearch(searchCriteria: Record<string, any>): void {
    if (this.disabled) return;
    this.advancedSearchFormGroup.patchValue(searchCriteria);
    this.callAdvancedSearchFromForm();
  }

  public resetFormAndCallSearch(): void {
    if (this.disabled) return;
    this.resetAdvancedFormGroup(null, { emitEvent: false });
    this.callAdvancedSearchFromForm();
  }

  // call the advanced search from a URL change
  private patchFormFromUrl(
    filtersCriteria: Record<string, any>,
    sortCriteria: FlDatasourceSortCriteria,
    timestamp: string
  ): void {
    if (this.disabled) return;
    this.lastSearchTimestamp = timestamp;

    this.sortCriteria = sortCriteria;
    // reset the form, this will trigger the form change event
    // and call the search
    this.resetAdvancedFormGroup(filtersCriteria);
  }

  // method to just call advanced search function
  private callAdvancedSearch(
    filtersCriteria: Record<string, any>,
    sortCriteria: FlDatasourceSortCriteria
  ): void {
    let fullFiltersCriteria = filtersCriteria;
    // add the hidden filters
    if (this.hiddenFilters) {
      fullFiltersCriteria = { ...filtersCriteria, ...this.hiddenFilters };
    }

    // call first page and set data
    this.datasource.getFirstPage(fullFiltersCriteria, sortCriteria == null ? null : [sortCriteria]);
  }

  public getFiltersCriteria(): T {
    let filtersCriteria = this.advancedSearchFormGroup.getRawValue();
    // add the hidden filters
    if (this.hiddenFilters) {
      filtersCriteria = { ...filtersCriteria, ...this.hiddenFilters };
    }
    return filtersCriteria;
  }

  //////////////////////////////////// SORT CRITERIA /////////////////////////////////////

  public setSortCriteriaAndCallSearch(sortCriteria: FlDatasourceSortCriteria): void {
    this.sortCriteria = sortCriteria;
    this.callAdvancedSearchFromForm();
  }

  public getSortCriteria(): FlDatasourceSortCriteria | null {
    return this.sortCriteria;
  }

  //////////////////////////////////// URL //////////////////////////////////////////////////

  // subscribe to navigation to call advanced search if it is a navigation back
  private subscribeToNavigation(): void {
    // subscribe to current url on initialization
    // initialize the search with param of url
    this.route.queryParams.pipe(first()).subscribe((params) => {
      this.initFirstSearch(params as any);
    });
  }

  /**
   * Call first search
   * If a search in the URL exist, call
   * Else if there is a default saved advanced search, call it
   */
  private initFirstSearch(params?: FlSearchUrlObject): void {
    // call the advanced search from query params if they exists
    if (this.checkAndCallSearchFromUrl(params as any)) {
      return;
    }

    const savedSearch: FlSavedSearch = this.config.savedSearch?.find((search) => search.default) ?? null;
    if (savedSearch) {
      this.patchFormFromSaveSearch(savedSearch);
    }
  }

  /**
   * check the url query params and if valid, it calls the advanced search
   * if the search is called, it returns true
   */
  private checkAndCallSearchFromUrl(params: FlSearchUrlObject): boolean {
    if (params == null) return false;

    // prevent calling the save search twice
    if (this.lastSearchTimestamp && params.timestamp === this.lastSearchTimestamp) {
      return false;
    }

    const formValue: FlAdvancedSearchObjectUrl = FlSearchPageUrlHelper.advancedSearchFromString(
      params?.search
    );

    if (formValue != null) {
      try {
        const filtersCriteria = ClCoreJsonConvert.deserialize(
          formValue.filtersCriteria,
          this.config.advancedFormClass
        );
        const sortCriteria: FlDatasourceSortCriteria = {
          key: formValue.sortKey,
          direction: formValue.sortDirection,
        };
        this.patchFormFromUrl(filtersCriteria, sortCriteria, params.timestamp);
        return true;
      } catch {
        return false;
      }
    }
    return false;
  }

  /**
   * Method to call after the first search is done
   * It will subscribe to the form change to call the search
   * It will subscribe to the navigation to call the search if the URL change
   * @private
   */
  private listenToFromChange(): void {
    const subscription = merge(this.advancedSearchFormGroup.valueChanges, this.skipSearch)
      .pipe(
        filter(() => this.config.autoSearch == null || this.config.autoSearch),
        debounceTime(350),
        // skip if the component is destroyed, because of the debounce time,
        // it can be called after the component is destroyed
        filter(() => !this.isDestroyed),

        // if the event is skip, do not call the search
        filter((value: { _skipSearch: true }) => value?._skipSearch !== true)
      )
      .subscribe(() => this.callAdvancedSearchFromForm());

    this.subscriptions.add(subscription);

    if (this.config.storeSearchInUrl) {
      // subscribe to route change to call search is needed (like back button)
      this.subscriptions.add(
        this.route.queryParams
          .pipe(
            debounceTime(350),
            // skip if the component is destroyed, because of the debounce time,
            // it can be called after the component is destroyed
            filter(() => !this.isDestroyed)
          )
          .subscribe((params) => this.checkAndCallSearchFromUrl(params as any))
      );
    }
  }

  // save the advanced form search in the url
  // store the last search timestamp in state
  private generateSearchTimestamp(): string {
    // save the search timestamp to prevent call on router
    this.lastSearchTimestamp = new Date().getTime().toString();

    return this.lastSearchTimestamp;
  }

  // save the advanced search in URL
  private saveAdvancedSearchInUrl(advancedSearch: FlAdvancedSearchObjectUrl, timestamp: string): void {
    const searchString: string = FlSearchPageUrlHelper.advancedSearchToString(advancedSearch);

    // limit length to avoid URL problem
    if (!searchString || searchString.length < 1700) {
      const searchUrl = FlSearchPageUrlHelper.buildSearchUrlObject(searchString, timestamp);
      // save the criteria list in the url as query params
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: searchUrl,
        replaceUrl: true,
        queryParamsHandling: 'merge',
      });
    }
  }

  /**
   * Set filter that are added to the request but not set in the form
   * @param hiddenFilters
   */
  public setHiddenFilters(hiddenFilters: Record<string, any>): void {
    this.hiddenFilters = hiddenFilters;
  }

  public setAutoSearch(autoSearch: boolean): void {
    this.config.autoSearch = autoSearch;
  }

  private resetAdvancedFormGroup(
    value: any,
    options?: {
      onlySelf?: boolean;
      emitEvent?: boolean;
    }
  ): void {
    this.advancedSearchFormGroup.reset(value, options);
  }

  public closeDrawer(): void {
    this.drawer.close();
  }

  public toggleDrawer(): void {
    this.drawer.toggle();
  }

  public getConfig(): FlSearchConfig {
    return this.config;
  }

  public setColumnTagsFilterKeys(columnTagsFilterKeys: string[] = []): void {
    this.columnTagsFilterKeys = columnTagsFilterKeys;
  }

  public getColumnTagsFilterKeys(): string[] {
    return this.columnTagsFilterKeys;
  }

  ngOnDestroy(): void {
    this.subscriptions?.unsubscribe();
    this.skipSearch.complete();
    this.isDestroyed = true;
  }
}
