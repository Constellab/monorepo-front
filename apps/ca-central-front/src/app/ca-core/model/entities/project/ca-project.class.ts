import { CaBaseEntity } from '../ca-base-entity.class';
import { DateTime } from 'luxon';
import { ClLuxonDateTransform } from '@monorepo/core-lib';
import { FlEntity, FlEntityPaginatedDatasource } from '@monorepo/front-core-lib';
import { Type } from 'class-transformer';
import { CaUser } from '../ca-user.class';
import { CaBucketLocationDTO } from '../ca-object-storage.class';
import { CaFolder } from './ca-folder.class';

export interface CaProjectInfo {
  id: string;
  title: string;
  leader: CaUser;
}

export class CaProject extends CaBaseEntity {

  code: string;

  title: string;

  @ClLuxonDateTransform()
  startingDate: DateTime;

  @ClLuxonDateTransform()
  endingDate: DateTime;

  @Type(() => CaUser)
  leader: CaUser;

  chatEnabled: boolean;

  get info(): CaProjectInfo {
    return {
      id: this.id,
      title: this.title,
      leader: this.leader
    };
  }
}

export class CaProjectWithFolder extends CaProject {

  @Type(() => CaFolder)
  folderHierarchy: CaFolder;
}


export type CaProjectDatasource = FlEntityPaginatedDatasource<CaProject>;

export class CnSaveProjectDTO {
  code: string;
  title: string;
  @ClLuxonDateTransform()
  startingDate: DateTime;
  @ClLuxonDateTransform()
  endingDate: DateTime;

  // only for project level in creation
  @Type(() => CaBucketLocationDTO)
  mainStorage?: CaBucketLocationDTO;
  @Type(() => CaBucketLocationDTO)
  backupStorage?: CaBucketLocationDTO;
}

/**
 * Interface representing an object inside a project that can be validated and synchronized with central
 */
export interface CaProjectObject extends FlEntity {

  isValidated: boolean;
  validatedBy?: CaUser;
  validatedAt?: DateTime;

  lastSyncAt?: DateTime;
  lastSyncBy?: CaUser;
}

export class CaProjectStorageDTO {
  // only for project level in creation
  @Type(() => CaBucketLocationDTO)
  mainStorage: CaBucketLocationDTO;
  @Type(() => CaBucketLocationDTO)
  backupStorage?: CaBucketLocationDTO;
}
