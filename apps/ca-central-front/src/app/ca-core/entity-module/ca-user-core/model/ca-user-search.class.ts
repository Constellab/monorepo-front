import {
  FlFormInputsManagerConfig,
  FlSearchConverter,
  FlSearchCriteriaConverter,
  FlSearchDateInterval
} from '@monorepo/front-core-lib';
import {FormBuilder, FormGroup} from '@ngneat/reactive-forms';
import {Type} from 'class-transformer';
import {ClUserCategory, ClUserStatus} from '@monorepo/core-lib';


export class CaUserSearchFields {

  firstname: string;

  lastname: string;

  email: string;

  category: ClUserCategory[];

  status: ClUserStatus[];

  company: string;

  @Type(() => FlSearchDateInterval)
  createdAt: FlSearchDateInterval;

  @Type(() => FlSearchDateInterval)
  lastLoginSuccess: FlSearchDateInterval;

  id: string;
}

export class CaUserSearch {

  public static advancedSearchManagerConfig: FlFormInputsManagerConfig<CaUserSearchFields> = {
    firstname: 'firstname',
    lastname: 'lastname',
    email: 'email',
    category: 'user_category',
    status: 'status',
    company: 'company',
    createdAt: 'creation_date',
    lastLoginSuccess: 'last_login',
  };

  public static advancedSearchConverter: FlSearchCriteriaConverter<CaUserSearchFields> = {
    firstname: {key: 'firstname', operator: 'MATCH'},
    lastname: {key: 'lastname', operator: 'MATCH'},
    email: {key: 'email', operator: 'MATCH'},
    category: {key: 'category', operator: 'IN'},
    status: {key: 'status', operator: 'IN'},
    company: {key: 'company', operator: 'MATCH'},
    createdAt: FlSearchConverter.dateInterval('createdAt'),
    lastLoginSuccess: FlSearchConverter.dateInterval('lastLoginSuccess'),
    id: {key: 'id', operator: 'EQ'},
  };

  public static getAdvancedSearchForm(): FormGroup<CaUserSearchFields> {
    return new FormBuilder().group<CaUserSearchFields>({
      firstname: null,
      lastname: null,
      email: null,
      category: null,
      status: null,
      company: null,
      createdAt: new FormBuilder().group<FlSearchDateInterval>({
        from: [null],
        to: [null],
      }),
      lastLoginSuccess: new FormBuilder().group<FlSearchDateInterval>({
        from: [null],
        to: [null],
      }),
      id: null,
    });
  }
}
