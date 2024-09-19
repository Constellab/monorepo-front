import { CaBaseEntity } from '../ca-base-entity.class';
import { DateTime } from 'luxon';
import { ClLuxonDateTransform } from '@monorepo/core-lib';
import { FlEntity, FlEntityPaginatedDatasource } from '@monorepo/front-core-lib';
import { Type } from 'class-transformer';
import { CaUser } from '../ca-user.class';
import { CaBucketLocationDTO } from '../ca-object-storage.class';
import { CaHierarchyObject } from './ca-hierarchy-object.class';
import { TeRichTextContent } from '@monorepo/text-editor';

export interface CaFolderInfo {
  id: string;
  name: string;
  leader: CaUser;
}

export class CaFolder extends CaBaseEntity {

  code: string;

  name: string;

  @ClLuxonDateTransform()
  startingDate: DateTime;

  @ClLuxonDateTransform()
  endingDate: DateTime;

  @Type(() => CaUser)
  leader: CaUser;

  chatEnabled: boolean;

  get info(): CaFolderInfo {
    return {
      id: this.id,
      name: this.name,
      leader: this.leader
    };
  }
}

export class CaFolderWithHierarchy extends CaFolder {

  @Type(() => CaHierarchyObject)
  hierarchyRepresentation: CaHierarchyObject;
}


export type CaFolderDatasource = FlEntityPaginatedDatasource<CaFolder>;

export class CnSaveFolderDTO {
  code: string;
  name: string;
  @ClLuxonDateTransform()
  startingDate: DateTime;
  @ClLuxonDateTransform()
  endingDate: DateTime;

  // only for folder level in creation
  @Type(() => CaBucketLocationDTO)
  mainStorage?: CaBucketLocationDTO;
  @Type(() => CaBucketLocationDTO)
  backupStorage?: CaBucketLocationDTO;
}

/**
 * Interface representing an object inside a folder that can be validated and synchronized with central
 */
export interface CaFolderObject extends FlEntity {

  isValidated: boolean;
  validatedBy?: CaUser;
  validatedAt?: DateTime;

  lastSyncAt?: DateTime;
  lastSyncBy?: CaUser;
}

export class CaFolderStorageDTO {
  // only for folder level in creation
  @Type(() => CaBucketLocationDTO)
  mainStorage: CaBucketLocationDTO;
  @Type(() => CaBucketLocationDTO)
  backupStorage?: CaBucketLocationDTO;
}

export interface CaGetFolderDescriptionDTO {
  description: TeRichTextContent;
  canEdit: boolean; // true if the current user can edit the description
}
