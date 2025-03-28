import { ClLuxonDateTimeTransform } from '@monorepo/core-lib';
import { DateTime } from 'luxon';
import { Expose } from 'class-transformer';
import { FlEntity } from '@monorepo/front-core-lib/fl-core';

/**
 * Base entity for the lab entities
 */
export class LiEntity implements FlEntity {
  id: string;
}

/**
 * Base entity for the lab entities
 */
export class LiBaseEntity extends LiEntity {
  @Expose({ name: 'created_at' })
  @ClLuxonDateTimeTransform()
  createdAt: DateTime;

  @Expose({ name: 'is_archived' })
  isArchived: boolean;

  @Expose({ name: 'last_modified_at' })
  @ClLuxonDateTimeTransform()
  lastModifiedAt: DateTime;
}
