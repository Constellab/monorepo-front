import {CaBaseEntity} from '../ca-base-entity.class';
import {ClLuxonDateTimeTransform, ClLuxonDateTransform} from '@monorepo/core-lib';
import {DateTime} from 'luxon';
import {FlEntityArrayObs} from '@monorepo/front-core-lib';

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
