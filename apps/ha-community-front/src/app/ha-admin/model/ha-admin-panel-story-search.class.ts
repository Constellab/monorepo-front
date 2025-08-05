import { FormBuilder, FormGroup } from '@angular/forms';
import { FlFormInputsManagerConfig } from '@monorepo/front-core-lib/fl-form-inputs-manager';
import {
  FlSearchConverter,
  FlSearchDateInterval,
  FlSearchFilterCriteriaConverter,
  FlSearchSortCriteriaConverter,
} from '@monorepo/front-core-lib/fl-search';
import { Type } from 'class-transformer';

export class HaAdminPanelStorySearchFields {
  title: string;

  @Type(() => FlSearchDateInterval)
  createdAt: FlSearchDateInterval;

  @Type(() => FlSearchDateInterval)
  lastModifiedAt: FlSearchDateInterval;

  id: string;
}

export class HaAdminPanelStorySearch {
  public static searchManagerConfig: FlFormInputsManagerConfig<HaAdminPanelStorySearchFields> = {
    title: 'title',
    createdAt: 'createdAt',
    lastModifiedAt: 'lastModifiedAt',
  };

  public static filterConverter: FlSearchFilterCriteriaConverter<HaAdminPanelStorySearchFields> = {
    title: { key: 'title', operator: 'CONTAINS' },
    createdAt: FlSearchConverter.dateInterval('createdAt'),
    lastModifiedAt: FlSearchConverter.dateInterval('lastModifiedAt'),
    id: { key: 'id', operator: 'EQ' },
  };

  public static sortConverter: FlSearchSortCriteriaConverter = {
    title: 'title',
    createdAt: 'createdAt',
    lastModifiedAt: 'lastModifiedAt',
  };

  public static getSearchForm(): FormGroup {
    return new FormBuilder().group({
      title: null,
      createdAt: new FormBuilder().group({
        from: null,
        to: null,
      }),
      lastModifiedAt: new FormBuilder().group({
        from: null,
        to: null,
      }),
    });
  }
}
