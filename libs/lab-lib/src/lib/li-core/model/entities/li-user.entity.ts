import { ClSupportedLanguage, ClTheme } from '@monorepo/core-lib';
import { Expose, Type } from 'class-transformer';
import { FlDatasourcePaginated } from '@monorepo/front-core-lib/fl-core';
import { FlUser } from '@monorepo/front-core-lib/fl-user';
import { LiBaseEntity } from '../global/li-entity.entity';

export class LiUser implements FlUser {
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

export class LiBaseEntityWithUser extends LiBaseEntity {
  @Expose({ name: 'created_by' })
  @Type(() => LiUser)
  createdBy: LiUser;

  @Expose({ name: 'last_modified_by' })
  @Type(() => LiUser)
  lastModifiedBy: LiUser;
}

export type LiUserDatasourcePaginated<F = void> = FlDatasourcePaginated<LiUser, F>;
