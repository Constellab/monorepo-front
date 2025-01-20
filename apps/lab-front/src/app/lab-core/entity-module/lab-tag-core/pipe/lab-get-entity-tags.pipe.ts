import { Pipe, PipeTransform } from '@angular/core';
import { FlEntity } from '@monorepo/front-core-lib';
import { LabScenario } from '../../../model/entities/lab-scenario.entity';
import { LabTagService } from '../../../entity-service/lab-tag.service';
import { LabNote } from '../../../model/entities/lab-note.entity';
import { LabResource } from '../../../model/entities/resource/lab-resource.entity';
import { LabViewConfig } from '../../../model/entities/resource/lab-view-config.entity';
import { LabEntityTagType, LabTagDatasource } from '../../../model/entities/lab-tag.entity';
import { LabScenarioTemplate } from '../../../model/entities/process/lab-scenario-template.entity';

@Pipe({
    name: 'labGetEntityTags',
    standalone: false
})
export class LabGetEntityTagsPipe implements PipeTransform {
  constructor(private tagService: LabTagService) {}

  transform(entity: FlEntity): LabTagDatasource {
    if (entity == null) return new LabTagDatasource([]);

    const tagType = this.getTagType(entity);

    if (tagType == null) return new LabTagDatasource([]);

    return this.tagService.getEntityTagsDatasource(tagType, entity.id);
  }

  private getTagType(entity: FlEntity): LabEntityTagType {
    if (entity instanceof LabScenario) {
      return 'SCENARIO';
    } else if (entity instanceof LabNote) {
      return 'NOTE';
    } else if (entity instanceof LabResource) {
      return 'RESOURCE';
    } else if (entity instanceof LabViewConfig) {
      return 'VIEW';
    } else if (entity instanceof LabScenarioTemplate) {
      return 'SCENARIO_TEMPLATE';
    } else {
      console.error('[labGetEntityTags] Entity type not supported', entity);
      return null;
    }
  }
}
