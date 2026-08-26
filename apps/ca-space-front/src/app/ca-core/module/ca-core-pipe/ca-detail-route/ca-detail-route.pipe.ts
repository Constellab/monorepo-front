import { Pipe, PipeTransform } from '@angular/core';

import { CaEntity } from '../../../model/entities/ca-entity.entity';
import { CaGroup, CaGroupType } from '../../../model/entities/ca-group.entity';
import { CaUser } from '../../../model/entities/ca-user.class';
import { CaDocument } from '../../../model/entities/folder/ca-document.class';
import { CaFolder } from '../../../model/entities/folder/ca-folder.class';
import { CaHierarchyObject } from '../../../model/entities/folder/ca-hierarchy-object.class';
import { CaNote } from '../../../model/entities/folder/ca-note.class';
import { CaResource } from '../../../model/entities/folder/ca-resource.class';
import { CaScenario } from '../../../model/entities/folder/ca-scenario.class';
import { CaLab } from '../../../model/entities/lab/ca-lab.class';
import { CaRouterService } from '../../../service/ca-router.service';

type CaObjectType = 'folder' | 'scenario' | 'note' | 'lab' | 'group' | 'document' | 'user' | 'resource';

/**
 * Pipe to get the detail route of an object
 *
 * 2 modes :
 *  Provide an object and the route is automatically detected form object type
 *  Provide an id and the object type
 */
@Pipe({ name: 'caDetailRoute' })
export class CaDetailRoutePipe implements PipeTransform {
  transform(value: string, objectType?: CaObjectType): string | null;
  transform(value: CaEntity): string | null;
  transform(value: string | CaEntity, objectType?: CaObjectType): string | null {
    let resolvedType: CaObjectType | null;
    let id: string | null;
    if (objectType == null) {
      [resolvedType, id] = this.getObjectType(value);
    } else {
      resolvedType = objectType;
      id = value as string;
    }

    if (resolvedType == null || id == null) return null;

    switch (resolvedType) {
      case 'folder':
        return CaRouterService.getFolderDetailRoute(id);
      case 'scenario':
        return CaRouterService.getScenarioDetailRoute(id);
      case 'note':
        return CaRouterService.getNoteDetailRoute(id);
      case 'lab':
        return CaRouterService.getLabDetailRoute(id);
      case 'group':
        return CaRouterService.getTeamRoute(id);
      case 'document':
        return CaRouterService.getDocumentDetailRoute(id);
      case 'user':
        return CaRouterService.getUserDetailRoute(id);
      case 'resource':
        return CaRouterService.getResourceDetailRoute(id);
      default:
        console.error(`[caDetailRoute] object type ${resolvedType} not supported`);
        return null;
    }
  }

  private getObjectType(obj: any): [CaObjectType | null, string | null] {
    if (obj instanceof CaHierarchyObject) {
      return this.getObjectTypeFromHierarchyObject(obj);
    } else if (obj instanceof CaFolder) {
      return ['folder', obj.id];
    } else if (obj instanceof CaScenario) {
      return ['scenario', obj.id];
    } else if (obj instanceof CaNote) {
      return ['note', obj.id];
    } else if (obj instanceof CaLab) {
      return ['lab', obj.id];
    } else if (obj instanceof CaGroup) {
      return this.getObjectTypeFromGroup(obj);
    } else if (obj instanceof CaDocument) {
      return ['document', obj.id];
    } else if (obj instanceof CaUser) {
      return ['user', obj.id];
    } else if (obj instanceof CaResource) {
      return ['resource', obj.id];
    } else {
      console.error('[caDetailRoute] The object is not supported');
      return [null, null];
    }
  }

  private getObjectTypeFromGroup(group: CaGroup): [CaObjectType | null, string | null] {
    switch (group.type) {
      case CaGroupType.TEAM:
        return ['group', group.id];
      case CaGroupType.SINGLE_USER:
        return ['user', group.id];
    }
  }

  private getObjectTypeFromHierarchyObject(
    hierarchyObject: CaHierarchyObject
  ): [CaObjectType | null, string | null] {
    switch (hierarchyObject.objectType) {
      case 'FOLDER':
        return ['folder', hierarchyObject.id];
      case 'SCENARIO':
        return ['scenario', hierarchyObject.id];
      case 'NOTE':
        return ['note', hierarchyObject.id];
      case 'DOCUMENT':
      case 'CONSTELLAB_DOCUMENT':
        return ['document', hierarchyObject.id];
      case 'RESOURCE':
      case 'APPLICATION':
        return ['resource', hierarchyObject.id];
      default:
        console.error('[caDetailRoute] The hierarchy object type is not supported');
        return [null, null];
    }
  }
}
