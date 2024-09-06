import { ClLuxonDateTimeTransform } from '@monorepo/core-lib';
import { DateTime } from 'luxon';
import { Type } from 'class-transformer';
import { CaUser } from '../ca-user.class';
import { FlEntityPaginatedDatasource } from '@monorepo/front-core-lib';
import { CaEntity } from '../ca-entity.entity';

export enum CaFolderObjectType {
  FOLDER = 'FOLDER',
  DOCUMENT = 'DOCUMENT',
  CONSTELLAB_DOCUMENT = 'CONSTELLAB_DOCUMENT',
  // HIDDEN_DOCUMENT = 'HIDDEN_DOCUMENT',
  REPORT = 'REPORT',
  EXPERIMENT = 'EXPERIMENT',
}

export const caFolderObjectTypeLabels: Record<CaFolderObjectType, string> = {
  [CaFolderObjectType.FOLDER]: 'folder',
  [CaFolderObjectType.DOCUMENT]: 'document',
  [CaFolderObjectType.CONSTELLAB_DOCUMENT]: 'constellab_document',
  // [CaFolderObjectType.HIDDEN_DOCUMENT]: 'Hidden document',
  [CaFolderObjectType.REPORT]: 'report',
  [CaFolderObjectType.EXPERIMENT]: 'experiment'
};

export class CaFolder extends CaEntity {
  name: string;

  @Type(() => CaUser)
  user: CaUser;

  @ClLuxonDateTimeTransform()
  lastModifiedAt: DateTime;

  objectType: CaFolderObjectType;

  parentId: string;

  chatEnabled: boolean;

  /**
   * For folder only, if description is written
   */
  hasDescription: boolean;

  /**
   * For report or experiment only, if the object is validated
   */
  isValidated: boolean;

  documentSize: number;

  isRoot(): boolean {
    return this.parentId === null;
  }
}

export type CaFolderDatasource = FlEntityPaginatedDatasource<CaFolder>;

export class CaFolderWithChildren extends CaFolder {

  @Type(() => CaFolderWithChildren)
  children: CaFolderWithChildren[];

  public static fromFolder(folder: CaFolder): CaFolderWithChildren {
    return Object.assign(new CaFolderWithChildren(), folder, { children: [] });
  }
}
