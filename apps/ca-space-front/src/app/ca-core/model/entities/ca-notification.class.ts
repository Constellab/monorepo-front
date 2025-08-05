import { ClLuxonDateTimeTransform, ClStringHelper } from '@monorepo/core-lib';
import { FlDatasourcePaginated } from '@monorepo/front-core-lib/fl-core';
import { Type } from 'class-transformer';
import { DateTime } from 'luxon';

import { CaEntity } from './ca-entity.entity';
import { CaUser } from './ca-user.class';
import { CaSpace } from './space/ca-space.class';

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

  isHttpLink(): boolean {
    return ClStringHelper.isHttpLink(this.link);
  }

  getRoute(): string {
    const l = this.link.split('?');
    return l[0];
  }

  getRouteQueryParams(): { [query: string]: string } {
    const l = this.link.split('?');
    const qP: { [query: string]: string } = {};
    if (l[1]) {
      for (const query of l[1].split('&')) {
        const q = query.split('=');
        qP[q[0]] = q[1];
      }
    }
    return qP;
  }

  getObjectIcon(): string {
    switch (this.objectType) {
      case 'DOCUMENT':
      case 'MESSAGE':
      case 'SCENARIO':
      case 'NOTE':
      case 'FOLDER':
        return 'folder';
      case 'USER':
        return 'people';
      case 'LAB':
        return 'lab';
      default:
        return 'campaign';
    }
  }
}

export type CaNotificationDatasourcePaginated = FlDatasourcePaginated<CaNotification>;

export type CaNotificationType = 'USER' | 'FOLDER' | 'SCENARIO' | 'NOTE' | 'DOCUMENT' | 'MESSAGE' | 'LAB';

export interface CaNotificationCountBySpace {
  spaceId: string;
  notReadCount: number;
}
