import { ClClassReference, ClPageI } from '@monorepo/core-lib';
import { FlSavedSearch } from './fl-saved-search.class';
import { FlFormInputsManagerConfig } from '@monorepo/front-core-lib/fl-form-inputs-manager';
import { Observable } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { FlDatasourceSortCriteria } from '@monorepo/front-core-lib/fl-core';

/**
 * Configuration object for the {@link FlSearchComponent}
 */
export interface FlSearchConfig {
  version: number;
  buildAdvancedForm: () => FormGroup; // method to create the advanced form group
  advancedFormClass: ClClassReference;
  savedSearch?: FlSavedSearch[];

  advancedFormManager: {
    config: FlFormInputsManagerConfig;
    /**
     * If true, the false values are considered as null and the form manager chip will not be created
     */
    skipFalseBoolean?: boolean;
  };
  storeSearchInUrl: boolean; // if true the url is modified when a search is made
  // default sort criteria to use when no sort is defined
  defaultSort?: FlDatasourceSortCriteria;
  // if true, the search is automatically launched when the form is created
  // default to true
  autoSearch?: boolean;
}

/**
 * Search function
 */
export type FlSearchFunction<T = any> = (
  page: number,
  pageSize: number,
  filters: any
) => Observable<ClPageI<T>>;
