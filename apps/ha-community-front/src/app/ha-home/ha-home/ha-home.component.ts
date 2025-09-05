import { Component, inject, OnInit } from '@angular/core';
import { FlLoaderModule } from '@monorepo/front-core-lib/fl-loader';
import { Observable } from 'rxjs';

import { HaButtonComponent } from '../../ha-core/ha-component/ha-button/ha-button.component';
import { HaFooterComponent } from '../../ha-core/ha-component/ha-footer/ha-footer/ha-footer.component';
import { HaHeaderComponent } from '../../ha-core/ha-component/ha-header/ha-header.component';
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
import { HaUser } from '../../ha-core/ha-model/ha-entities/ha-user';
import { HaCommunityPageDirective } from '../../ha-core/ha-module/ha-core-directive/ha-community-page/ha-community-page.directive';
import { HaAgentService } from '../../ha-core/ha-service/ha-agent.service';
import { HaAuthenticatedUserService } from '../../ha-core/ha-service/ha-authenticated-user.service';
import { HaBrickService } from '../../ha-core/ha-service/ha-brick.service';
import { HaCommunityAppService } from '../../ha-core/ha-service/ha-community-app.service';
import { HaRouterService } from '../../ha-core/ha-service/ha-router.service';
import { HaStoryService } from '../../ha-core/ha-service/ha-story.service';
import { HaHomeSectionShineComponent } from '../ha-home-section-shine/ha-home-section-shine.component';
import { HaFeatureCardComponent } from '../../ha-main/ha-feature-card/ha-feature-card.component';
import { HaHomeItemsListSectionComponent } from '../ha-home-items-list-section/ha-home-items-list-section.component';
import { NgTemplateOutlet } from '@angular/common';
import { MatAccordion, MatExpansionPanel, MatExpansionPanelHeader, MatExpansionPanelTitle } from '@angular/material/expansion';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'ha-home',
  templateUrl: './ha-home.component.html',
  styleUrls: ['./ha-home.component.scss'],
  imports: [
    FlLoaderModule,
    HaButtonComponent,
    HaFooterComponent,
    HaHeaderComponent,
    HaHomeSectionShineComponent,
    HaFeatureCardComponent,
    HaHomeItemsListSectionComponent,
    NgTemplateOutlet,
    MatExpansionPanel,
    MatAccordion,
    MatExpansionPanelHeader,
    MatExpansionPanelTitle,
    TranslatePipe,
  ],
})
export class HaHomeComponent extends HaCommunityPageDirective implements OnInit {
  apps$: HaCommunityAppDatasourcePaginated<HaCommunityAppDatasourceFilters>;
  stories$: HaStoryListDatasourcePaginated<HaStoryFilters>;
  agents$: HaAgentDatasourcePaginated<HaAgentDatasourceFilters>;
  bricks$: HaBrickDatasourcePaginated<HaBrickDatasourceFilters>;
  private authenticatedUserService: HaAuthenticatedUserService = inject(HaAuthenticatedUserService);
  user$: Observable<HaUser> = this.authenticatedUserService.getUser();
  private storyService: HaStoryService = inject(HaStoryService);
  private agentService: HaAgentService = inject(HaAgentService);
  private brickService: HaBrickService = inject(HaBrickService);
  private communityAppService: HaCommunityAppService = inject(HaCommunityAppService);

  ngOnInit(): void {
    super.setMetaTags(
      'ha.home.title',
      'ha.home.description',
      null,
      HaRouterService.getFullRoute(HaRouterService.getHomeRoute())
    );

    this.stories$ = this.storyService.getAllPaginatedFiltered(4);
    this.stories$.getFirstPage({ title: '', topics: [] });

    this.agents$ = this.agentService.getAllWithFiltersPaginated(4);
    this.agents$.getFirstPage({ spacesFilter: [], titleFilter: '' });

    this.bricks$ = this.brickService.getAllWithFiltersPaginated(4);
    this.bricks$.getFirstPage({ spacesFilter: [], titleFilter: '' });

    this.apps$ = this.communityAppService.getAllPaginated(4);
    this.apps$.getFirstPage({ titleFilter: '', spacesFilter: [] });
  }
}
