import { FlEntity } from '@monorepo/front-core-lib/fl-core';
import {
  LiEntityTagType,
  LiNote,
  LiResource,
  LiScenario,
  LiScenarioTemplate,
  LiTagDatasource,
  LiTagService,
  LiViewConfig,
} from '@monorepo/lab-lib/li-core';
import { Pipe, PipeTransform, inject } from '@angular/core';

@Pipe({ name: 'labGetEntityTags' })
export class LiGetEntityTagsPipe implements PipeTransform {
  private tagService = inject(LiTagService);

  transform(entity: FlEntity): LiTagDatasource {
    if (entity == null) return new LiTagDatasource([]);

    const tagType = this.getTagType(entity);

    if (tagType == null) return new LiTagDatasource([]);

    return this.tagService.getEntityTagsDatasource(tagType, entity.id);
  }

  private getTagType(entity: FlEntity): LiEntityTagType {
    if (entity instanceof LiScenario) {
      return 'SCENARIO';
    } else if (entity instanceof LiNote) {
      return 'NOTE';
    } else if (entity instanceof LiResource) {
      return 'RESOURCE';
    } else if (entity instanceof LiViewConfig) {
      return 'VIEW';
    } else if (entity instanceof LiScenarioTemplate) {
      return 'SCENARIO_TEMPLATE';
    } else {
      console.error('[labGetEntityTags] Entity type not supported', entity);
      return null;
    }
  }
}
