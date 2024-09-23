import { CaEntity } from './ca-entity.entity';
import { ClLuxonDateTimeTransform } from '@monorepo/core-lib';
import { DateTime } from 'luxon';
import { Type } from 'class-transformer';
import { CaUser } from './ca-user.class';
import { CaSpace } from './space/ca-space.class';
import { FlDatasourcePaginated } from '@monorepo/front-core-lib';

export class CaNotification extends CaEntity {
  @ClLuxonDateTimeTransform()
  createdAt: DateTime;

  @Type(() => CaUser)
  createdBy: CaUser;

  isRead: boolean;

  link: string;

  objectId: string;

  objectType: CaNotificationType;

  text: string;

  text2: string;

  @Type(() => CaSpace)
  space: CaSpace;

  associatedObjectIds: string[];
}

export type CaNotificationDatasourcePaginated = FlDatasourcePaginated<CaNotification>;


export type CaNotificationType = 'USER' | 'FOLDER' | 'EXPERIMENT' | 'NOTE' | 'DOCUMENT' | 'MESSAGE';

export interface CaNotificationCountBySpace {
  spaceId: string;
  notReadCount: number;
}
