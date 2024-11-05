import { DateTime } from 'luxon';
import {
  ClLuxonDateTimeTransform,
  ClSupportedLanguage,
  ClTheme,
  ClUserCategory,
  ClUserStatus,
} from '@monorepo/core-lib';
import { CaEntity } from './ca-entity.entity';
import { FlDatasourcePaginated, FlUser } from '@monorepo/front-core-lib';

export enum CaUserLicense {
  FREE = 'FREE',
  ENTERPRISE = 'ENTERPRISE',
}

export interface CaNewUser {
  firstname: string;
  lastname: string;
  email: string;
  category: ClUserCategory;
  password: string;
  repeatPassword: string;
}

export class CaUser extends CaEntity implements FlUser {
  firstname: string;

  lastname: string;

  email: string;

  category: ClUserCategory;

  activity?: string;

  lang: ClSupportedLanguage;

  theme: ClTheme;

  photo: string;

  biography?: string;

  company?: string;

  status: ClUserStatus;

  phone?: string;

  @ClLuxonDateTimeTransform()
  createdAt: DateTime;

  @ClLuxonDateTimeTransform()
  lastLoginSuccess?: DateTime;

  license: CaUserLicense;

  get alias(): string {
    return (this.firstname || '') + ' ' + (this.lastname || '');
  }

  public toString(): string {
    return this.alias;
  }

  public isAdmin(): boolean {
    return this.category === ClUserCategory.ADMIN;
  }

  public hasEntrepriseLicense(): boolean {
    return this.license === CaUserLicense.ENTERPRISE;
  }

  // return true if the user is one of the listed category
  public isCategory(...categories: ClUserCategory[]): boolean {
    if (categories == null || categories.length === 0) {
      return true;
    }
    return categories.includes(this.category);
  }

  public statusMailNotValidated(): boolean {
    return this.status === ClUserStatus.WAITING_FOR_EMAIL;
  }
}

export type CaUserDatasourcePaginated<F = void> = FlDatasourcePaginated<CaUser, F>;

export interface CaUserUpdateLicenseDTO {
  license: CaUserLicense;
}
