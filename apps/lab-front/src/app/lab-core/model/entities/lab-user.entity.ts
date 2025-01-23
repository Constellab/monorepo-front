import { FlDatasourcePaginated } from '@monorepo/front-core-lib/fl-core';
import { FlUser } from '@monorepo/front-core-lib/fl-user';
import { Expose, Type } from 'class-transformer';
import { LabBaseEntity } from '../global/lab-entity.entity';
import { ClSupportedLanguage, ClTheme } from '@monorepo/core-lib';

export class LabUser implements FlUser {
  id: string;

  email: string;

  @Expose({ name: 'first_name' })
  firstname: string;

  @Expose({ name: 'last_name' })
  lastname: string;

  theme: ClTheme;

  lang: ClSupportedLanguage;

  photo?: string;

  get alias(): string {
    return (this.firstname || '') + ' ' + (this.lastname || '');
  }

  public toString(): string {
    return this.alias;
  }
}

export class LabBaseEntityWithUser extends LabBaseEntity {
  @Expose({ name: 'created_by' })
  @Type(() => LabUser)
  createdBy: LabUser;

  @Expose({ name: 'last_modified_by' })
  @Type(() => LabUser)
  lastModifiedBy: LabUser;
}

export type LabUserDatasourcePaginated<F = void> = FlDatasourcePaginated<LabUser, F>;
