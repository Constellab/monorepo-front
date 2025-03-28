import { FlFormInputsManagerConfig } from '@monorepo/front-core-lib/fl-form-inputs-manager';
import {
  FlSearchConverter,
  FlSearchDateInterval,
  FlSearchFilterCriteriaConverter,
  FlSearchSortCriteriaConverter,
} from '@monorepo/front-core-lib/fl-search';
import { FlTag } from '@monorepo/front-core-lib/fl-tag';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LiFolder } from '../entities/li-folder.class';
import { LiResourceOrigin } from '../entities/resource/li-resource.entity';
import { LiScenario } from '../entities/li-scenario.entity';
import { LiSearchConverter } from '../global/li-search-converter.class';
import { LiTypeEntity } from '../entities/li-type/li-type.entity';
import { LiUser } from '../entities/li-user.entity';
import { Type } from 'class-transformer';

/**
 * Format of the data for the Advanced search form of the resource
 */
export class LiResourceSearchFields {
  @Type(() => LiTypeEntity)
  resourceTypingName: LiTypeEntity;

  // hidden field to search for multiple resource types
  resourceTypingNames: string[];
  name: string;
  tags: FlTag[];
  origin: LiResourceOrigin;
  data: string;
  scenario: LiScenario;

  @Type(() => FlSearchDateInterval)
  createdAt: FlSearchDateInterval;

  @Type(() => LiUser)
  createdBy: LiUser;
  folder: LiFolder[];

  isArchived: boolean;
  includeChildrenResource: boolean;
  includeNotFlagged: boolean;

  @Type(() => LiTypeEntity)
  generatedByProcess: LiTypeEntity;

  id: string;
}

export class LiResourceSearch {
  /**
   * Const to configure Form Input Manager for advanced search
   */
  public static searchManagerConfig: FlFormInputsManagerConfig<LiResourceSearchFields> = {
    resourceTypingName: 'resource_type',
    resourceTypingNames: 'resource_type',
    tags: 'flTag.tags',
    origin: 'resource_origin',
    data: 'resource_data',
    scenario: 'biox.scenario',
    isArchived: 'is_archived',
    // group the creation date into one chip
    createdAt: 'creation_date',
    createdBy: 'created_by',
    folder: 'biox.folder',
    includeChildrenResource: 'resource_include_children_short',
    includeNotFlagged: 'biox.include_not_flagged_short',
    generatedByProcess: 'biox.generated_by_process',
  };

  /**
   * Convert used by the advanced search to convert the form result to list of {@link FlSearchCriteria}
   */
  public static filterConverter: FlSearchFilterCriteriaConverter<LiResourceSearchFields> = {
    resourceTypingName: {
      key: 'resource_typing_name',
      operator: 'EQ',
      convertValue: (value: LiTypeEntity) => value?.typingName,
    },
    resourceTypingNames: { key: 'resource_typing_names', operator: 'IN' },
    name: { key: 'name', operator: 'CONTAINS' },
    tags: { key: 'tags', operator: 'EQ' },
    origin: { key: 'origin', operator: 'EQ' },
    data: { key: 'data', operator: 'MATCH' },
    scenario: { key: 'scenario', operator: 'EQ', convertValue: FlSearchConverter.getEntityId },
    // Date
    createdAt: FlSearchConverter.dateInterval('created_at'),
    createdBy: { key: 'created_by', operator: 'EQ', convertValue: FlSearchConverter.getEntityId },
    folder: { key: 'folder', operator: 'IN', convertValue: FlSearchConverter.getEntitiesId },
    isArchived: { key: 'is_archived', operator: 'EQ', convertValue: LiSearchConverter.includeAllOnCheck },
    includeChildrenResource: {
      key: 'include_children_resource',
      operator: 'EQ',
    },
    includeNotFlagged: {
      key: 'include_not_flagged',
      operator: 'EQ',
    },
    id: { key: 'id', operator: 'EQ' },
    generatedByProcess: {
      key: 'generated_by_task',
      operator: 'EQ',
      convertValue: (value: LiTypeEntity) => value?.typingName,
    },
  };

  public static sortConverter: FlSearchSortCriteriaConverter = {
    name: 'name',
    creation: 'created_at',
    lastModification: 'last_modified_at',
    type: 'resource_typing_name',
  };

  public static getSearchForm(): FormGroup {
    return new FormBuilder().group({
      resourceTypingName: [null],
      resourceTypingNames: [null],
      name: [null],
      tags: [null],
      origin: [null],
      data: [null],
      scenario: [null],
      createdAt: new FormBuilder().group({
        from: [null],
        to: [null],
      }),
      createdBy: [null],
      folder: [null],
      isArchived: [null],
      includeChildrenResource: [null],
      includeNotFlagged: [null],
      id: [null],
      generatedByProcess: [null],
    });
  }
}
