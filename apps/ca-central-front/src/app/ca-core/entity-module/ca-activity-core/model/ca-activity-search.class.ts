import { Type } from 'class-transformer';
import { FlFormInputsManagerConfig } from '@monorepo/front-core-lib/fl-form-inputs-manager';
import {
  FlSearchConverter,
  FlSearchDateInterval,
  FlSearchFilterCriteriaConverter,
  FlSearchSortCriteriaConverter,
} from '@monorepo/front-core-lib/fl-search';

import { CaUser } from '../../../model/entities/ca-user.class';
import { FormBuilder, FormGroup } from '@angular/forms';
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
    entityType: { text: 'activity_entity_type', translateText: true },
    entityId: { text: 'activity_entity_id', translateText: true },
    actionType: { text: 'activity_entity_name', translateText: true },
    entityName: { text: 'activity_action_type', translateText: true },
    createdAt: { text: 'creation_date', translateText: true },
    includeSubFolders: { text: 'include_sub_folders', translateText: true },
  };

  public static filterConverter: FlSearchFilterCriteriaConverter<CaActivitySearchFields> = {
    entityType: { key: 'entityType', operator: 'IN' },
    entityId: { key: 'entityId', operator: 'EQ' },
    actionType: { key: 'actionType', operator: 'EQ' },
    entityName: { key: 'entityName', operator: 'CONTAINS' },
    createdAt: FlSearchConverter.dateInterval('createdAt'),
    title: { key: 'title', operator: 'CONTAINS' },
    user: { key: 'user.id', operator: 'EQ', convertValue: FlSearchConverter.getEntityId },
    space: { key: 'space.id', operator: 'EQ', convertValue: FlSearchConverter.getEntityId },
    id: { key: 'id', operator: 'EQ' },
    includeSubFolders: { key: 'includeSubFolders', operator: 'EQ' },
  };

  public static sortConverter: FlSearchSortCriteriaConverter = {
    entityType: ['entityType', 'actionType'],
    title: 'title',
    entityName: 'entityName',
    creation: 'createdAt',
  };

  public static getSearchForm(): FormGroup {
    return new FormBuilder().group({
      entityType: null,
      entityId: null,
      actionType: null,
      entityName: null,
      createdAt: new FormBuilder().group({
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
