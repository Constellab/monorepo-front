import { Expose, Type } from 'class-transformer';
import { DateTime } from 'luxon';
import { ClDateHelper, ClLuxonDateTransform } from '@monorepo/core-lib';
import { LabBaseEntityWithUser, LabUser } from './lab-user.entity';
import { FlDatasourcePaginated } from '@monorepo/front-core-lib/fl-core';
import { LabBaseEntity } from '../global/lab-entity.entity';
import { LabEntityType } from './lab-navigable-entity.entity';

export type LabShareLinkEntityType = 'RESOURCE' | 'SCENARIO';

export type LabShareLinkType = 'PUBLIC' | 'SPACE';

export class LabShareLink extends LabBaseEntityWithUser {
  @Expose({ name: 'entity_id' })
  entityId: string;

  @Expose({ name: 'entity_type' })
  entityType: LabShareLinkEntityType;

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
  linkType: LabShareLinkType;

  isValid(): boolean {
    return this.validUntil > ClDateHelper.getDate();
  }

  get labObjectType(): LabEntityType {
    return this.entityType;
  }
}

export type LabShareLinkDatasource = FlDatasourcePaginated<LabShareLink>;

export class LabSharedEntity extends LabBaseEntity {
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
  @Type(() => LabUser)
  createdBy: LabUser;
}

export type LabSharedEntityDatasource = FlDatasourcePaginated<LabSharedEntity>;

export interface LabCleanShareLinks {
  clean_expired_links: boolean;
  clean_invalid_links: boolean;
}

/**
 * Auth object used when requesting a public share link
 */
export interface LabShareLinkPublicAuth {
  token: string;
  /**
   * For link that require user authentication
   */
  userAccessToken?: string;
}
