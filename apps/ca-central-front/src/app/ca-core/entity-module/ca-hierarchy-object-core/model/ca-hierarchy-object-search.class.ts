import { Type } from 'class-transformer';
import { CaUser } from '../../../model/entities/ca-user.class';
import {
  FlFormInputsManagerConfig,
  FlSearchConverter,
  FlSearchDateInterval,
  FlSearchFilterCriteriaConverter,
  FlSearchSortCriteriaConverter
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

  public static searchManagerConfig: FlFormInputsManagerConfig<CaHierarchyObjectSearchFields> = {
    name: 'name',
    lastModifiedAt: 'date'
  };

  public static filterConverter: FlSearchFilterCriteriaConverter<CaHierarchyObjectSearchFields> = {
    name: { key: 'name', operator: 'MATCH' },
    users: { key: 'user.id', operator: 'IN', convertValue: FlSearchConverter.getEntitiesId },
    lastModifiedAt: FlSearchConverter.dateInterval('lastModifiedAt'),
    objectType: { key: 'objectType', operator: 'EQ' },
    id: { key: 'id', operator: 'EQ' }
  };

  public static sortConverter: FlSearchSortCriteriaConverter = {
    name: 'name',
    lastModifiedAt: 'lastModifiedAt',
    user: ['user.firstname', 'user.lastname']
  };

  public static getSearchForm(): FormGroup<CaHierarchyObjectSearchFields> {
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
