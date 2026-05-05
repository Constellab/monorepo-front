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

import { LiUser } from '../../li-core/model/entities/li-user.entity';
import { LiSearchConverter } from '../../li-core/model/global/li-search-converter.class';

export class LiFormTemplateSearchFields {
  name: string;

  tags: FlTag[];

  @Type(() => LiUser)
  createdBy: LiUser;

  @Type(() => FlSearchDateInterval)
  createdAt: FlSearchDateInterval;

  isArchived: boolean;
}

export class LiFormTemplateSearch {
  public static searchManagerConfig: FlFormInputsManagerConfig<LiFormTemplateSearchFields> = {
    name: 'li.name',
    tags: 'flTag.tags',
    createdBy: 'li.created_by',
    createdAt: 'li.creation_date',
    isArchived: 'li.is_archived',
  };

  public static filterConverter: FlSearchFilterCriteriaConverter<LiFormTemplateSearchFields> = {
    name: { key: 'name', operator: 'CONTAINS' },
    tags: { key: 'tags', operator: 'EQ' },
    createdBy: { key: 'created_by', operator: 'EQ', convertValue: FlSearchConverter.getEntityId },
    createdAt: FlSearchConverter.dateInterval('created_at'),
    isArchived: { key: 'is_archived', operator: 'EQ', convertValue: LiSearchConverter.includeAllOnCheck },
  };

  public static sortConverter: FlSearchSortCriteriaConverter = {
    name: 'name',
    creation: 'created_at',
    lastModification: 'last_modified_at',
  };

  public static getSearchForm(): FormGroup {
    return new FormBuilder().group({
      name: [null],
      tags: [null],
      createdBy: [null],
      createdAt: new FormBuilder().group({
        from: [null],
        to: [null],
      }),
      isArchived: [null],
    });
  }
}
