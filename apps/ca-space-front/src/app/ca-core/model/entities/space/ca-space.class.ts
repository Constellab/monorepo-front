import { FlDatasourcePaginated } from '@monorepo/front-core-lib/fl-core';
import { Type } from 'class-transformer';

import { CaBaseEntity } from '../ca-base-entity.class';
import { CaUser } from '../ca-user.class';
import { CaSpaceRole } from './ca-space-user.class';

export type CaSpaceType = 'ENTREPRISE' | 'PERSONAL';

export class CaSpace extends CaBaseEntity {
  name: string;

  photo: string;

  domain: string;

  type: CaSpaceType;

  toString(): string {
    return this.name;
  }

  get typeIcon(): string {
    switch (this.type) {
      case 'ENTREPRISE':
        return 'business';
      case 'PERSONAL':
        return 'person';
    }
  }
}

export type CaSpaceDatasource<F = void> = FlDatasourcePaginated<CaSpace, F>;

export class CaSpaceInfoDto {
  @Type(() => CaUser)
  user: CaUser;

  @Type(() => CaSpace)
  space: CaSpace;

  roleInSpace: CaSpaceRole;
}
