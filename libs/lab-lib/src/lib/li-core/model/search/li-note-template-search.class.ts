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

import { LiFormTemplate } from '../entities/form/li-form-template.entity';
import { LiUser } from '../entities/li-user.entity';

export class LiNoteTemplateSearchFields {
  title: string;

  tags: FlTag[];

  @Type(() => LiUser)
  createdBy: LiUser;

  @Type(() => LiUser)
  lastModifiedBy: LiUser;

  @Type(() => FlSearchDateInterval)
  createdAt: FlSearchDateInterval;

  @Type(() => FlSearchDateInterval)
  lastModifiedAt: FlSearchDateInterval;

  @Type(() => LiFormTemplate)
  formTemplateId: LiFormTemplate;

  id: string;
}

export type LiNoteTemplateSearchFieldsDisabled = Partial<Record<keyof LiNoteTemplateSearchFields, boolean>>;

export class LiNoteTemplateSearch {
  /**
   * Const to configure Form Input Manager for advanced search
   */
  public static searchManagerConfig: FlFormInputsManagerConfig<LiNoteTemplateSearchFields> = {
    title: 'li.title',
    tags: 'flTag.tags',
    // group the creation date into one chip
    createdAt: 'li.creation_date',
    createdBy: 'li.created_by',
    lastModifiedAt: 'last_modified_date',
    lastModifiedBy: 'last_modified_by',
    formTemplateId: 'li.form_template',
  };

  /**
   * Convert used by the advanced search to convert the form result to list of {@link FlSearchCriteria}
   */
  public static filterConverter: FlSearchFilterCriteriaConverter<LiNoteTemplateSearchFields> = {
    title: { key: 'title', operator: 'CONTAINS' },
    tags: { key: 'tags', operator: 'EQ' },
    createdBy: { key: 'created_by', operator: 'EQ', convertValue: FlSearchConverter.getEntityId },
    createdAt: FlSearchConverter.dateInterval('created_at'),
    lastModifiedAt: FlSearchConverter.dateInterval('last_modified_at'),
    lastModifiedBy: { key: 'last_modified_by', operator: 'EQ', convertValue: FlSearchConverter.getEntityId },
    formTemplateId: {
      key: 'form_template_id',
      operator: 'EQ',
      convertValue: FlSearchConverter.getEntityId,
    },
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
      tags: [null],
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
      formTemplateId: [null],
      id: [null],
    });
  }
}
