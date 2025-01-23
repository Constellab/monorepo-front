import { ClHelpService } from '@monorepo/core-lib';
import { FlSortDirection } from '@monorepo/front-core-lib/fl-core';

/**
 * Use to store the advanced search values in the URL
 */
export interface FlAdvancedSearchObjectUrl {
  filtersCriteria?: Record<string, any>;
  sortKey?: string;
  sortDirection?: FlSortDirection;
}

/**
 * Object stored in the url to save the search
 */
export interface FlSearchUrlObject {
  search: string;
  timestamp: string;
}

/**
 * Implement to class to specify how to convert the object to url for the search
 */
export interface FlSearchObjectToUrl {
  toUrlJson(): Record<string, any>;
}

export class FlSearchPageUrlHelper {
  /**
   * Method to convert search to query param for search page
   * @param search search criteria
   * @param timestamp of the search
   */
  public static buildSearchUrlObject(search: string, timestamp: string): FlSearchUrlObject {
    if (!search) return { search: null, timestamp: null };
    return { search: search, timestamp: timestamp };
  }

  /**
   * Convert the advanced search object to string.
   * For object with id, only keep the id and remove others fields
   * @param advancedSearch
   */
  public static advancedSearchToString(advancedSearch: FlAdvancedSearchObjectUrl): string | null {
    const simpleSearch: FlAdvancedSearchObjectUrl = {};

    const filterCriteria = FlSearchPageUrlHelper.simplifyFilterObject(advancedSearch.filtersCriteria);
    if (filterCriteria) {
      simpleSearch.filtersCriteria = filterCriteria;
    }

    if (advancedSearch.sortKey && advancedSearch.sortDirection) {
      simpleSearch.sortKey = advancedSearch.sortKey;
      simpleSearch.sortDirection = advancedSearch.sortDirection;
    }

    if (ClHelpService.objectHasNonNullProperties(simpleSearch)) {
      return JSON.stringify(simpleSearch);
    }

    return null;
  }

  private static simplifyFilterObject(filters: Record<string, any>): Record<string, any> | null {
    const simpleFilters: Record<string, any> = {};

    for (const key of Object.keys(filters)) {
      if (filters[key] == null) continue;

      let filter: any;
      if (Array.isArray(filters[key])) {
        filter = filters[key].map((item: any) => this.filterSearchObjectToString(item));
      } else if (typeof filters[key] === 'object') {
        filter = this.filterSearchObjectToString(filters[key]);
      } else {
        filter = filters[key];
      }

      if (!ClHelpService.isNullOrEmpty(filter)) {
        simpleFilters[key] = filter;
      }
    }

    if (ClHelpService.isNullOrEmpty(simpleFilters)) {
      return null;
    }
    return simpleFilters;
  }

  private static filterSearchObjectToString(obj: Record<any, any>): Record<any, any> | null {
    // skip object where all values are null
    if (!ClHelpService.objectHasNonNullProperties(obj)) return null;

    // check if object has method toTest()
    if (obj.toUrlJson && typeof obj.toUrlJson === 'function') {
      return (obj as FlSearchObjectToUrl).toUrlJson();
    }

    if (obj.id !== undefined) {
      return { id: obj.id };
    }

    return obj;
  }

  // parse and check if the search string from URL is a list of SearchCriteria for advanced search
  public static advancedSearchFromString(strSearch: string): FlAdvancedSearchObjectUrl | null {
    if (!strSearch) {
      return null;
    }

    let search: FlAdvancedSearchObjectUrl;
    try {
      search = JSON.parse(strSearch);
    } catch {
      return null;
    }

    // check that the search attributes are correctly set
    if (search && (search.filtersCriteria || search.sortKey)) {
      return search;
    }
    return null;
  }
}
