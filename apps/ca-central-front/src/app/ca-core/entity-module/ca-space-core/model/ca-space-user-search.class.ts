import { FlFormInputsManagerConfig } from '@monorepo/front-core-lib/fl-form-inputs-manager';
import { FlSearchConverter } from '@monorepo/front-core-lib/fl-search';
import { FlSearchDateInterval } from '@monorepo/front-core-lib/fl-search';
import { FlSearchFilterCriteriaConverter } from '@monorepo/front-core-lib/fl-search';
import { FlSearchSortCriteriaConverter } from '@monorepo/front-core-lib/fl-search';

import { FormBuilder, FormGroup } from '@angular/forms';
import { CaUser } from '../../../model/entities/ca-user.class';
import { CaSpaceRole } from '../../../model/entities/space/ca-space-user.class';
import { Type } from 'class-transformer';

export class CaSpaceUserSearchFields {
  firstname: string;

  lastname: string;

  email: string;

  role: CaSpaceRole;

  active: boolean;

  @Type(() => CaUser)
  addedBy: CaUser;

  @Type(() => FlSearchDateInterval)
  createdAt: FlSearchDateInterval;
}

export class CaSpaceUserSearch {
  public static searchManagerConfig: FlFormInputsManagerConfig<CaSpaceUserSearchFields> = {
    firstname: 'firstname',
    lastname: 'lastname',
    email: 'email',
    role: 'role',
    active: 'active_license',
    addedBy: 'space_user_added_by',
    createdAt: 'creation_date',
  };

  public static filterConverter: FlSearchFilterCriteriaConverter<CaSpaceUserSearchFields> = {
    firstname: { key: 'user.firstname', operator: 'CONTAINS' },
    lastname: { key: 'user.lastname', operator: 'CONTAINS' },
    email: { key: 'user.email', operator: 'CONTAINS' },
    role: { key: 'role', operator: 'EQ' },
    active: { key: 'active', operator: 'EQ' },
    addedBy: { key: 'addedBy.id', operator: 'EQ', convertValue: FlSearchConverter.getEntityId },
    createdAt: FlSearchConverter.dateInterval('createdAt'),
  };

  public static sortConverter: FlSearchSortCriteriaConverter = {
    user: ['user.firstname', 'user.lastname'],
    role: 'role',
    addedInfo: 'createdAt',
    active: 'active',
    lastLogin: 'user.lastLoginSuccess',
  };

  public static getSearchForm(): FormGroup {
    return new FormBuilder().group({
      firstname: null,
      lastname: null,
      email: null,
      role: null,
      active: null,
      addedBy: null,
      createdAt: new FormBuilder().group({
        from: [null],
        to: [null],
      }),
    });
  }
}
