import { CaSpaceType } from '../../../model/entities/space/ca-space.class';
import {
  FlFormInputsManagerConfig,
  FlSearchConverter,
  FlSearchDateInterval,
  FlSearchFilterCriteriaConverter,
  FlSearchSortCriteriaConverter
} from '@monorepo/front-core-lib';
import { FormBuilder, FormGroup } from '@ngneat/reactive-forms';
import { CaUser } from '../../../model/entities/ca-user.class';
import { Type } from 'class-transformer';

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
    name: {key: 'name', operator: 'MATCH'},
    domain: {key: 'domain', operator: 'MATCH'},
    type: {key: 'type', operator: 'EQ'},
    createdAt: FlSearchConverter.dateInterval('createdAt'),
    createdBy: {key: 'createdBy.id', operator: 'EQ', convertValue: FlSearchConverter.getEntityId},
    id: {key: 'id', operator: 'EQ'},
  };

  public static sortConverter: FlSearchSortCriteriaConverter = {
    name: 'name',
    type: 'type',
    created: 'createdAt',
    lastModified: 'lastModifiedAt',
  };

  public static getSearchForm(): FormGroup<CaSpaceSearchFields> {
    return new FormBuilder().group<CaSpaceSearchFields>({
      name: null,
      domain: null,
      type: null,
      createdAt: new FormBuilder().group<FlSearchDateInterval>({
        from: [null],
        to: [null],
      }),
      createdBy: null,
      id: null,
    });
  }
}
