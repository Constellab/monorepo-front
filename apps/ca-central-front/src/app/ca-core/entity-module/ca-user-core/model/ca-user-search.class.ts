import {
  FlFormInputsManagerConfig,
  FlSearchConverter,
  FlSearchDateInterval,
  FlSearchFilterCriteriaConverter,
  FlSearchSortCriteriaConverter
} from '@monorepo/front-core-lib';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Type } from 'class-transformer';
import { ClUserCategory, ClUserStatus } from '@monorepo/core-lib';
import { CaUserLicense } from '../../../model/entities/ca-user.class';


export class CaUserSearchFields {

  firstname: string;

  lastname: string;

  email: string;

  category: ClUserCategory[];

  status: ClUserStatus[];

  license: CaUserLicense;

  company: string;

  @Type(() => FlSearchDateInterval)
  createdAt: FlSearchDateInterval;

  @Type(() => FlSearchDateInterval)
  lastLoginSuccess: FlSearchDateInterval;

  id: string;
}

export class CaUserSearch {

  public static searchManagerConfig: FlFormInputsManagerConfig<CaUserSearchFields> = {
    firstname: 'firstname',
    lastname: 'lastname',
    email: 'email',
    category: 'user_category',
    status: 'status',
    company: 'company',
    createdAt: 'creation_date',
    lastLoginSuccess: 'last_login',
  };

  public static filterConverter: FlSearchFilterCriteriaConverter<CaUserSearchFields> = {
    firstname: {key: 'firstname', operator: 'MATCH'},
    lastname: {key: 'lastname', operator: 'MATCH'},
    email: {key: 'email', operator: 'MATCH'},
    category: {key: 'category', operator: 'IN'},
    status: {key: 'status', operator: 'IN'},
    license: {key: 'license', operator: 'EQ'},
    company: {key: 'company', operator: 'MATCH'},
    createdAt: FlSearchConverter.dateInterval('createdAt'),
    lastLoginSuccess: FlSearchConverter.dateInterval('lastLoginSuccess'),
    id: {key: 'id', operator: 'EQ'},
  };

  public static sortConverter: FlSearchSortCriteriaConverter = {
    alias: ['firstname', 'lastname'],
    createdAt: 'createdAt',
    category: 'category',
    lastLogin: 'lastLoginSuccess',
  };

  public static getSearchForm(): FormGroup {
    return new FormBuilder().group({
      firstname: null,
      lastname: null,
      email: null,
      category: null,
      status: null,
      license: null,
      company: null,
      createdAt: new FormBuilder().group({
        from: [null],
        to: [null],
      }),
      lastLoginSuccess: new FormBuilder().group({
        from: [null],
        to: [null],
      }),
      id: null,
    });
  }
}
