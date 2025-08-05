import { ClLuxonDateTimeTransform, ClLuxonDateTransform } from '@monorepo/core-lib';
import { FlEntityArrayObs } from '@monorepo/front-core-lib/fl-core';
import { DateTime } from 'luxon';

import { CaBaseEntity } from '../ca-base-entity.class';

export class CaServerPrice extends CaBaseEntity {
  price: number;

  @ClLuxonDateTimeTransform()
  startDate: DateTime;

  @ClLuxonDateTimeTransform()
  endDate: DateTime;
}

export type CaServerPriceDatasource = FlEntityArrayObs<CaServerPrice>;

export class CaCreateServerPriceDTO {
  price: number;

  @ClLuxonDateTransform()
  startDate: DateTime;
}
