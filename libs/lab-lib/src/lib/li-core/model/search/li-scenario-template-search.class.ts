import { FlFormInputsManagerConfig } from '@monorepo/front-core-lib/fl-form-inputs-manager';
import {
  FlSearchConverter,
  FlSearchDateInterval,
  FlSearchFilterCriteriaConverter,
  FlSearchSortCriteriaConverter,
} from '@monorepo/front-core-lib/fl-search';
import { FlTag } from '@monorepo/front-core-lib/fl-tag';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LiUser } from '../entities/li-user.entity';
import { Type } from 'class-transformer';

export class LiScenarioTemplateSearchFields {
  name: string;

  tags: FlTag[];

  @Type(() => FlSearchDateInterval)
  createdAt: FlSearchDateInterval;

  @Type(() => LiUser)
  createdBy: LiUser;

  @Type(() => FlSearchDateInterval)
  lastModifiedAt: FlSearchDateInterval;

  id: string;
}

export class LiScenarioTemplateSearch {
  /**
   * Const to configure Form Input Manager for advanced search
   */
  public static searchManagerConfig: FlFormInputsManagerConfig<LiScenarioTemplateSearchFields> = {
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
  public static filterConverter: FlSearchFilterCriteriaConverter<LiScenarioTemplateSearchFields> = {
    name: { key: 'name', operator: 'CONTAINS' },
    tags: { key: 'tags', operator: 'EQ' },
    // Date
    createdBy: { key: 'created_by', operator: 'EQ', convertValue: FlSearchConverter.getEntityId },
    createdAt: FlSearchConverter.dateInterval('created_at'),
    lastModifiedAt: FlSearchConverter.dateInterval('last_modified_at'),
    id: { key: 'id', operator: 'EQ' },
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
      lastModifiedAt: new FormBuilder().group({
        from: [null],
        to: [null],
      }),
      id: [null],
    });
  }
}
