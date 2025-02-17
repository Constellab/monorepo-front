import { ClLuxonDateTimeTransform } from '@monorepo/core-lib';
import { DateTime } from 'luxon';
import { Type } from 'class-transformer';
import { CaUser } from '../ca-user.class';
import { FlEntityPaginatedDatasource } from '@monorepo/front-core-lib/fl-core';
import { CaEntity } from '../ca-entity.entity';
import { TdTypeStyle } from '@monorepo/technical-doc';
import { FlTag, FlTagDatasource } from '@monorepo/front-core-lib/fl-tag';

export enum CaHierarchyObjectType {
  FOLDER = 'FOLDER',
  DOCUMENT = 'DOCUMENT',
  CONSTELLAB_DOCUMENT = 'CONSTELLAB_DOCUMENT',
  // HIDDEN_DOCUMENT = 'HIDDEN_DOCUMENT',
  NOTE = 'NOTE',
  SCENARIO = 'SCENARIO',
  RESOURCE = 'RESOURCE',
}

export interface CaHierarchyObjectInfo {
  label: string;
  style: TdTypeStyle;
}

export const caHierarchyObjectTypeInfos: Record<CaHierarchyObjectType, CaHierarchyObjectInfo> = {
  [CaHierarchyObjectType.FOLDER]: {
    label: 'folder',
    style: {
      icon_type: 'MATERIAL_ICON',
      icon_technical_name: 'folder',
      background_color: 'accent',
      icon_color: 'accentContrast',
    },
  },
  [CaHierarchyObjectType.DOCUMENT]: {
    label: 'document',
    style: { icon_type: 'MATERIAL_ICON', icon_technical_name: 'insert_drive_file' },
  },
  [CaHierarchyObjectType.CONSTELLAB_DOCUMENT]: {
    label: 'constellab_document',
    style: { icon_type: 'MATERIAL_ICON', icon_technical_name: 'constellab_document' },
  },
  // [CaFolderObjectType.HIDDEN_DOCUMENT]: 'Hidden document',
  [CaHierarchyObjectType.NOTE]: {
    label: 'note',
    style: {
      icon_type: 'MATERIAL_ICON',
      icon_technical_name: 'note',
      background_color: 'primary',
      icon_color: 'primaryContrast',
    },
  },
  [CaHierarchyObjectType.SCENARIO]: {
    label: 'scenario',
    style: {
      icon_type: 'MATERIAL_ICON',
      icon_technical_name: 'scenario',
      background_color: 'warn',
      icon_color: 'warnContrast',
    },
  },
  [CaHierarchyObjectType.RESOURCE]: {
    label: 'resource',
    style: {
      icon_type: 'MATERIAL_ICON',
      icon_technical_name: 'resource',
    },
  },
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

  style: TdTypeStyle;

  lastTags: FlTag[];

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

export type CaHierarchyObjectTagDatasource = FlTagDatasource;
