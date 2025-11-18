import { FormBuilder, FormGroup } from '@angular/forms';
import { FlFormInputsManagerConfig } from '@monorepo/front-core-lib/fl-form-inputs-manager';
import {
  FlSearchConverter,
  FlSearchDateInterval,
  FlSearchFilterCriteriaConverter,
  FlSearchSortCriteriaConverter,
} from '@monorepo/front-core-lib/fl-search';
import { Type } from 'class-transformer';

export class HaAdminPanelPartnerSearchFields {
  name: string;

  certified: boolean;

  @Type(() => FlSearchDateInterval)
  createdAt: FlSearchDateInterval;

  @Type(() => FlSearchDateInterval)
  lastModifiedAt: FlSearchDateInterval;

  id: string;
}

export class HaAdminPanelPartnerSearch {
  public static searchManagerConfig: FlFormInputsManagerConfig<HaAdminPanelPartnerSearchFields> = {
    name: 'name',
    certified: 'certified',
    createdAt: 'createdAt',
    lastModifiedAt: 'lastModifiedAt',
  };

  public static filterConverter: FlSearchFilterCriteriaConverter<HaAdminPanelPartnerSearchFields> = {
    name: { key: 'name', operator: 'CONTAINS' },
    certified: { key: 'certified', operator: 'EQ' },
    createdAt: FlSearchConverter.dateInterval('createdAt'),
    lastModifiedAt: FlSearchConverter.dateInterval('lastModifiedAt'),
    id: { key: 'id', operator: 'EQ' },
  };

  public static sortConverter: FlSearchSortCriteriaConverter = {
    name: 'name',
    certified: 'certified',
    createdAt: 'createdAt',
    lastModifiedAt: 'lastModifiedAt',
  };

  public static getSearchForm(): FormGroup {
    return new FormBuilder().group({
      name: null,
      certified: null,
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
