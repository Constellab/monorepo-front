import { FormBuilder, FormGroup } from '@angular/forms';
import { FlFormInputsManagerConfig } from '@monorepo/front-core-lib/fl-form-inputs-manager';
import {
  FlSearchConverter,
  FlSearchDateInterval,
  FlSearchFilterCriteriaConverter,
  FlSearchSortCriteriaConverter,
} from '@monorepo/front-core-lib/fl-search';
import { Type } from 'class-transformer';

import { CaUser } from '../../../model/entities/ca-user.class';

export class CaTeamSearchFields {
  id: string;

  label: string;

  @Type(() => CaUser)
  createdBy: CaUser;

  @Type(() => FlSearchDateInterval)
  createdAt: FlSearchDateInterval;
}

export class CaTeamSearch {
  public static searchManagerConfig: FlFormInputsManagerConfig<CaTeamSearchFields> = {
    createdBy: 'created_by',
    createdAt: 'creation_date',
  };

  public static filterConverter: FlSearchFilterCriteriaConverter<CaTeamSearchFields> = {
    id: { key: 'id', operator: 'EQ' },
    label: { key: 'label', operator: 'CONTAINS' },
    createdBy: { key: 'createdBy.id', operator: 'EQ', convertValue: FlSearchConverter.getEntityId },
    createdAt: FlSearchConverter.dateInterval('createdAt'),
  };

  public static sortConverter: FlSearchSortCriteriaConverter = {
    label: 'label',
    creation: 'createdAt',
  };

  public static getSearchForm(): FormGroup {
    return new FormBuilder().group({
      id: null,
      label: null,
      createdBy: null,
      createdAt: new FormBuilder().group({
        from: [null],
        to: [null],
      }),
    });
  }
}
