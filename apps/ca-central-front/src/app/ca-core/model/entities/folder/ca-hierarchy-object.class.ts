import { ClLuxonDateTimeTransform } from '@monorepo/core-lib';
import { DateTime } from 'luxon';
import { Type } from 'class-transformer';
import { CaUser } from '../ca-user.class';
import { FlEntityPaginatedDatasource } from '@monorepo/front-core-lib';
import { CaEntity } from '../ca-entity.entity';

export enum CaHierarchyObjectType {
  FOLDER = 'FOLDER',
  DOCUMENT = 'DOCUMENT',
  CONSTELLAB_DOCUMENT = 'CONSTELLAB_DOCUMENT',
  // HIDDEN_DOCUMENT = 'HIDDEN_DOCUMENT',
  NOTE = 'NOTE',
  SCENARIO = 'SCENARIO',
}

export const caHierarchyObjectTypeLabels: Record<CaHierarchyObjectType, string> = {
  [CaHierarchyObjectType.FOLDER]: 'folder',
  [CaHierarchyObjectType.DOCUMENT]: 'document',
  [CaHierarchyObjectType.CONSTELLAB_DOCUMENT]: 'constellab_document',
  // [CaFolderObjectType.HIDDEN_DOCUMENT]: 'Hidden document',
  [CaHierarchyObjectType.NOTE]: 'note',
  [CaHierarchyObjectType.SCENARIO]: 'scenario',
};

export class CaHierarchyObject extends CaEntity {
  name: string;

  @Type(() => CaUser)
  user: CaUser;

  @ClLuxonDateTimeTransform()
  lastModifiedAt: DateTime;

  objectType: CaHierarchyObjectType;

  parentId: string;

  chatEnabled: boolean;

  /**
   * For folder only, if description is written
   */
  hasDescription: boolean;

  /**
   * For note or scenario only, if the object is validated
   */
  isValidated: boolean;

  documentSize: number;

  isRoot(): boolean {
    return this.parentId === null;
  }
}

export type CaHierarchyObjectDatasource<F = void> = FlEntityPaginatedDatasource<CaHierarchyObject, F>;

export class CaHierarchyObjectWithChildren extends CaHierarchyObject {
  @Type(() => CaHierarchyObjectWithChildren)
  children: CaHierarchyObjectWithChildren[];

  public static fromHierarchyObject(folder: CaHierarchyObject): CaHierarchyObjectWithChildren {
    return Object.assign(new CaHierarchyObjectWithChildren(), folder, { children: [] });
  }
}
