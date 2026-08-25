import { inject, Pipe, PipeTransform } from '@angular/core';
import { FlEntity } from '@monorepo/front-core-lib/fl-core';
import {
  LiEntityTagType,
  LiNote,
  LiNoteTemplate,
  LiResource,
  LiScenario,
  LiScenarioTemplate,
  LiTagDatasource,
  LiTagService,
  LiViewConfig,
} from '@monorepo/lab-lib/li-core';

import { LiForm } from '../../li-core/model/entities/form/li-form.entity';
import { LiFormTemplate } from '../../li-core/model/entities/form/li-form-template.entity';

@Pipe({ name: 'labGetEntityTags' })
export class LiGetEntityTagsPipe implements PipeTransform {
  private tagService = inject(LiTagService);

  transform(entity: FlEntity): LiTagDatasource {
    if (entity == null) return new LiTagDatasource([]);

    const tagType = this.getTagType(entity);

    if (tagType == null) return new LiTagDatasource([]);

    return this.tagService.getEntityTagsDatasource(tagType, entity.id);
  }

  private getTagType(entity: FlEntity): LiEntityTagType | null {
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
    } else if (entity instanceof LiNoteTemplate) {
      return 'NOTE_TEMPLATE';
    } else if (entity instanceof LiFormTemplate) {
      return 'FORM_TEMPLATE';
    } else if (entity instanceof LiForm) {
      return 'FORM';
    } else {
      console.error('[labGetEntityTags] Entity type not supported', entity);
      return null;
    }
  }
}
