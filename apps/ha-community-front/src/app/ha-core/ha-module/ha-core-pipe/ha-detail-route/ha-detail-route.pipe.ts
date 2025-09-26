import { Pipe, PipeTransform } from '@angular/core';
import { ClStringHelper } from '@monorepo/core-lib';

import { HaAgent } from '../../../ha-model/ha-entities/ha-agent.class';
import { HaBrick } from '../../../ha-model/ha-entities/ha-brick.class';
import { HaCommunityApp } from '../../../ha-model/ha-entities/ha-community-app.class';
import { HaListStoryDto, HaStory } from '../../../ha-model/ha-entities/ha-story.class';
import { HaTagKey } from '../../../ha-model/ha-entities/ha-tag-key.class';
import { HaRouterService } from '../../../ha-service/ha-router.service';

@Pipe({ name: 'haDetailRoute' })
export class HaDetailRoutePipe implements PipeTransform {
  transform(value: any): string {
    if (value instanceof HaStory || value instanceof HaListStoryDto) {
      if (value.publishedAt == null) {
        return HaRouterService.getStoryEditRoute(value.id);
      }
      return HaRouterService.getStoryRoute(value.id, value.titlePath);
    }

    if (value instanceof HaAgent) {
      return HaRouterService.getAgentRoute(value.id, ClStringHelper.getCleanUrlPath(value.title));
    }

    if (value instanceof HaBrick) {
      return HaRouterService.getBrickPageRoute(value.name);
    }

    if (value instanceof HaCommunityApp) {
      return HaRouterService.getCommunityAppRoute(value.id, ClStringHelper.getCleanUrlPath(value.title));
    }

    if (value instanceof HaTagKey) {
      return HaRouterService.getTagPageRoute(value.id, ClStringHelper.getCleanUrlPath(value.technicalName));
    }

    return null;
  }
}
