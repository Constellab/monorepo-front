import { ClHelpService, ClLuxonDateTimeTransform } from '@monorepo/core-lib';
import { DateTime } from 'luxon';
import { Type } from 'class-transformer';
import { CaUser } from '../ca-user.class';
import { FlDatasourceTree, FlEntityPaginatedDatasource } from '@monorepo/front-core-lib/fl-core';
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

  visibility: 'VISIBLE' | 'TRASH';

  isRoot(): boolean {
    return this.parentId === null;
  }

  isInTrash(): boolean {
    return this.visibility === 'TRASH';
  }

  /**
   * Get the folder id of the object (if the object is a folder, return the id, else return the parentId)
   */
  getFolderId(): string {
    if (this.objectType === CaHierarchyObjectType.FOLDER) {
      return this.id;
    } else {
      return this.parentId;
    }
  }
}

export class CaHierarchyObjectWithParent extends CaHierarchyObject {
  @Type(() => CaHierarchyObject)
  parent: CaHierarchyObject;
}

export type CaHierarchyObjectDatasource<F = void> = FlEntityPaginatedDatasource<CaHierarchyObject, F>;

export class CaHierarchyObjectSimple extends CaEntity {
  name: string;

  parentId: string;

  style: TdTypeStyle;

  objectType: CaHierarchyObjectType;

  public static fromHierarchyObject(folder: CaHierarchyObject): CaHierarchyObjectSimple {
    const withChildren = new CaHierarchyObjectSimple();
    withChildren.id = folder.id;
    withChildren.name = folder.name;
    withChildren.parentId = folder.parentId;
    withChildren.style = folder.style;
    withChildren.objectType = folder.objectType;
    return withChildren;
  }
}

/**
 * Entity representing a chat folder
 */
export class CaChatFolder extends CaHierarchyObjectSimple {
  @Type(() => CaChatFolder)
  children: CaChatFolder[];

  chatEnabled: boolean;

  public getFirstWithChatEnabled(): CaChatFolder | null {
    if (this.chatEnabled) {
      return this;
    }
    if (this.children) {
      for (const child of this.children) {
        const result = child.getFirstWithChatEnabled();
        if (result) {
          return result;
        }
      }
    }
    return null;
  }

  public getById(id: string): CaChatFolder | null {
    if (this.id === id) {
      return this;
    }
    if (this.children) {
      for (const child of this.children) {
        const result = child.getById(id);
        if (result) {
          return result;
        }
      }
    }
    return null;
  }
}

export type CaHierarchyObjectTagDatasource = FlTagDatasource;

export class CaHierarchyObjectsTreeDatasource extends FlDatasourceTree<CaHierarchyObjectSimple> {
  constructor() {
    super((a, b) => ClHelpService.sortAlphabeticalFunction(a.name, b.name));
  }

  addHierarchyObjects(objects: CaHierarchyObjectSimple[]): void {
    for (const object of objects) {
      if (object.objectType === CaHierarchyObjectType.FOLDER) {
        this.tree.addOrReplaceObject(object, object.parentId);
      }
    }

    this.sortAndEmits();
  }

  addHierarchyObjectsWithChildren(objects: CaChatFolder[]): void {
    this.addHierarchyObjectsWithChildrenRecur(objects);
    this.sortAndEmits();
  }

  private addHierarchyObjectsWithChildrenRecur(objects: CaChatFolder[]): void {
    for (const object of objects) {
      this.tree.addOrReplaceObject(object, object.parentId);

      if (object.children) {
        this.addHierarchyObjectsWithChildrenRecur(object.children);
      }
    }
  }
}
