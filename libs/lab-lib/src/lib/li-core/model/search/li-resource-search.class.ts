import { FormBuilder, FormGroup } from '@angular/forms';
import { FlFormInputsManagerConfig } from '@monorepo/front-core-lib/fl-form-inputs-manager';
import {
  FlSearchConverter,
  FlSearchDateInterval,
  FlSearchFilterCriteriaConverter,
  FlSearchSortCriteriaConverter,
} from '@monorepo/front-core-lib/fl-search';
import { FlTag } from '@monorepo/front-core-lib/fl-tag';
import { Type } from 'class-transformer';

import { LiFolder } from '../entities/li-folder.class';
import { LiScenario } from '../entities/li-scenario.entity';
import { LiTypeEntity } from '../entities/li-type/li-type.entity';
import { LiUser } from '../entities/li-user.entity';
import { LiResourceOrigin } from '../entities/resource/li-resource.entity';
import { LiSearchConverter } from '../global/li-search-converter.class';

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

  // ONLY FOR TABLE RESOURCE
  columnTags: FlTag[];

  id: string;
}

/**
 * Type to indicate which fields are disabled in the advanced search form
 */
export type LiResourceSearchFieldsDisabled = Partial<Record<keyof LiResourceSearchFields, boolean>>;

export class LiResourceSearch {
  /**
   * Const to configure Form Input Manager for advanced search
   */
  public static searchManagerConfig: FlFormInputsManagerConfig<LiResourceSearchFields> = {
    name: 'li.name',
    resourceTypingName: 'li.resource_type',
    resourceTypingNames: 'li.resource_type',
    tags: 'flTag.tags',
    origin: 'li.resource_origin',
    data: 'li.resource_data',
    scenario: 'li.scenario',
    isArchived: 'is_archived',
    // group the creation date into one chip
    createdAt: 'li.creation_date',
    createdBy: 'li.created_by',
    folder: 'li.folder',
    includeChildrenResource: 'li.resource_include_children_short',
    includeNotFlagged: 'li.include_not_flagged_short',
    generatedByProcess: 'li.generated_by_process',
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
    columnTags: { key: 'column_tags', operator: 'EQ' },
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
      columnTags: [null],
      id: [null],
      generatedByProcess: [null],
    });
  }
}
