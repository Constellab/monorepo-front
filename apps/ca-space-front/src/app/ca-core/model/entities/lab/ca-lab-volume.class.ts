import { CaBaseEntity } from '../ca-base-entity.class';
import { ClLuxonDateTimeTransform, ClLuxonDateTransform } from '@monorepo/core-lib';
import { DateTime } from 'luxon';
import { FlEntityPaginatedDatasource } from '@monorepo/front-core-lib/fl-core';

export type CaLabVolumeType = 'CLASSIC' | 'HIGH_SPEED';

export class CaLabVolume extends CaBaseEntity {
  size: number;

  type: CaLabVolumeType;

  @ClLuxonDateTimeTransform()
  startDate: DateTime;

  @ClLuxonDateTimeTransform()
  endDate: DateTime;
}

export type CaLabVolumeDatasource = FlEntityPaginatedDatasource<CaLabVolume>;

export class CaLabUpdateVolumeDTO {
  volumeSize: number;
  volumeType: CaLabVolumeType;

  @ClLuxonDateTransform()
  startDate: DateTime;
}
