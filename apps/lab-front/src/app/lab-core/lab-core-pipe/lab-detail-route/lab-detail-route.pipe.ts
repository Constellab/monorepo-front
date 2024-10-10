import { Pipe, PipeTransform } from '@angular/core';
import { LabEntity } from '../../model/global/lab-entity.entity';
import { LabRouterService } from '../../service/lab-router.service';
import { LabNote } from '../../model/entities/lab-note.entity';
import { LabScenario } from '../../model/entities/lab-scenario.entity';
import { LabResource } from '../../model/entities/resource/lab-resource.entity';
import { LabProtocolTemplate } from '../../model/entities/process/lab-protocol-template.entity';
import { LabNoteTemplate } from '../../model/entities/lab-note-template.entity';
import { LabEntityType } from '../../model/entities/lab-navigable-entity.entity';
import { LabViewConfig } from '../../model/entities/resource/lab-view-config.entity';

/**
 * Pipe to get the detail route of an object
 *
 * 2 modes :
 *  Provide an object and the route is automatically detected form object type
 *  Provide an id and the object type
 */
@Pipe({
  name: 'labDetailRoute'
})
export class LabDetailRoutePipe implements PipeTransform {

  transform(value: LabEntity): string;
  transform(value: string, objectType: LabEntityType): string;
  transform(value: string | LabEntity, objectType?: LabEntityType): string {
    if (objectType == null) {
      objectType = this.getObjectType(value);
    }

    if (objectType == null) return null;

    const id = typeof value === 'string' ? value : value.id;

    switch (objectType) {
      case 'SCENARIO':
        return LabRouterService.getScenarioDetailRoute(id);
      case 'RESOURCE':
        return LabRouterService.getResourceDetailRoute(id);
      case 'NOTE':
        return LabRouterService.getNoteDetailRoute(id);
      case 'PROTOCOL_TEMPLATE':
        return LabRouterService.getProtocolTemplateDetailRoute(id);
      case 'NOTE_TEMPLATE':
        return LabRouterService.getNoteTemplateDetailRoute(id);
      case 'VIEW':
        return LabRouterService.getViewConfigRedirectRoute(id);
      default:
        console.error(`[labDetailRoute] object type ${objectType} not supported`);
        return null;
    }

  }

  private getObjectType(obj: any): LabEntityType {
    if (obj instanceof LabScenario) {
      return 'SCENARIO';
    } else if (obj instanceof LabResource) {
      return 'RESOURCE';
    } else if (obj instanceof LabNote) {
      return 'NOTE';
    } else if (obj instanceof LabProtocolTemplate) {
      return 'PROTOCOL_TEMPLATE';
    } else if (obj instanceof LabNoteTemplate) {
      return 'NOTE_TEMPLATE';
    } else if (obj instanceof LabViewConfig) {
      return 'VIEW';
    } else {
      console.error('[labDetailRoute] The object is not supported');
      return null;
    }
  }


}
