import { FormBuilder, FormGroup } from '@angular/forms';
import { FlFormInputsManagerConfig } from '@monorepo/front-core-lib/fl-form-inputs-manager';
import {
  FlSearchFilterCriteriaConverter,
  FlSearchSortCriteriaConverter,
} from '@monorepo/front-core-lib/fl-search';

export class LiCredentialsSearchFields {
  name: string;

  type: string;
}

export class LiCredentialsSearch {
  public static searchManagerConfig: FlFormInputsManagerConfig<LiCredentialsSearchFields> = {
    name: 'li.name',
    type: 'li.credentials_type',
  };

  /**
   * Convert used by the advanced search to convert the form result to list of {@link FlSearchCriteria}
   */
  public static filterConverter: FlSearchFilterCriteriaConverter<LiCredentialsSearchFields> = {
    name: { key: 'name', operator: 'CONTAINS' },
    type: { key: 'type', operator: 'EQ' },
  };

  public static sortConverter: FlSearchSortCriteriaConverter = {
    name: 'name',
    type: 'type',
    created_at: 'created_at',
  };

  public static getSearchForm(): FormGroup {
    return new FormBuilder().group({
      name: [null],
      type: [null],
    });
  }
}
