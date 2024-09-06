import { Type } from 'class-transformer';
import { CaUser } from '../../../model/entities/ca-user.class';
import {
  FlFormInputsManagerConfig,
  FlSearchConverter,
  FlSearchCriteriaConverter,
  FlSearchDateInterval
} from '@monorepo/front-core-lib';
import { FormBuilder, FormGroup } from '@ngneat/reactive-forms';
import { CaFolderObjectType } from '../../../model/entities/project/ca-folder.class';

export class CaFolderSearchFields {

  name: string;

  @Type(() => CaUser)
  users: CaUser[];

  @Type(() => FlSearchDateInterval)
  lastModifiedAt: FlSearchDateInterval;

  objectType: CaFolderObjectType;

  id: string;
}

export class CaFolderSearch {

  public static advancedSearchManagerConfig: FlFormInputsManagerConfig<CaFolderSearchFields> = {
    name: 'name',
    lastModifiedAt: 'date'
  };

  public static advancedSearchConverter: FlSearchCriteriaConverter<CaFolderSearchFields> = {
    name: { key: 'name', operator: 'MATCH' },
    users: { key: 'user.id', operator: 'EQ', convertValue: FlSearchConverter.getEntitiesId },
    lastModifiedAt: FlSearchConverter.dateInterval('lastModifiedAt'),
    objectType: { key: 'objectType', operator: 'EQ' },
    id: { key: 'id', operator: 'EQ' }
  };

  public static getAdvancedSearchForm(): FormGroup<CaFolderSearchFields> {
    return new FormBuilder().group<CaFolderSearchFields>({
      name: null,
      users: null,
      lastModifiedAt: new FormBuilder().group<FlSearchDateInterval>({
        from: [null],
        to: [null]
      }),
      objectType: null,
      id: null
    });
  }
}
