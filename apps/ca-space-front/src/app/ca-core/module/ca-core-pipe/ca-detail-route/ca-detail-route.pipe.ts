import { Pipe, PipeTransform } from '@angular/core';

import { CaEntity } from '../../../model/entities/ca-entity.entity';
import { CaGroup, CaGroupType } from '../../../model/entities/ca-group.entity';
import { CaUser } from '../../../model/entities/ca-user.class';
import { CaDocument } from '../../../model/entities/folder/ca-document.class';
import { CaFolder } from '../../../model/entities/folder/ca-folder.class';
import { CaHierarchyObject } from '../../../model/entities/folder/ca-hierarchy-object.class';
import { CaNote } from '../../../model/entities/folder/ca-note.class';
import { CaScenario } from '../../../model/entities/folder/ca-scenario.class';
import { CaLab } from '../../../model/entities/lab/ca-lab.class';
import { CaRouterService } from '../../../service/ca-router.service';

type CaObjectType = 'folder' | 'scenario' | 'note' | 'lab' | 'group' | 'document' | 'user';

/**
 * Pipe to get the detail route of an object
 *
 * 2 modes :
 *  Provide an object and the route is automatically detected form object type
 *  Provide an id and the object type
 */
@Pipe({ name: 'caDetailRoute' })
export class CaDetailRoutePipe implements PipeTransform {
  transform(value: string, objectType?: CaObjectType): string;
  transform(value: CaEntity): string;
  transform(value: string | CaEntity, objectType?: CaObjectType): string {
    let id: string;
    if (objectType == null) {
      [objectType, id] = this.getObjectType(value);
    } else {
      id = value as string;
    }

    if (objectType == null) return null;

    switch (objectType) {
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
      default:
        console.error(`[caDetailRoute] object type ${objectType} not supported`);
        return null;
    }
  }

  private getObjectType(obj: any): [CaObjectType, string] {
    if (obj instanceof CaFolder || obj instanceof CaHierarchyObject) {
      return ['folder', obj.id];
    } else if (obj instanceof CaScenario) {
      return ['scenario', obj.id];
    } else if (obj instanceof CaNote) {
      return ['note', obj.id];
    } else if (obj instanceof CaLab) {
      return ['lab', obj.id];
    } else if (obj instanceof CaGroup) {
      switch (obj.type) {
        case CaGroupType.TEAM:
          return ['group', obj.id];
        case CaGroupType.SINGLE_USER:
          return ['user', obj.id];
      }
    } else if (obj instanceof CaDocument) {
      return ['document', obj.id];
    } else if (obj instanceof CaUser) {
      return ['user', obj.id];
    } else {
      console.error('[caDetailRoute] The object is not supported');
      return [null, null];
    }
  }
}
