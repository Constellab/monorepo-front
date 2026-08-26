import { Pipe, PipeTransform } from '@angular/core';
import { ClStringHelper } from '@monorepo/core-lib';

import { HaAgent } from '../../../ha-model/ha-entities/ha-agent.class';
import { HaBrick } from '../../../ha-model/ha-entities/ha-brick.class';
import { HaCommunityApp } from '../../../ha-model/ha-entities/ha-community-app.class';
import { HaPartner } from '../../../ha-model/ha-entities/ha-partner';
import { HaListStoryDto, HaStory } from '../../../ha-model/ha-entities/ha-story.class';
import { HaTagKey } from '../../../ha-model/ha-entities/ha-tag-key.class';
import { HaRouterService } from '../../../ha-service/ha-router.service';

@Pipe({ name: 'haDetailRoute' })
export class HaDetailRoutePipe implements PipeTransform {
  transform(value: any): string | null {
    if (value instanceof HaStory || value instanceof HaListStoryDto) {
      return HaDetailRoutePipe.getStoryRoute(value);
    }

    if (value instanceof HaAgent) {
      return HaRouterService.getAgentRoute(value.id, HaDetailRoutePipe.getUrlPath(value.title));
    }

    if (value instanceof HaBrick) {
      return HaRouterService.getBrickPageRoute(value.name);
    }

    if (value instanceof HaCommunityApp) {
      return HaRouterService.getCommunityAppRoute(value.id, HaDetailRoutePipe.getUrlPath(value.title));
    }

    if (value instanceof HaTagKey) {
      return HaRouterService.getTagPageRoute(value.id, HaDetailRoutePipe.getUrlPath(value.technicalName));
    }

    if (value instanceof HaPartner) {
      return HaRouterService.getPartnerPage(value.id, HaDetailRoutePipe.getUrlPath(value.name));
    }

    return null;
  }

  /**
   * An unpublished story has no public route yet, so it points at its edit page.
   */
  private static getStoryRoute(story: HaStory | HaListStoryDto): string {
    if (story.publishedAt == null) {
      return HaRouterService.getStoryEditRoute(story.id);
    }
    return HaRouterService.getStoryRoute(story.id, story.titlePath ?? '');
  }

  private static getUrlPath(value: string): string {
    return ClStringHelper.getCleanUrlPath(value) ?? '';
  }
}
