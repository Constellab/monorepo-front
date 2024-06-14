import { Pipe, PipeTransform } from '@angular/core';
import { LabEntity } from '../../model/global/lab-entity.entity';
import { LabRouterService } from '../../service/lab-router.service';
import { LabReport } from '../../model/entities/lab-report.entity';
import { LabExperiment } from '../../model/entities/lab-experiment.entity';
import { LabResource } from '../../model/entities/resource/lab-resource.entity';
import { LabProtocolTemplate } from '../../model/entities/process/lab-protocol-template.entity';
import { LabReportTemplate } from '../../model/entities/lab-report-template.entity';
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
      case 'EXPERIMENT':
        return LabRouterService.getExperimentDetailRoute(id);
      case 'RESOURCE':
        return LabRouterService.getResourceDetailRoute(id);
      case 'REPORT':
        return LabRouterService.getReportDetailRoute(id);
      case 'PROTOCOL_TEMPLATE':
        return LabRouterService.getProtocolTemplateDetailRoute(id);
      case 'REPORT_TEMPLATE':
        return LabRouterService.getReportTemplateDetailRoute(id);
      case 'VIEW':
        return LabRouterService.getViewConfigRedirectRoute(id);
      default:
        console.error(`[labDetailRoute] object type ${objectType} not supported`);
        return null;
    }

  }

  private getObjectType(obj: any): LabEntityType {
    if (obj instanceof LabExperiment) {
      return 'EXPERIMENT';
    } else if (obj instanceof LabResource) {
      return 'RESOURCE';
    } else if (obj instanceof LabReport) {
      return 'REPORT';
    } else if (obj instanceof LabProtocolTemplate) {
      return 'PROTOCOL_TEMPLATE';
    } else if (obj instanceof LabReportTemplate) {
      return 'REPORT_TEMPLATE';
    } else if (obj instanceof LabViewConfig) {
      return 'VIEW';
    } else {
      console.error('[labDetailRoute] The object is not supported');
      return null;
    }
  }


}
