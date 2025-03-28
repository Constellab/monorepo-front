import { FlFormInputsManagerConfig } from '@monorepo/front-core-lib/fl-form-inputs-manager';
import {
  FlSearchConverter,
  FlSearchDateInterval,
  FlSearchFilterCriteriaConverter,
  FlSearchSortCriteriaConverter,
} from '@monorepo/front-core-lib/fl-search';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LiUser } from '../entities/li-user.entity';
import { Type } from 'class-transformer';

export class LiNoteTemplateSearchFields {
  title: string;

  @Type(() => LiUser)
  createdBy: LiUser;

  @Type(() => LiUser)
  lastModifiedBy: LiUser;

  @Type(() => FlSearchDateInterval)
  createdAt: FlSearchDateInterval;

  @Type(() => FlSearchDateInterval)
  lastModifiedAt: FlSearchDateInterval;

  id: string;
}

export class LiNoteTemplateSearch {
  /**
   * Const to configure Form Input Manager for advanced search
   */
  public static searchManagerConfig: FlFormInputsManagerConfig<LiNoteTemplateSearchFields> = {
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
  public static filterConverter: FlSearchFilterCriteriaConverter<LiNoteTemplateSearchFields> = {
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
