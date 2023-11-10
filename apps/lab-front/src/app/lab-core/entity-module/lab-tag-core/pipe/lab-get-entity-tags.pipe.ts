import {Pipe, PipeTransform} from '@angular/core';
import {FlEntity, FlTagDatasource} from '@monorepo/front-core-lib';
import {LabExperiment} from '../../../model/entities/lab-experiment.entity';
import {LabTagService} from '../../../entity-service/lab-tag.service';
import {LabReport} from '../../../model/entities/lab-report.entity';
import {LabResource} from '../../../model/entities/resource/lab-resource.entity';
import {LabViewConfig} from '../../../model/entities/resource/lab-view-config.entity';
import {LabEntityTagType} from '../../../model/entities/lab-tag.entity';
import {LabProtocolTemplate} from '../../../model/entities/process/lab-protocol-template.entity';

@Pipe({
  name: 'labGetEntityTags',
})
export class LabGetEntityTagsPipe implements PipeTransform {

  constructor(private tagService: LabTagService) {
  }

  transform(entity: FlEntity): FlTagDatasource {
    if (entity == null) return new FlTagDatasource([]);

    const tagType = this.getTagType(entity);

    if (tagType == null) return new FlTagDatasource([]);

    return this.tagService.getEntityTagsDatasource(tagType, entity.id);
  }

  private getTagType(entity: FlEntity): LabEntityTagType {
    if (entity instanceof LabExperiment) {
      return 'EXPERIMENT';
    } else if (entity instanceof LabReport) {
      return 'REPORT';
    } else if (entity instanceof LabResource) {
      return 'RESOURCE';
    } else if (entity instanceof LabViewConfig) {
      return 'VIEW';
    } else if (entity instanceof LabProtocolTemplate) {
      return 'PROTOCOL_TEMPLATE';
    } else {
      console.error('[labGetEntityTags] Entity type not supported', entity);
      return null;
    }
  }
}
