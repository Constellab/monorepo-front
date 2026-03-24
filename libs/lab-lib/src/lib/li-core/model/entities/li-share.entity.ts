import { ClDateHelper, ClLuxonDateTimeTransform } from '@monorepo/core-lib';
import { FlDatasourcePaginated } from '@monorepo/front-core-lib/fl-core';
import { Expose, Type } from 'class-transformer';
import { DateTime } from 'luxon';

import { LiBaseEntity } from '../global/li-entity.entity';
import { LiLab } from './li-lab.entity';
import { LiEntityType } from './li-navigable-entity.entity';
import { LiBaseEntityWithUser, LiUser } from './li-user.entity';

export type LiSharedEntityMode = 'LAB' | 'USER';

export type LiShareLinkEntityType = 'RESOURCE' | 'SCENARIO';

export type LiShareLinkType = 'PUBLIC' | 'SPACE';

export class LiShareLink extends LiBaseEntityWithUser {
  @Expose({ name: 'entity_id' })
  entityId: string;

  @Expose({ name: 'entity_type' })
  entityType: LiShareLinkEntityType;

  @Expose({ name: 'entity_name' })
  entityName: string;

  @Expose({ name: 'valid_until' })
  @ClLuxonDateTimeTransform()
  validUntil: DateTime;

  status: 'SUCCESS' | 'ERROR';

  @Expose({ name: 'download_link' })
  downloadLink: string;

  @Expose({ name: 'preview_link' })
  previewLink?: string;

  @Expose({ name: 'link_type' })
  linkType: LiShareLinkType;

  isValid(): boolean {
    return this.validUntil > ClDateHelper.getDate();
  }

  get labObjectType(): LiEntityType {
    return this.entityType;
  }
}

export type LiShareLinkDatasource = FlDatasourcePaginated<LiShareLink>;

export class LiSharedEntity extends LiBaseEntity {
  @Expose({ name: 'share_mode' })
  shareMode: LiSharedEntityMode;

  @Type(() => LiLab)
  lab: LiLab;

  @Type(() => LiUser)
  user: LiUser;

  @Expose({ name: 'external_id' })
  externalId: string;

  @Expose({ name: 'external_object_url' })
  externalObjectUrl?: string;

  @Expose({ name: 'created_by' })
  @Type(() => LiUser)
  createdBy: LiUser;
}

export type LiSharedEntityDatasource = FlDatasourcePaginated<LiSharedEntity>;

export interface LiCleanShareLinks {
  clean_expired_links: boolean;
  clean_invalid_links: boolean;
}

/**
 * Auth object used when requesting a public share link
 */
export interface LiShareLinkPublicAuth {
  token: string;
  /**
   * For link that require user authentication
   */
  userAccessToken?: string;
}
