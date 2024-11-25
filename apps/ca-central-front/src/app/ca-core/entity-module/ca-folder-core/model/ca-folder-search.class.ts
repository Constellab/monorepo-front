import { Type } from 'class-transformer';
import { CaUser } from '../../../model/entities/ca-user.class';
import {
  FlFormInputsManagerConfig,
  FlSearchConverter,
  FlSearchDateInterval,
  FlSearchFilterCriteriaConverter,
  FlSearchSortCriteriaConverter,
} from '@monorepo/front-core-lib';
import { FormBuilder, FormGroup } from '@angular/forms';

export class CaFolderSearchFields {
  code: string;

  name: string;

  @Type(() => FlSearchDateInterval)
  startingDate: FlSearchDateInterval;

  @Type(() => FlSearchDateInterval)
  endingDate: FlSearchDateInterval;

  @Type(() => CaUser)
  leader: CaUser;

  @Type(() => FlSearchDateInterval)
  createdAt: FlSearchDateInterval;

  includeSubFolders: boolean;

  id: string;
}

export class CaFolderSearch {
  public static searchManagerConfig: FlFormInputsManagerConfig<CaFolderSearchFields> = {
    code: 'code',
    name: 'name',
    startingDate: 'starting_date',
    endingDate: 'ending_date',
    leader: 'folder_leader',
    createdAt: 'creation_date',
    includeSubFolders: 'include_sub_folders',
  };

  public static filterConverter: FlSearchFilterCriteriaConverter<CaFolderSearchFields> = {
    code: { key: 'code', operator: 'CONTAINS' },
    name: { key: 'name', operator: 'CONTAINS' },
    startingDate: FlSearchConverter.dateInterval('startingDate'),
    endingDate: FlSearchConverter.dateInterval('endingDate'),
    leader: { key: 'createdBy.id', operator: 'EQ', convertValue: FlSearchConverter.getEntityId },
    createdAt: FlSearchConverter.dateInterval('createdAt'),
    includeSubFolders: { key: 'includeSubFolders', operator: 'EQ' },
    id: { key: 'id', operator: 'EQ' },
  };

  public static sortConverter: FlSearchSortCriteriaConverter = {
    name: 'name',
    creation: 'createdAt',
    leader: ['leader.firstname', 'leader.lastname'],
  };

  public static getSearchForm(): FormGroup {
    return new FormBuilder().group({
      code: null,
      name: null,
      startingDate: new FormBuilder().group({
        from: [null],
        to: [null],
      }),
      endingDate: new FormBuilder().group({
        from: [null],
        to: [null],
      }),
      leader: null,
      createdAt: new FormBuilder().group({
        from: [null],
        to: [null],
      }),
      includeSubFolders: null,
      id: null,
    });
  }
}
