import { Injectable, OnDestroy } from '@angular/core';
import {
  FlDatasourcePaginated,
  FlDatasourceSortCriteria
} from '../../../model/datasource/fl-datasource-paginated.class';
import { FormGroup } from '@ngneat/reactive-forms';
import { MatDrawer } from '@angular/material/sidenav';
import { FlSearchConfig } from './fl-search-state-config.class';
import { ActivatedRoute, Router } from '@angular/router';
import { FlAdvancedSearchObjectUrl, FlSearchPageUrlHelper, FlSearchUrlObject } from './fl-search-url.helper';
import { first } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { ClCoreJsonConvert } from '@monorepo/core-lib';
import { FlSavedSearch } from './fl-saved-search.class';
import { ControlEventOptions } from '@ngneat/reactive-forms/lib/types';


/**
 * Use to manage the start of a search component.
 */
@Injectable()
export class FlSearchState<T> implements OnDestroy {

  private config: FlSearchConfig;
  // datasource containing the data
  public datasource: FlDatasourcePaginated<T, any>;

  // form group instance of the advanced form
  public advancedSearchFormGroup: FormGroup;

  public sortCriteria: FlDatasourceSortCriteria;

  // timestamp code of the last search to prevent calling the same search twice
  private lastSearchTimestamp: string;

  private drawer: MatDrawer;
  private routeSubscription: Subscription;

  // list of filter that are added programmatically and override search criteria
  private hiddenFilters: Record<string, any> = {};

  constructor(private route: ActivatedRoute,
              private router: Router) {
  }

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


    if (config.storeSearchInUrl) {
      this.subscribeToNavigation();
    } else {
      this.initFirstSearch();
    }
  }


  // call advanced search form advanced search form
  public callAdvancedSearchFromForm(): void {
    const filterCriteria = this.advancedSearchFormGroup.getRawValue();
    this.callAdvancedSearch(filterCriteria, this.sortCriteria);

    // get sort and build the search url
    const sortCriteria = this.getSortCriteria();
    const searchUrl: FlAdvancedSearchObjectUrl = {
      filtersCriteria: filterCriteria,
      sortKey: sortCriteria?.key, sortDirection: sortCriteria?.direction
    };

    const timestamp = this.generateSearchTimestamp();

    if (this.config.storeSearchInUrl) {
      this.saveAdvancedSearchInUrl(searchUrl, timestamp);
    }
  }

  // call advanced search from a saved search
  public callAdvancedSearchFromSavedSearch(savedSearch: FlSavedSearch): void {
    this.callAdvancedSearchFromObject(savedSearch.filtersCriteria);
  }

  // call advanced search from a saved search
  public callAdvancedSearchFromObject(searchCriteria: Record<string, any>): void {
    this.resetAdvancedFormGroup(searchCriteria);
    this.callAdvancedSearchFromForm();
  }

  public patchFormValueAndCallSearch(searchCriteria: Record<string, any>): void {
    this.advancedSearchFormGroup.patchValue(searchCriteria);
    this.callAdvancedSearchFromForm();
  }

  public resetFormAndCallSearch(options?: ControlEventOptions): void {
    this.resetAdvancedFormGroup(null, options);
    this.callAdvancedSearchFromForm();
  }


  // call the advanced search from a URL change
  private callAdvancedSearchFromUrl(filtersCriteria: Record<string, any>,
                                    sortCriteria: FlDatasourceSortCriteria, timestamp: string): void {
    this.callAdvancedSearch(filtersCriteria, sortCriteria);
    this.lastSearchTimestamp = timestamp;

    this.sortCriteria = sortCriteria;
    this.resetAdvancedFormGroup(filtersCriteria);
  }

  // method to just call advanced search function
  private callAdvancedSearch(filtersCriteria: Record<string, any>, sortCriteria: FlDatasourceSortCriteria): void {

    let fullFiltersCriteria = filtersCriteria;
    // add the hidden filters
    if (this.hiddenFilters) {
      fullFiltersCriteria = { ...filtersCriteria, ...this.hiddenFilters };
    }

    // call first page and set data
    this.datasource.getFirstPage(fullFiltersCriteria, sortCriteria == null ? null : [sortCriteria]);


    // if the drawer is in over mode (small screens) close it
    if (this.drawer?.mode === 'over') {
      this.closeDrawer();
    }
  }

  public getFiltersCriteria(): T {
    let filtersCriteria = this.advancedSearchFormGroup.getRawValue();
    // add the hidden filters
    if (this.hiddenFilters) {
      filtersCriteria = { ...filtersCriteria, ...this.hiddenFilters };
    }
    return filtersCriteria;
  }

  /////////////////////////////////////////////////// SORT CRITERIA ///////////////////////////////////////////////////

  public setSortCriteriaAndCallSearch(sortCriteria: FlDatasourceSortCriteria): void {
    this.sortCriteria = sortCriteria;
    this.callAdvancedSearchFromForm();
  }

  public getSortCriteria(): FlDatasourceSortCriteria | null {
    return this.sortCriteria;
  }

  /////////////////////////////////////////////////// URL ///////////////////////////////////////////////////

  // subscribe to navigation to call advanced search if it is a navigation back
  private subscribeToNavigation(): void {
    // subscribe to current url on init
    this.route.queryParams.pipe(first()).subscribe(
      params => {
        // init the search with param of url
        this.initFirstSearch(params as any);

        // after init, subscribe to route change to call search is needed
        this.routeSubscription = this.route.queryParams.subscribe(
          params => this.checkAndCallSearchFromUrl(params as any)
        );
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

    const savedSearch: FlSavedSearch = this.config.savedSearch?.find(search => search.default) ?? null;
    if (savedSearch) {
      this.callAdvancedSearchFromSavedSearch(savedSearch);
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


    const formValue: FlAdvancedSearchObjectUrl = FlSearchPageUrlHelper.advancedSearchFromString(params?.search);


    if (formValue != null) {
      try {
        const filtersCriteria = ClCoreJsonConvert.deserialize(formValue.filtersCriteria, this.config.advancedFormClass);
        const sortCriteria: FlDatasourceSortCriteria = {
          key: formValue.sortKey,
          direction: formValue.sortDirection
        }
        this.callAdvancedSearchFromUrl(filtersCriteria, sortCriteria, params.timestamp);
        return true;
      } catch {
        return false;
      }
    }
    return false;
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
        queryParamsHandling: 'merge'
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

  private resetAdvancedFormGroup(value: any, options?: ControlEventOptions): void {
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

  ngOnDestroy(): void {
    this.routeSubscription?.unsubscribe();
  }


}
