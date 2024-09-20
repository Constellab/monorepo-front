import { Type } from 'class-transformer';
import {
  FlFormInputsManagerConfig,
  FlSearchConverter,
  FlSearchDateInterval,
  FlSearchFilterCriteriaConverter,
  FlSearchSortCriteriaConverter
} from '@monorepo/front-core-lib';
import { CaUser } from '../../../model/entities/ca-user.class';
import { FormBuilder, FormGroup } from '@ngneat/reactive-forms';
import { CaActivityEntityType, CaActivityType } from '../../../model/entities/ca-activity.class';
import { CaSpace } from '../../../model/entities/space/ca-space.class';

export class CaActivitySearchFields {

  entityType: CaActivityEntityType;

  entityId: string;

  actionType: CaActivityType;

  entityName: string;

  @Type(() => FlSearchDateInterval)
  createdAt: FlSearchDateInterval;

  title: string;

  @Type(() => CaUser)
  user: CaUser;

  @Type(() => CaSpace)
  space: CaSpace;

  id: string;

  // specific search for folder
  includeSubFolders: boolean;
}

export class CaActivitySearch {

  public static searchManagerConfig: FlFormInputsManagerConfig<CaActivitySearchFields> = {
    entityType: 'activity_entity_type',
    entityId: 'activity_entity_id',
    actionType: 'activity_entity_name',
    entityName: 'activity_action_type',
    createdAt: 'creation_date',
    includeSubFolders: 'include_sub_folders'
  };

  public static filterConverter: FlSearchFilterCriteriaConverter<CaActivitySearchFields> = {
    entityType: {key: 'entityType', operator: 'IN'},
    entityId: {key: 'entityId', operator: 'EQ'},
    actionType: {key: 'actionType', operator: 'EQ'},
    entityName: {key: 'entityName', operator: 'CONTAINS'},
    createdAt: FlSearchConverter.dateInterval('createdAt'),
    title: {key: 'title', operator: 'CONTAINS'},
    user: {key: 'user.id', operator: 'EQ', convertValue: FlSearchConverter.getEntityId},
    space: {key: 'space.id', operator: 'EQ', convertValue: FlSearchConverter.getEntityId},
    id: {key: 'id', operator: 'EQ'},
    includeSubFolders: {key: 'includeSubFolders', operator: 'EQ'},
  };

  public static sortConverter: FlSearchSortCriteriaConverter = {
    entityType: ['entityType', 'actionType'],
    title: 'title',
    entityName: 'entityName',
    creation: 'createdAt',
  };

  public static getSearchForm(): FormGroup<CaActivitySearchFields> {
    return new FormBuilder().group<CaActivitySearchFields>({
      entityType: null,
      entityId: null,
      actionType: null,
      entityName: null,
      createdAt: new FormBuilder().group<FlSearchDateInterval>({
        from: [null],
        to: [null],
      }),
      title: null,
      user: null,
      space: null,
      id: null,
      includeSubFolders: null,
    });
  }
}
