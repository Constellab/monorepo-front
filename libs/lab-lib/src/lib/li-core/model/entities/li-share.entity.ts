import { ClDateHelper, ClLuxonDateTransform } from '@monorepo/core-lib';
import { FlDatasourcePaginated } from '@monorepo/front-core-lib/fl-core';
import { Expose, Type } from 'class-transformer';
import { DateTime } from 'luxon';

import { LiBaseEntity } from '../global/li-entity.entity';
import { LiEntityType } from './li-navigable-entity.entity';
import { LiBaseEntityWithUser, LiUser } from './li-user.entity';

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
  @ClLuxonDateTransform()
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
  // above to ts
  @Expose({ name: 'lab_id' })
  labId: string;

  @Expose({ name: 'lab_name' })
  labName: string;

  @Expose({ name: 'user_id' })
  userId: string;

  @Expose({ name: 'user_firstname' })
  userFirstname: string;

  @Expose({ name: 'user_lastname' })
  userLastname: string;

  @Expose({ name: 'space_id' })
  spaceId: string;

  @Expose({ name: 'space_name' })
  spaceName: string;

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
