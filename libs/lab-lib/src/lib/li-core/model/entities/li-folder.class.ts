import { FlEntity } from '@monorepo/front-core-lib/fl-core';
import { Type } from 'class-transformer';
import { DateTime } from 'luxon';

import { LiEntity } from '../global/li-entity.entity';
import { LiUser } from './li-user.entity';

export class LiFolder extends LiEntity {
  name: string;
}

export class LiFolderWithChildren extends LiFolder {
  @Type(() => LiFolderWithChildren)
  children?: LiFolder[];
}

/**
 * Interface representing an object inside a folder that can be validated and synchronized with space
 */
export interface LiFolderObject extends FlEntity {
  folder: LiFolder;

  isValidated: boolean;
  validatedBy?: LiUser;
  validatedAt?: DateTime;

  lastSyncAt?: DateTime;
  lastSyncBy?: LiUser;
  isSynced: boolean;
}
