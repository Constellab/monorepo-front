import { AsyncPipe, NgClass } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { CoCommunityAppListItemComponent, CoCommunityLibModule } from '@monorepo/community-lib';
import { ClStringHelper } from '@monorepo/core-lib';
import { FlCorePipeModule } from '@monorepo/front-core-lib/fl-core-pipe';
import { TranslatePipe } from '@ngx-translate/core';

import {
  HaAgentDatasourceFilters,
  HaAgentDatasourcePaginated,
} from '../../ha-core/ha-model/ha-entities/ha-agent.class';
import {
  HaBrickDatasourceFilters,
  HaBrickDatasourcePaginated,
} from '../../ha-core/ha-model/ha-entities/ha-brick.class';
import {
  HaCommunityAppDatasourceFilters,
  HaCommunityAppDatasourcePaginated,
} from '../../ha-core/ha-model/ha-entities/ha-community-app.class';
import {
  HaStoryFilters,
  HaStoryListDatasourcePaginated,
} from '../../ha-core/ha-model/ha-entities/ha-story.class';
import { HaAppPicturePipe } from '../../ha-core/ha-module/ha-core-pipe/ha-app-picture/ha-app-picture.pipe';
import { HaBrickImagePipe } from '../../ha-core/ha-module/ha-core-pipe/ha-brick-image/ha-brick-image.pipe';
import { HaDetailRoutePipe } from '../../ha-core/ha-module/ha-core-pipe/ha-detail-route/ha-detail-route.pipe';
import { HaAgentService } from '../../ha-core/ha-service/ha-agent.service';
import { HaBrickService } from '../../ha-core/ha-service/ha-brick.service';
import { HaCommunityAppService } from '../../ha-core/ha-service/ha-community-app.service';
import { HaRouterService } from '../../ha-core/ha-service/ha-router.service';
import { HaStoryService } from '../../ha-core/ha-service/ha-story.service';

export type HaHomeItemsListSectionType = 'stories' | 'apps' | 'agents' | 'bricks';

@Component({
  selector: 'ha-home-items-list-section',
  templateUrl: './ha-home-items-list-section.component.html',
  styleUrls: ['./ha-home-items-list-section.component.scss'],
  imports: [
    NgClass,
    TranslatePipe,
    AsyncPipe,
    CoCommunityLibModule,
    FlCorePipeModule,
    HaDetailRoutePipe,
    RouterLink,
    CoCommunityAppListItemComponent,
    HaAppPicturePipe,
    HaBrickImagePipe,
    MatButton,
  ],
})
export class HaHomeItemsListSectionComponent implements OnInit {
  private storyService = inject(HaStoryService);
  private agentService = inject(HaAgentService);
  private communityAppService = inject(HaCommunityAppService);
  private brickService = inject(HaBrickService);

  itemTypes: HaHomeItemsListSectionType[] = ['stories', 'apps', 'agents', 'bricks'];
  currentType = 'stories' as HaHomeItemsListSectionType;
  currentTypeListRoute: string = HaRouterService.getStoriesListRoute();

  apps$: HaCommunityAppDatasourcePaginated<HaCommunityAppDatasourceFilters>;
  stories$: HaStoryListDatasourcePaginated<HaStoryFilters>;
  agents$: HaAgentDatasourcePaginated<HaAgentDatasourceFilters>;
  bricks$: HaBrickDatasourcePaginated<HaBrickDatasourceFilters>;

  ngOnInit(): void {
    this.stories$ = this.storyService.getAllPaginatedFiltered(6);
    this.stories$.getFirstPage({ title: '' });

    this.agents$ = this.agentService.getAllWithFiltersPaginated(6);
    this.agents$.getFirstPage({ spacesFilter: [], titleFilter: '' });

    this.bricks$ = this.brickService.getAllWithFiltersPaginated(6);
    this.bricks$.getFirstPage({ spacesFilter: [], titleFilter: '' });

    this.apps$ = this.communityAppService.getAllPaginated(6);
    this.apps$.getFirstPage({ titleFilter: '', spacesFilter: [] });
  }

  changeCurrentType(type: HaHomeItemsListSectionType): void {
    this.currentType = type;
    switch (type) {
      case 'stories':
        this.currentTypeListRoute = HaRouterService.getStoriesListRoute();
        break;
      case 'apps':
        this.currentTypeListRoute = HaRouterService.getCommunityAppListRoute();
        break;
      case 'agents':
        this.currentTypeListRoute = HaRouterService.getAgentsListRoute();
        break;
      case 'bricks':
        this.currentTypeListRoute = HaRouterService.getBrickListRoute();
        break;
    }
  }

  getStoryImageLink(storyId: string, imageLinkOrId?: string): string {
    if (!imageLinkOrId) {
      return '';
    }
    return ClStringHelper.isHttpLink(imageLinkOrId)
      ? imageLinkOrId
      : this.storyService.getImageUrl(storyId, imageLinkOrId);
  }
}
