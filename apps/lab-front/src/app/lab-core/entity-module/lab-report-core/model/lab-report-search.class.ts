import { Type } from 'class-transformer';
import {
  FlFormInputsManagerConfig,
  FlSearchConverter,
  FlSearchCriteriaConverter,
  FlSearchDateInterval,
  FlTag
} from '@monorepo/front-core-lib';
import { LabSearchConverter } from '../../../model/global/lab-search-converter.class';
import { FormBuilder, FormGroup } from '@ngneat/reactive-forms';
import { LabProject } from '../../../model/entities/lab-project.class';
import { LabUser } from '../../../model/entities/lab-user.entity';


export class LabReportSearchFields {
  title: string;
  @Type(() => LabProject)
  project: LabProject[];

  tags: FlTag[];

  @Type(() => LabUser)
  createdBy: LabUser;

  @Type(() => FlSearchDateInterval)
  createdAt: FlSearchDateInterval;

  @Type(() => FlSearchDateInterval)
  lastModifiedAt: FlSearchDateInterval;

  isNotValidated: boolean;
  isArchived: boolean;

  id: string;

}

export class LabReportSearch {
  /**
   * Const to configure Form Input Manager for advanced search
   */
  public static advancedSearchManagerConfig: FlFormInputsManagerConfig<LabReportSearchFields> = {
    title: 'title',
    tags: 'flTag.tags',
    project: 'biox.project',
    // group the creation date into one chip
    createdAt: 'creation_date',
    createdBy: 'created_by',
    lastModifiedAt: 'last_modified_date',
    isNotValidated: 'biox.report_is_not_validated',
    isArchived: 'is_archived',
  };


  /**
   * Convert used by the advanced search to convert the form result to list of {@link FlSearchCriteria}
   */
  public static advancedSearchConverter: FlSearchCriteriaConverter<LabReportSearchFields> = {
    title: {key: 'title', operator: 'CONTAINS'},
    tags: {key: 'tags', operator: 'EQ'},
    project: {key: 'project', operator: 'IN', convertValue: FlSearchConverter.getEntitiesId},
    // Date
    createdBy: {key: 'created_by', operator: 'EQ', convertValue: FlSearchConverter.getEntityId},
    createdAt: FlSearchConverter.dateInterval('created_at'),
    lastModifiedAt: FlSearchConverter.dateInterval('last_modified_at'),
    isNotValidated: {key: 'is_validated', operator: 'EQ', convertValue: LabSearchConverter.excludeAllOnCheck},
    isArchived: {key: 'is_archived', operator: 'EQ', convertValue: LabSearchConverter.includeAllOnCheck},
    id: {key: 'id', operator: 'EQ'},
  };


  public static getAdvancedSearchForm(): FormGroup<LabReportSearchFields> {
    return new FormBuilder().group(
      {
        title: [null],
        tags: [null],
        project: [null],
        createdBy: [null],
        createdAt: new FormBuilder().group<FlSearchDateInterval>({
          from: [null],
          to: [null],
        }),
        lastModifiedAt: new FormBuilder().group<FlSearchDateInterval>({
          from: [null],
          to: [null],
        }),
        isArchived: [null],
        isNotValidated: [null],
        id: [null],
      }
    );
  }
}
