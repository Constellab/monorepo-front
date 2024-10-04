import {
  FlFormInputsManagerConfig,
  FlSearchConverter,
  FlSearchDateInterval,
  FlSearchFilterCriteriaConverter,
  FlSearchSortCriteriaConverter,
  FlTag
} from '@monorepo/front-core-lib';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LabSearchConverter } from '../../../model/global/lab-search-converter.class';
import { Type } from 'class-transformer';
import { LabResourceOrigin } from '../../../model/entities/resource/lab-resource.entity';
import { LabExperiment } from '../../../model/entities/lab-experiment.entity';
import { LabFolder } from '../../../model/entities/lab-folder.class';
import { LabUser } from '../../../model/entities/lab-user.entity';
import { LabTypeEntity } from '../../../model/entities/lab-type/lab-type.entity';

/**
 * Format of the data for the Advanced search form of the resource
 */
export class LabResourceSearchFields {
  @Type(() => LabTypeEntity)
  resourceTypingName: LabTypeEntity;

  // hidden field to search for multiple resource types
  resourceTypingNames: string[];
  name: string;
  tags: FlTag[];
  origin: LabResourceOrigin;
  data: string;
  experiment: LabExperiment;

  @Type(() => FlSearchDateInterval)
  createdAt: FlSearchDateInterval;

  @Type(() => LabUser)
  createdBy: LabUser;
  folder: LabFolder[];

  isArchived: boolean;
  includeChildrenResource: boolean;
  includeNotFlagged: boolean;

  @Type(() => LabTypeEntity)
  generatedByProcess: LabTypeEntity;

  id: string;
}


export class LabResourceSearch {

  /**
   * Const to configure Form Input Manager for advanced search
   */
  public static searchManagerConfig: FlFormInputsManagerConfig<LabResourceSearchFields> = {
    resourceTypingName: 'resource_type',
    resourceTypingNames: 'resource_type',
    tags: 'flTag.tags',
    origin: 'resource_origin',
    data: 'resource_data',
    experiment: 'biox.experiment',
    isArchived: 'is_archived',
    // group the creation date into one chip
    createdAt: 'creation_date',
    createdBy: 'created_by',
    folder: 'biox.folder',
    includeChildrenResource: 'resource_include_children_short',
    includeNotFlagged: 'biox.include_not_flagged_short',
    generatedByProcess: 'biox.generated_by_process'
  };


  /**
   * Convert used by the advanced search to convert the form result to list of {@link FlSearchCriteria}
   */
  public static filterConverter: FlSearchFilterCriteriaConverter<LabResourceSearchFields> = {
    resourceTypingName: {
      key: 'resource_typing_name',
      operator: 'EQ',
      convertValue: (value: LabTypeEntity) => value?.typingName
    },
    resourceTypingNames: { key: 'resource_typing_names', operator: 'IN' },
    name: { key: 'name', operator: 'CONTAINS' },
    tags: { key: 'tags', operator: 'EQ' },
    origin: { key: 'origin', operator: 'EQ' },
    data: { key: 'data', operator: 'MATCH' },
    experiment: { key: 'experiment', operator: 'EQ', convertValue: FlSearchConverter.getEntityId },
    // Date
    createdAt: FlSearchConverter.dateInterval('created_at'),
    createdBy: { key: 'created_by', operator: 'EQ', convertValue: FlSearchConverter.getEntityId },
    folder: { key: 'folder', operator: 'IN', convertValue: FlSearchConverter.getEntitiesId },
    isArchived: { key: 'is_archived', operator: 'EQ', convertValue: LabSearchConverter.includeAllOnCheck },
    includeChildrenResource: {
      key: 'include_children_resource',
      operator: 'EQ'
    },
    includeNotFlagged: {
      key: 'include_not_flagged',
      operator: 'EQ'
    },
    id: { key: 'id', operator: 'EQ' },
    generatedByProcess: {
      key: 'generated_by_task', operator: 'EQ',
      convertValue: (value: LabTypeEntity) => value?.typingName
    }
  };

  public static sortConverter: FlSearchSortCriteriaConverter = {
    name: 'name',
    creation: 'created_at',
    lastModification: 'last_modified_at',
    type: 'resource_typing_name'
  };


  public static getSearchForm(): FormGroup {
    return new FormBuilder().group(
      {
        resourceTypingName: [null],
        resourceTypingNames: [null],
        name: [null],
        tags: [null],
        origin: [null],
        data: [null],
        experiment: [null],
        createdAt: new FormBuilder().group({
          from: [null],
          to: [null]
        }),
        createdBy: [null],
        folder: [null],
        isArchived: [null],
        includeChildrenResource: [null],
        includeNotFlagged: [null],
        id: [null],
        generatedByProcess: [null]
      }
    );
  }


}
