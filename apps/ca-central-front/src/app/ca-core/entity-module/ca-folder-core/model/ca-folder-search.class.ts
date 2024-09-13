import { Type } from 'class-transformer';
import { CaUser } from '../../../model/entities/ca-user.class';
import {
  FlFormInputsManagerConfig,
  FlSearchConverter,
  FlSearchCriteriaConverter,
  FlSearchDateInterval
} from '@monorepo/front-core-lib';
import { FormBuilder, FormGroup } from '@ngneat/reactive-forms';

export class CaFolderSearchFields {

  code: string;

  title: string;

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

  public static advancedSearchManagerConfig: FlFormInputsManagerConfig<CaFolderSearchFields> = {
    code: 'code',
    title: 'title',
    startingDate: 'starting_date',
    endingDate: 'ending_date',
    leader: 'folder_leader',
    createdAt: 'creation_date',
    includeSubFolders: 'include_sub_folders'
  };

  public static advancedSearchConverter: FlSearchCriteriaConverter<CaFolderSearchFields> = {
    code: { key: 'code', operator: 'MATCH' },
    title: { key: 'title', operator: 'MATCH' },
    startingDate: FlSearchConverter.dateInterval('startingDate'),
    endingDate: FlSearchConverter.dateInterval('endingDate'),
    leader: { key: 'createdBy.id', operator: 'EQ', convertValue: FlSearchConverter.getEntityId },
    createdAt: FlSearchConverter.dateInterval('createdAt'),
    includeSubFolders: { key: 'includeSubFolders', operator: 'EQ' },
    id: { key: 'id', operator: 'EQ' }
  };

  public static getAdvancedSearchForm(): FormGroup<CaFolderSearchFields> {
    return new FormBuilder().group<CaFolderSearchFields>({
      code: null,
      title: null,
      startingDate: new FormBuilder().group<FlSearchDateInterval>({
        from: [null],
        to: [null]
      }),
      endingDate: new FormBuilder().group<FlSearchDateInterval>({
        from: [null],
        to: [null]
      }),
      leader: null,
      createdAt: new FormBuilder().group<FlSearchDateInterval>({
        from: [null],
        to: [null]
      }),
      includeSubFolders: null,
      id: null
    });
  }
}
