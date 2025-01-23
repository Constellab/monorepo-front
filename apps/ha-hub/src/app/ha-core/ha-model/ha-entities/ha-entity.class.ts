import { FlEntity } from '@monorepo/front-core-lib/fl-core';
import { DateTime } from 'luxon';
import { HaUser } from './ha-user';
import { ClLuxonDateTimeTransform } from '@monorepo/core-lib';
import { Type } from 'class-transformer';
// import reflect-metadata here to fix problem in SSR
// the import must be here so it is available in every chunk
// this is because this is the main first import of class-transformer
import 'reflect-metadata';

export class HaBaseEntity implements FlEntity {
  id: string;
}

export class HaEntity implements FlEntity {
  id: string;
  @ClLuxonDateTimeTransform()
  createdAt: DateTime;

  @Type(() => HaUser)
  createdBy: HaUser;

  @ClLuxonDateTimeTransform()
  lastModifiedAt: DateTime;

  @Type(() => HaUser)
  lastModifiedBy: HaUser;
}
