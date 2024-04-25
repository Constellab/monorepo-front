import {CaBaseEntity} from '../ca-base-entity.class';
import {ClLuxonDateTimeTransform, ClLuxonDateTransform} from '@monorepo/core-lib';
import {DateTime} from 'luxon';
import {FlEntityArrayObs} from '@monorepo/front-core-lib';

export class CaStoragePrice extends CaBaseEntity {

  price: number;

  @ClLuxonDateTimeTransform()
  startDate: DateTime;

  @ClLuxonDateTimeTransform()
  endDate: DateTime;
}

export type CaStoragePriceDatasource = FlEntityArrayObs<CaStoragePrice>;

export class CaCreateStoragePriceDTO {
  price: number;

  @ClLuxonDateTransform()
  startDate: DateTime;
}
