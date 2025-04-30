import { Type } from 'class-transformer';
import {
  FlSearchConverter,
  FlSearchDateInterval,
  FlSearchFilterCriteriaConverter,
  FlSearchSortCriteriaConverter,
} from '@monorepo/front-core-lib/fl-search';
import { HaSpace } from '../../ha-core/ha-model/ha-entities/ha-space.class';
import { FlFormInputsManagerConfig } from '@monorepo/front-core-lib/fl-form-inputs-manager';
import { HaBrickVisibility } from '../../ha-core/ha-model/ha-entities/ha-brick.class';
import { FormBuilder, FormGroup } from '@angular/forms';

export class HaAdminPanelBrickSearchFields {
  name: string;

  visibility: HaBrickVisibility;

  @Type(() => HaSpace)
  space: HaSpace;

  @Type(() => FlSearchDateInterval)
  createdAt: FlSearchDateInterval;

  @Type(() => FlSearchDateInterval)
  lastModifiedAt: FlSearchDateInterval;

  id: string;
}

export class HaAdminPanelBrickSearch {
  public static searchManagerConfig: FlFormInputsManagerConfig<HaAdminPanelBrickSearchFields> = {
    name: 'name',
    visibility: 'visibility',
    space: 'space',
    createdAt: 'createdAt',
    lastModifiedAt: 'lastModifiedAt',
  };

  public static filterConverter: FlSearchFilterCriteriaConverter<HaAdminPanelBrickSearchFields> = {
    name: { key: 'name', operator: 'CONTAINS' },
    visibility: { key: 'visibility', operator: 'EQ' },
    space: { key: 'space.id', operator: 'EQ', convertValue: FlSearchConverter.getEntityId },
    createdAt: FlSearchConverter.dateInterval('createdAt'),
    lastModifiedAt: FlSearchConverter.dateInterval('lastModifiedAt'),
    id: { key: 'id', operator: 'EQ' },
  };

  public static sortConverter: FlSearchSortCriteriaConverter = {
    name: 'name',
    visibility: 'visibility',
    space: 'space',
    createdAt: 'createdAt',
    lastModifiedAt: 'lastModifiedAt',
  };

  public static getSearchForm(): FormGroup {
    return new FormBuilder().group({
      name: null,
      visibility: null,
      space: null,
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
