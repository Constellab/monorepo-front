import { Type } from 'class-transformer';
import {
  FlFormInputsManagerConfig,
  FlSearchConverter,
  FlSearchCriteriaConverter,
  FlSearchDateInterval
} from '@monorepo/front-core-lib';
import { FormBuilder, FormGroup } from '@ngneat/reactive-forms';
import { LabUser } from '../../model/entities/lab-user.entity';


export class LabDocumentTemplateSearchFields {
  title: string;

  @Type(() => LabUser)
  createdBy: LabUser;

  @Type(() => LabUser)
  lastModifiedBy: LabUser;

  @Type(() => FlSearchDateInterval)
  createdAt: FlSearchDateInterval;

  @Type(() => FlSearchDateInterval)
  lastModifiedAt: FlSearchDateInterval;


  id: string;

}

export class LabDocumentTemplateSearch {
  /**
   * Const to configure Form Input Manager for advanced search
   */
  public static advancedSearchManagerConfig: FlFormInputsManagerConfig<LabDocumentTemplateSearchFields> = {
    title: 'title',
    // group the creation date into one chip
    createdAt: 'creation_date',
    createdBy: 'created_by',
    lastModifiedAt: 'last_modified_date',
    lastModifiedBy: 'last_modified_by',
  };


  /**
   * Convert used by the advanced search to convert the form result to list of {@link FlSearchCriteria}
   */
  public static advancedSearchConverter: FlSearchCriteriaConverter<LabDocumentTemplateSearchFields> = {
    title: {key: 'title', operator: 'CONTAINS'},
    createdBy: {key: 'created_by', operator: 'EQ', convertValue: FlSearchConverter.getEntityId},
    createdAt: FlSearchConverter.dateInterval('created_at'),
    lastModifiedAt: FlSearchConverter.dateInterval('last_modified_at'),
    lastModifiedBy: {key: 'last_modified_by', operator: 'EQ', convertValue: FlSearchConverter.getEntityId},
    id: {key: 'id', operator: 'EQ'},
  };


  public static getAdvancedSearchForm(): FormGroup<LabDocumentTemplateSearchFields> {
    return new FormBuilder().group(
      {
        title: [null],
        createdBy: [null],
        createdAt: new FormBuilder().group<FlSearchDateInterval>({
          from: [null],
          to: [null],
        }),
        lastModifiedBy: [null],
        lastModifiedAt: new FormBuilder().group<FlSearchDateInterval>({
          from: [null],
          to: [null],
        }),
        id: [null],
      }
    );
  }
}
