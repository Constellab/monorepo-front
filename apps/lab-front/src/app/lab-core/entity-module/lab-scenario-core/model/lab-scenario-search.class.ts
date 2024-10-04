import {
  FlFormInputsManagerConfig,
  FlSearchConverter,
  FlSearchDateInterval,
  FlSearchFilterCriteriaConverter,
  FlSearchSortCriteriaConverter,
  FlTag
} from '@monorepo/front-core-lib';
import { LabScenarioCreationType, LabScenarioStatus } from '../../../model/entities/lab-scenario.entity';
import { Type } from 'class-transformer';
import { LabFolder } from '../../../model/entities/lab-folder.class';
import { LabSearchConverter } from '../../../model/global/lab-search-converter.class';
import { LabUser } from '../../../model/entities/lab-user.entity';
import { LabTypeEntity } from '../../../model/entities/lab-type/lab-type.entity';
import { FormBuilder, FormGroup } from '@angular/forms';


export class LabScenarioSearchFields {
  title: string;

  creationTypes: LabScenarioCreationType[];
  status: LabScenarioStatus;
  tags: FlTag[];

  @Type(() => LabFolder)
  folder: LabFolder[];

  @Type(() => FlSearchDateInterval)
  createdAt: FlSearchDateInterval;

  @Type(() => LabUser)
  createdBy: LabUser;

  @Type(() => FlSearchDateInterval)
  lastModifiedAt: FlSearchDateInterval;
  isNotValidated: boolean;
  isArchived: boolean;

  @Type(() => LabTypeEntity)
  processTypingName: LabTypeEntity;

  id: string;

}

export class LabScenarioSearch {
  /**
   * Const to configure Form Input Manager for advanced search
   */
  public static searchManagerConfig: FlFormInputsManagerConfig<LabScenarioSearchFields> = {
    creationTypes: 'biox.scenario_creation_type',
    tags: 'flTag.tags',
    folder: 'biox.folder',
    isArchived: 'is_archived',
    // group the creation date into one chip
    createdAt: 'creation_date',
    createdBy: 'created_by',
    lastModifiedAt: 'last_modified_date',
    isNotValidated: 'biox.scenario_is_not_validated',
    processTypingName: 'biox.contain_process'
  };


  /**
   * Convert used by the advanced search to convert the form result to list of {@link FlSearchCriteria}
   */
  public static filterConverter: FlSearchFilterCriteriaConverter<LabScenarioSearchFields> = {
    title: { key: 'title', operator: 'CONTAINS' },
    creationTypes: { key: 'creation_type', operator: 'IN' },
    status: { key: 'status', operator: 'IN' },
    tags: { key: 'tags', operator: 'EQ' },
    folder: { key: 'folder', operator: 'IN', convertValue: FlSearchConverter.getEntitiesId },
    // Date
    createdBy: { key: 'created_by', operator: 'EQ', convertValue: FlSearchConverter.getEntityId },
    createdAt: FlSearchConverter.dateInterval('created_at'),
    lastModifiedAt: FlSearchConverter.dateInterval('last_modified_at'),
    isArchived: { key: 'is_archived', operator: 'EQ', convertValue: LabSearchConverter.includeAllOnCheck },
    isNotValidated: { key: 'is_validated', operator: 'EQ', convertValue: LabSearchConverter.excludeAllOnCheck },
    processTypingName: {
      key: 'process_typing_name', operator: 'EQ',
      convertValue: (value: LabTypeEntity) => value?.typingName
    },
    id: { key: 'id', operator: 'EQ' }
  };

  public static sortConverter: FlSearchSortCriteriaConverter = {
    title: 'title',
    status: 'status',
    creationTypes: 'created_at',
    lastModification: 'last_modified_at'
  };

  public static getSearchForm(): FormGroup {
    return new FormBuilder().group(
      {
        title: [null],
        creationTypes: [null],
        status: [null],
        tags: [null],
        folder: [null],
        createdBy: [null],
        createdAt: new FormBuilder().group({
          from: [null],
          to: [null]
        }),
        lastModifiedAt: new FormBuilder().group({
          from: [null],
          to: [null]
        }),
        isArchived: [null],
        isNotValidated: [null],
        processTypingName: [null],
        id: [null]
      }
    );
  }

}
