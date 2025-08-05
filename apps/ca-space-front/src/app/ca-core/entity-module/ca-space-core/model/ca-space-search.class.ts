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
import { CaSpaceType } from '../../../model/entities/space/ca-space.class';

export class CaSpaceSearchFields {
  name: string;

  domain: string;

  type: CaSpaceType;

  @Type(() => FlSearchDateInterval)
  createdAt: FlSearchDateInterval;

  @Type(() => CaUser)
  createdBy: CaUser;

  id: string;
}

export class CaSpaceSearch {
  public static searchManagerConfig: FlFormInputsManagerConfig<CaSpaceSearchFields> = {
    name: 'name',
    domain: 'space_domain',
    type: 'type',
    createdAt: 'creation_date',
    createdBy: 'created_by',
  };

  public static filterConverter: FlSearchFilterCriteriaConverter<CaSpaceSearchFields> = {
    name: { key: 'name', operator: 'CONTAINS' },
    domain: { key: 'domain', operator: 'CONTAINS' },
    type: { key: 'type', operator: 'EQ' },
    createdAt: FlSearchConverter.dateInterval('createdAt'),
    createdBy: { key: 'createdBy.id', operator: 'EQ', convertValue: FlSearchConverter.getEntityId },
    id: { key: 'id', operator: 'EQ' },
  };

  public static sortConverter: FlSearchSortCriteriaConverter = {
    name: 'name',
    type: 'type',
    created: 'createdAt',
    lastModified: 'lastModifiedAt',
  };

  public static getSearchForm(): FormGroup {
    return new FormBuilder().group({
      name: null,
      domain: null,
      type: null,
      createdAt: new FormBuilder().group({
        from: [null],
        to: [null],
      }),
      createdBy: null,
      id: null,
    });
  }
}
