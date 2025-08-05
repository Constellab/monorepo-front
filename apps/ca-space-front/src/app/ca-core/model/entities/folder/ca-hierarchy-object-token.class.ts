import { ClLuxonDateTransform } from '@monorepo/core-lib';
import { FlDatasourcePaginated } from '@monorepo/front-core-lib/fl-core';
import { DateTime } from 'luxon';

import { CaBaseEntity } from '../ca-base-entity.class';

export class CaHierarchyObjectToken extends CaBaseEntity {
  @ClLuxonDateTransform()
  expirationDate?: DateTime;

  url: string;

  isValid(): boolean {
    return this.expirationDate == null || this.expirationDate > DateTime.now();
  }
}

export class CaHierarchyObjectTokenSaveDTO {
  @ClLuxonDateTransform()
  expirationDate: DateTime;
}

export type CaHierarchyObjectTokenDatasource = FlDatasourcePaginated<CaHierarchyObjectToken>;
