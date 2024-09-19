import { Type } from 'class-transformer';
import { CaUser } from '../../../model/entities/ca-user.class';
import {
  FlFormInputsManagerConfig,
  FlSearchConverter,
  FlSearchCriteriaConverter,
  FlSearchDateInterval
} from '@monorepo/front-core-lib';
import { FormBuilder, FormGroup } from '@ngneat/reactive-forms';
import { CaHierarchyObjectType } from '../../../model/entities/folder/ca-hierarchy-object.class';

export class CaHierarchyObjectSearchFields {

  name: string;

  @Type(() => CaUser)
  users: CaUser[];

  @Type(() => FlSearchDateInterval)
  lastModifiedAt: FlSearchDateInterval;

  objectType: CaHierarchyObjectType;

  id: string;
}

export class CaHierarchyObjectSearch {

  public static advancedSearchManagerConfig: FlFormInputsManagerConfig<CaHierarchyObjectSearchFields> = {
    name: 'name',
    lastModifiedAt: 'date'
  };

  public static advancedSearchConverter: FlSearchCriteriaConverter<CaHierarchyObjectSearchFields> = {
    name: { key: 'name', operator: 'MATCH' },
    users: { key: 'user.id', operator: 'IN', convertValue: FlSearchConverter.getEntitiesId },
    lastModifiedAt: FlSearchConverter.dateInterval('lastModifiedAt'),
    objectType: { key: 'objectType', operator: 'EQ' },
    id: { key: 'id', operator: 'EQ' }
  };

  public static getAdvancedSearchForm(): FormGroup<CaHierarchyObjectSearchFields> {
    return new FormBuilder().group<CaHierarchyObjectSearchFields>({
      name: null,
      users: null,
      lastModifiedAt: new FormBuilder().group<FlSearchDateInterval>({
        from: [null],
        to: [null]
      }),
      objectType: null,
      id: null
    });
  }
}
