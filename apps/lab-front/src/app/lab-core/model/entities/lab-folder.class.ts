import {LabEntity} from '../global/lab-entity.entity';
import {LabUser} from './lab-user.entity';
import {DateTime} from 'luxon';
import {FlEntity} from '@monorepo/front-core-lib';
import {Type} from 'class-transformer';

export class LabFolder extends LabEntity {
  title: string;
}

export class LabFolderWithChildren extends LabFolder {
  @Type(() => LabFolderWithChildren)
  children?: LabFolder[];
}

/**
 * Interface representing an object inside a folder that can be validated and synchronized with space
 */
export interface LabFolderObject extends FlEntity {
  folder: LabFolder;

  isValidated: boolean;
  validatedBy?: LabUser;
  validatedAt?: DateTime;

  lastSyncAt?: DateTime;
  lastSyncBy?: LabUser;
  isSynced: boolean;
}
