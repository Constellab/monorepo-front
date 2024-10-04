import {
  FlFormInputsManagerConfig,
  FlSearchConverter,
  FlSearchDateInterval,
  FlSearchFilterCriteriaConverter,
  FlSearchSortCriteriaConverter,
  FlTag
} from '@monorepo/front-core-lib';
import { Type } from 'class-transformer';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LabUser } from '../../../model/entities/lab-user.entity';


export class LabProtocolTemplateSearchFields {
  name: string;

  tags: FlTag[];

  @Type(() => FlSearchDateInterval)
  createdAt: FlSearchDateInterval;

  @Type(() => LabUser)
  createdBy: LabUser;

  @Type(() => FlSearchDateInterval)
  lastModifiedAt: FlSearchDateInterval;

  id: string;
}

export class LabProtocolTemplateSearch {
  /**
   * Const to configure Form Input Manager for advanced search
   */
  public static searchManagerConfig: FlFormInputsManagerConfig<LabProtocolTemplateSearchFields> = {
    name: 'name',
    tags: 'flTag.tags',
    // group the creation date into one chip
    createdAt: 'creation_date',
    createdBy: 'created_by',
    lastModifiedAt: 'last_modified_date',
  };


  /**
   * Convert used by the advanced search to convert the form result to list of {@link FlSearchCriteria}
   */
  public static filterConverter: FlSearchFilterCriteriaConverter<LabProtocolTemplateSearchFields> = {
    name: {key: 'name', operator: 'CONTAINS'},
    tags: {key: 'tags', operator: 'EQ'},
    // Date
    createdBy: {key: 'created_by', operator: 'EQ', convertValue: FlSearchConverter.getEntityId},
    createdAt: FlSearchConverter.dateInterval('created_at'),
    lastModifiedAt: FlSearchConverter.dateInterval('last_modified_at'),
    id: {key: 'id', operator: 'EQ'},
  };

  public static sortConverter: FlSearchSortCriteriaConverter = {
    name: 'name',
    creation: 'created_at',
    lastModification: 'last_modified_at',
  };

  public static getSearchForm(): FormGroup {
    return new FormBuilder().group(
      {
        name: [null],
        tags: [null],
        createdBy: [null],
        createdAt: new FormBuilder().group({
          from: [null],
          to: [null],
        }),
        lastModifiedAt: new FormBuilder().group({
          from: [null],
          to: [null],
        }),
        id: [null],
      }
    );
  }

}
