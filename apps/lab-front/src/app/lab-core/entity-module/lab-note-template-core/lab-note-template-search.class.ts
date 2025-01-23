import { Type } from 'class-transformer';
import { FlFormInputsManagerConfig } from '@monorepo/front-core-lib/fl-form-inputs-manager';
import { FlSearchConverter } from '@monorepo/front-core-lib/fl-search';
import { FlSearchDateInterval } from '@monorepo/front-core-lib/fl-search';
import { FlSearchFilterCriteriaConverter } from '@monorepo/front-core-lib/fl-search';
import { FlSearchSortCriteriaConverter } from '@monorepo/front-core-lib/fl-search';

import { FormBuilder, FormGroup } from '@angular/forms';
import { LabUser } from '../../model/entities/lab-user.entity';

export class LabNoteTemplateSearchFields {
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

export class LabNoteTemplateSearch {
  /**
   * Const to configure Form Input Manager for advanced search
   */
  public static searchManagerConfig: FlFormInputsManagerConfig<LabNoteTemplateSearchFields> = {
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
  public static filterConverter: FlSearchFilterCriteriaConverter<LabNoteTemplateSearchFields> = {
    title: { key: 'title', operator: 'CONTAINS' },
    createdBy: { key: 'created_by', operator: 'EQ', convertValue: FlSearchConverter.getEntityId },
    createdAt: FlSearchConverter.dateInterval('created_at'),
    lastModifiedAt: FlSearchConverter.dateInterval('last_modified_at'),
    lastModifiedBy: { key: 'last_modified_by', operator: 'EQ', convertValue: FlSearchConverter.getEntityId },
    id: { key: 'id', operator: 'EQ' },
  };

  public static sortConverter: FlSearchSortCriteriaConverter = {
    title: 'title',
    creation: 'created_at',
    lastModification: 'last_modified_at',
  };

  public static getSearchForm(): FormGroup {
    return new FormBuilder().group({
      title: [null],
      createdBy: [null],
      createdAt: new FormBuilder().group({
        from: [null],
        to: [null],
      }),
      lastModifiedBy: [null],
      lastModifiedAt: new FormBuilder().group({
        from: [null],
        to: [null],
      }),
      id: [null],
    });
  }
}
