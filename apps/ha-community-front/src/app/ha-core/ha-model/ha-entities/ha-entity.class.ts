// import reflect-metadata here to fix problem in SSR
// the import must be here so it is available in every chunk
// this is because this is the main first import of class-transformer
// The class-transformer breaks the app if source map is set to true
// This might be due to circular dependencies
// If bricks and stories routes are disable, the errors convert to a warnings
// And by applying those modifications, the app works fine
// HaBrickMajorVersion --> remove HaBrick import
// ha-co-author-invite --> remove HaBrick, HaStory, HaAgent import
// ha-detail-route.pipe --> remove HaBrick, HaStory, HaAgent import
import 'reflect-metadata';

import { ClLuxonDateTimeTransform } from '@monorepo/core-lib';
import { FlEntity } from '@monorepo/front-core-lib/fl-core';
import { Type } from 'class-transformer';
import { DateTime } from 'luxon';

import { HaUser } from './ha-user';

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
