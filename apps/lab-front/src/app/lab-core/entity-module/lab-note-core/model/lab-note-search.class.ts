import { Type } from 'class-transformer';
import {
  FlFormInputsManagerConfig,
  FlSearchConverter,
  FlSearchDateInterval,
  FlSearchFilterCriteriaConverter,
  FlSearchSortCriteriaConverter,
  FlTag,
} from '@monorepo/front-core-lib';
import { LabSearchConverter } from '../../../model/global/lab-search-converter.class';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LabFolder } from '../../../model/entities/lab-folder.class';
import { LabUser } from '../../../model/entities/lab-user.entity';

export class LabNoteSearchFields {
  title: string;
  @Type(() => LabFolder)
  folder: LabFolder[];

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

export class LabNoteSearch {
  /**
   * Const to configure Form Input Manager for advanced search
   */
  public static searchManagerConfig: FlFormInputsManagerConfig<LabNoteSearchFields> = {
    title: 'title',
    tags: 'flTag.tags',
    folder: 'biox.folder',
    // group the creation date into one chip
    createdAt: 'creation_date',
    createdBy: 'created_by',
    lastModifiedAt: 'last_modified_date',
    isNotValidated: 'biox.note_is_not_validated',
    isArchived: 'is_archived',
  };

  /**
   * Convert used by the advanced search to convert the form result to list of {@link FlSearchCriteria}
   */
  public static filterConverter: FlSearchFilterCriteriaConverter<LabNoteSearchFields> = {
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
      convertValue: LabSearchConverter.excludeAllOnCheck,
    },
    isArchived: { key: 'is_archived', operator: 'EQ', convertValue: LabSearchConverter.includeAllOnCheck },
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
