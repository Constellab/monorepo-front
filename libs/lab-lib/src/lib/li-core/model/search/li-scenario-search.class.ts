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
import { LiScenarioCreationType, LiScenarioStatus } from '../entities/li-scenario.entity';
import { LiSearchConverter } from '../global/li-search-converter.class';
import { LiTypeEntity } from '../entities/li-type/li-type.entity';
import { LiUser } from '../entities/li-user.entity';
import { Type } from 'class-transformer';

export class LiScenarioSearchFields {
  title: string;

  creationTypes: LiScenarioCreationType[];
  status: LiScenarioStatus;
  tags: FlTag[];

  @Type(() => LiFolder)
  folder: LiFolder[];

  @Type(() => FlSearchDateInterval)
  createdAt: FlSearchDateInterval;

  @Type(() => LiUser)
  createdBy: LiUser;

  @Type(() => FlSearchDateInterval)
  lastModifiedAt: FlSearchDateInterval;
  isNotValidated: boolean;
  isArchived: boolean;

  @Type(() => LiTypeEntity)
  processTypingName: LiTypeEntity;

  id: string;
}

export class LiScenarioSearch {
  /**
   * Const to configure Form Input Manager for advanced search
   */
  public static searchManagerConfig: FlFormInputsManagerConfig<LiScenarioSearchFields> = {
    creationTypes: 'li.scenario_creation_type',
    tags: 'flTag.tags',
    folder: 'li.folder',
    isArchived: 'li.is_archived',
    // group the creation date into one chip
    createdAt: 'li.creation_date',
    createdBy: 'li.created_by',
    lastModifiedAt: 'li.last_modified_date',
    isNotValidated: 'li.scenario_is_not_validated',
    processTypingName: 'li.contain_process',
  };

  /**
   * Convert used by the advanced search to convert the form result to list of {@link FlSearchCriteria}
   */
  public static filterConverter: FlSearchFilterCriteriaConverter<LiScenarioSearchFields> = {
    title: { key: 'title', operator: 'CONTAINS' },
    creationTypes: { key: 'creation_type', operator: 'IN' },
    status: { key: 'status', operator: 'IN' },
    tags: { key: 'tags', operator: 'EQ' },
    folder: { key: 'folder', operator: 'IN', convertValue: FlSearchConverter.getEntitiesId },
    // Date
    createdBy: { key: 'created_by', operator: 'EQ', convertValue: FlSearchConverter.getEntityId },
    createdAt: FlSearchConverter.dateInterval('created_at'),
    lastModifiedAt: FlSearchConverter.dateInterval('last_modified_at'),
    isArchived: { key: 'is_archived', operator: 'EQ', convertValue: LiSearchConverter.includeAllOnCheck },
    isNotValidated: {
      key: 'is_validated',
      operator: 'EQ',
      convertValue: LiSearchConverter.excludeAllOnCheck,
    },
    processTypingName: {
      key: 'process_typing_name',
      operator: 'EQ',
      convertValue: (value: LiTypeEntity) => value?.typingName,
    },
    id: { key: 'id', operator: 'EQ' },
  };

  public static sortConverter: FlSearchSortCriteriaConverter = {
    title: 'title',
    status: 'status',
    creationTypes: 'created_at',
    lastModification: 'last_modified_at',
  };

  public static getSearchForm(): FormGroup {
    return new FormBuilder().group({
      title: [null],
      creationTypes: [null],
      status: [null],
      tags: [null],
      folder: [null],
      createdBy: [null],
      createdAt: new FormBuilder().group({
        from: [null],
        to: [null],
      }),
      lastModifiedAt: new FormBuilder().group({
        from: [null],
        to: [null],
      }),
      isArchived: [null],
      isNotValidated: [null],
      processTypingName: [null],
      id: [null],
    });
  }
}
