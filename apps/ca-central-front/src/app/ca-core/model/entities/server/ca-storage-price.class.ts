import { CaBaseEntity } from '../ca-base-entity.class';
import { ClLuxonDateTimeTransform, ClLuxonDateTransform } from '@monorepo/core-lib';
import { DateTime } from 'luxon';
import { FlEntityArrayObs } from '@monorepo/front-core-lib/fl-core';

export class CaStoragePrice extends CaBaseEntity {
  public static backupApproximateRatio: number = 0.3;

  volumeStoragePrice: number;

  backupStoragePrice: number;

  backupTransfertPrice: number;

  @ClLuxonDateTimeTransform()
  startDate: DateTime;

  @ClLuxonDateTimeTransform()
  endDate: DateTime;

  /**
   * Get the total approximate price for the storage.
   * It includes the storage and 20% of the backup and transfert price.
   */
  get totalApproximatePrice(): number {
    return (
      this.volumeStoragePrice +
      this.backupStoragePrice * CaStoragePrice.backupApproximateRatio +
      this.backupTransfertPrice * CaStoragePrice.backupApproximateRatio
    );
  }
}

export type CaStoragePriceDatasource = FlEntityArrayObs<CaStoragePrice>;

export class CaCreateStoragePriceDTO {
  volumeStoragePrice: number;

  backupStoragePrice: number;

  backupTransfertPrice: number;

  @ClLuxonDateTransform()
  startDate: DateTime;
}
