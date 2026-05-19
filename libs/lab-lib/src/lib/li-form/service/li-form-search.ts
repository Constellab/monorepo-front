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

import { LiFormStatus } from '../../li-core/model/entities/form/li-form.enum';
import { LiFormTemplate } from '../../li-core/model/entities/form/li-form-template.entity';
import { LiUser } from '../../li-core/model/entities/li-user.entity';
import { LiSearchConverter } from '../../li-core/model/global/li-search-converter.class';

export class LiFormSearchFields {
  name: string;

  tags: FlTag[];

  status: LiFormStatus;

  @Type(() => LiUser)
  createdBy: LiUser;

  @Type(() => LiFormTemplate)
  templateId: LiFormTemplate;

  @Type(() => FlSearchDateInterval)
  createdAt: FlSearchDateInterval;

  isArchived: boolean;
}

export type LiFormSearchFieldsDisabled = Partial<Record<keyof LiFormSearchFields, boolean>>;

export class LiFormSearch {
  public static searchManagerConfig: FlFormInputsManagerConfig<LiFormSearchFields> = {
    name: 'li.name',
    tags: 'flTag.tags',
    status: 'li.status',
    createdBy: 'li.created_by',
    templateId: 'li.form_template',
    createdAt: 'li.creation_date',
    isArchived: 'li.is_archived',
  };

  public static filterConverter: FlSearchFilterCriteriaConverter<LiFormSearchFields> = {
    name: { key: 'name', operator: 'CONTAINS' },
    tags: { key: 'tags', operator: 'EQ' },
    status: { key: 'status', operator: 'EQ' },
    createdBy: { key: 'created_by', operator: 'EQ', convertValue: FlSearchConverter.getEntityId },
    templateId: {
      key: 'template_id',
      operator: 'EQ',
      convertValue: FlSearchConverter.getEntityId,
    },
    createdAt: FlSearchConverter.dateInterval('created_at'),
    isArchived: { key: 'is_archived', operator: 'EQ', convertValue: LiSearchConverter.includeAllOnCheck },
  };

  public static sortConverter: FlSearchSortCriteriaConverter = {
    name: 'name',
    status: 'status',
    creation: 'created_at',
    lastModification: 'last_modified_at',
  };

  public static getSearchForm(): FormGroup {
    return new FormBuilder().group({
      name: [null],
      tags: [null],
      status: [null],
      createdBy: [null],
      templateId: [null],
      createdAt: new FormBuilder().group({
        from: [null],
        to: [null],
      }),
      isArchived: [null],
    });
  }
}
