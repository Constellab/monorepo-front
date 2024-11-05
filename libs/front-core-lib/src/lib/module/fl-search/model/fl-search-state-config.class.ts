import { ClClassReference, ClPageI } from '@monorepo/core-lib';
import { FlSavedSearch } from './fl-saved-search.class';
import { FlFormInputsManagerConfig } from '../../fl-form-inputs-manager/fl-form-inputs-manager.class';
import { Observable } from 'rxjs';
import { FlDatasourceSortCriteria } from '../../../model/datasource/fl-datasource-paginated.class';
import { FormGroup } from '@angular/forms';

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
}

/**
 * Search function
 */
export type FLSearchFunction<T = any> = (
  page: number,
  pageSize: number,
  filters: any
) => Observable<ClPageI<T>>;
