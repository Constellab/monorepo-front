import { Pipe, PipeTransform } from '@angular/core';

import { LiForm } from '../../../li-form/model/li-form.dto';
import { LiFormTemplate } from '../../../li-form/model/li-form-template.dto';
import { LiEntityType } from '../../model/entities/li-navigable-entity.entity';
import { LiNote } from '../../model/entities/li-note.entity';
import { LiNoteTemplate } from '../../model/entities/li-note-template.entity';
import { LiScenario } from '../../model/entities/li-scenario.entity';
import { LiTagKeyModel } from '../../model/entities/li-tag.entity';
import { LiScenarioTemplate } from '../../model/entities/process/li-scenario-template.entity';
import { LiResource } from '../../model/entities/resource/li-resource.entity';
import { LiViewConfig } from '../../model/entities/resource/li-view-config.entity';
import { LiEntity } from '../../model/global/li-entity.entity';
import { LiRouterService } from '../../service/li-router.service';

/**
 * Pipe to get the detail route of an object
 *
 * 2 modes :
 *  Provide an object and the route is automatically detected form object type
 *  Provide an id and the object type
 */
@Pipe({ name: 'liDetailRoute' })
export class LiDetailRoutePipe implements PipeTransform {
  transform(value: LiEntity): string;
  transform(value: string, objectType: LiEntityType): string;
  transform(value: string | LiEntity, objectType?: LiEntityType): string {
    if (objectType == null) {
      objectType = this.getObjectType(value);
    }

    if (objectType == null) return null;

    const id = typeof value === 'string' ? value : value.id;

    switch (objectType) {
      case 'SCENARIO':
        return LiRouterService.getScenarioDetailRoute(id);
      case 'RESOURCE':
        return LiRouterService.getResourceDetailRoute(id);
      case 'NOTE':
        return LiRouterService.getNoteDetailRoute(id);
      case 'SCENARIO_TEMPLATE':
        return LiRouterService.getScenarioTemplateDetailRoute(id);
      case 'NOTE_TEMPLATE':
        return LiRouterService.getNoteTemplateDetailRoute(id);
      case 'VIEW':
        return LiRouterService.getViewConfigRedirectRoute(id);
      case 'TAG':
        const key: string = (value as LiTagKeyModel).key;
        return LiRouterService.getTagDetailRoute(key);
      case 'FORM_TEMPLATE':
        return LiRouterService.getFormTemplateDetailRoute(id);
      case 'FORM':
        return LiRouterService.getFormDetailRoute(id);
      default:
        console.error(`[liDetailRoute] object type ${objectType} not supported`);
        return null;
    }
  }

  private getObjectType(obj: any): LiEntityType {
    if (obj instanceof LiScenario) {
      return 'SCENARIO';
    } else if (obj instanceof LiResource) {
      return 'RESOURCE';
    } else if (obj instanceof LiNote) {
      return 'NOTE';
    } else if (obj instanceof LiScenarioTemplate) {
      return 'SCENARIO_TEMPLATE';
    } else if (obj instanceof LiNoteTemplate) {
      return 'NOTE_TEMPLATE';
    } else if (obj instanceof LiViewConfig) {
      return 'VIEW';
    } else if (obj instanceof LiTagKeyModel) {
      return 'TAG';
    } else if (obj instanceof LiFormTemplate) {
      return 'FORM_TEMPLATE';
    } else if (obj instanceof LiForm) {
      return 'FORM';
    } else {
      console.error('[liDetailRoute] The object is not supported');
      return null;
    }
  }
}
