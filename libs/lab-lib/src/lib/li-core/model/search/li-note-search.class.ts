import { FlFormInputsManagerConfig } from '@monorepo/front-core-lib/fl-form-inputs-manager';
import {
  FlSearchConverter,
  FlSearchDateInterval,
  FlSearchFilterCriteriaConverter,
  FlSearchSortCriteriaConverter,
} from '@monorepo/front-core-lib/fl-search';
import { FlTag } from '@monorepo/front-core-lib/fl-tag';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LiFolder } from '../entities/li-folder.class';
import { LiSearchConverter } from '../global/li-search-converter.class';
import { LiUser } from '../entities/li-user.entity';
import { Type } from 'class-transformer';

export class LiNoteSearchFields {
  title: string;
  @Type(() => LiFolder)
  folder: LiFolder[];

  tags: FlTag[];

  @Type(() => LiUser)
  createdBy: LiUser;

  @Type(() => FlSearchDateInterval)
  createdAt: FlSearchDateInterval;

  @Type(() => FlSearchDateInterval)
  lastModifiedAt: FlSearchDateInterval;

  isNotValidated: boolean;
  isArchived: boolean;

  id: string;
}

export class LiNoteSearch {
  /**
   * Const to configure Form Input Manager for advanced search
   */
  public static searchManagerConfig: FlFormInputsManagerConfig<LiNoteSearchFields> = {
    title: 'li.title',
    tags: 'flTag.tags',
    folder: 'li.folder',
    // group the creation date into one chip
    createdAt: 'li.creation_date',
    createdBy: 'li.created_by',
    lastModifiedAt: 'li.last_modified_date',
    isNotValidated: 'li.note_is_not_validated',
    isArchived: 'li.is_archived',
  };

  /**
   * Convert used by the advanced search to convert the form result to list of {@link FlSearchCriteria}
   */
  public static filterConverter: FlSearchFilterCriteriaConverter<LiNoteSearchFields> = {
    title: { key: 'title', operator: 'CONTAINS' },
    tags: { key: 'tags', operator: 'EQ' },
    folder: { key: 'folder', operator: 'IN', convertValue: FlSearchConverter.getEntitiesId },
    // Date
    createdBy: { key: 'created_by', operator: 'EQ', convertValue: FlSearchConverter.getEntityId },
    createdAt: FlSearchConverter.dateInterval('created_at'),
    lastModifiedAt: FlSearchConverter.dateInterval('last_modified_at'),
    isNotValidated: {
      key: 'is_validated',
      operator: 'EQ',
      convertValue: LiSearchConverter.excludeAllOnCheck,
    },
    isArchived: { key: 'is_archived', operator: 'EQ', convertValue: LiSearchConverter.includeAllOnCheck },
    id: { key: 'id', operator: 'EQ' },
  };

  public static sortConverter: FlSearchSortCriteriaConverter = {
    title: 'title',
    creation: 'created_at',
    lastModification: 'last_modified_at',
    lastSynchro: 'lastSyncAt',
  };

  public static getSearchForm(): FormGroup {
    return new FormBuilder().group({
      title: [null],
      tags: [null],
      folder: [null],
      createdBy: [null],
      createdAt: new FormBuilder().group({
        from: [null],
        to: [null],
      }),
      lastModifiedAt: new FormBuilder().group({
        from: [null],
        to: [null],
      }),
      isArchived: [null],
      isNotValidated: [null],
      id: [null],
    });
  }
}
