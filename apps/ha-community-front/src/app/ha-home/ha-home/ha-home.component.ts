import { NgTemplateOutlet } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButton } from '@angular/material/button';
import {
  MatAccordion,
  MatExpansionPanel,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle,
} from '@angular/material/expansion';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { FlLoaderModule } from '@monorepo/front-core-lib/fl-loader';
import { FlIconModule } from '@monorepo/front-core-lib/fl-svg-icon';
import { TranslatePipe } from '@ngx-translate/core';

import { HaFooterComponent } from '../../ha-core/ha-component/ha-footer/ha-footer/ha-footer.component';
import { HaHeaderComponent } from '../../ha-core/ha-component/ha-header/ha-header/ha-header.component';
import { HaConstellabHelper } from '../../ha-core/ha-model/ha-config/ha-constellab.helper';
import { HaEnvironmentHelper } from '../../ha-core/ha-model/ha-config/ha-environment.helper';
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
import { HaCommunityPageDirective } from '../../ha-core/ha-module/ha-core-directive/ha-community-page/ha-community-page.directive';
import { HaAgentService } from '../../ha-core/ha-service/ha-agent.service';
import { HaAuthenticatedUserService } from '../../ha-core/ha-service/ha-authenticated-user.service';
import { HaBrickService } from '../../ha-core/ha-service/ha-brick.service';
import { HaCommunityAppService } from '../../ha-core/ha-service/ha-community-app.service';
import { HaRouterService } from '../../ha-core/ha-service/ha-router.service';
import { HaStoryService } from '../../ha-core/ha-service/ha-story.service';
import { HaJsonLdState } from '../../ha-core/ha-state/ha-json-ld.state';
import { HaFeatureCardComponent } from '../ha-feature-card/ha-feature-card.component';
import { HaHomeItemsListSectionComponent } from '../ha-home-items-list-section/ha-home-items-list-section.component';
import { HaHomeSectionShineComponent } from '../ha-home-section-shine/ha-home-section-shine.component';

@Component({
  selector: 'ha-home',
  templateUrl: './ha-home.component.html',
  styleUrls: ['./ha-home.component.scss'],
  imports: [
    FlLoaderModule,
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
    MatButton,
    RouterLink,
    MatIcon,
    FlIconModule,
  ],
})
export class HaHomeComponent extends HaCommunityPageDirective implements OnInit {
  private authenticatedUserService: HaAuthenticatedUserService = inject(HaAuthenticatedUserService);
  private storyService: HaStoryService = inject(HaStoryService);
  private agentService: HaAgentService = inject(HaAgentService);
  private brickService: HaBrickService = inject(HaBrickService);
  private communityAppService: HaCommunityAppService = inject(HaCommunityAppService);
  private jsonLdState: HaJsonLdState = inject(HaJsonLdState);

  apps$: HaCommunityAppDatasourcePaginated<HaCommunityAppDatasourceFilters>;
  stories$: HaStoryListDatasourcePaginated<HaStoryFilters>;
  agents$: HaAgentDatasourcePaginated<HaAgentDatasourceFilters>;
  bricks$: HaBrickDatasourcePaginated<HaBrickDatasourceFilters>;

  user = toSignal(this.authenticatedUserService.getUser());

  signUpRoute = HaConstellabHelper.getConstellabSignupUrl();
  loginRoute = HaRouterService.getLoginRoute();

  productDocRoute = HaRouterService.getProductDocRoute();
  technicalDocRoute = HaRouterService.getTechDocRoute();

  homeVideoLink = HaEnvironmentHelper.getHomeVideoLink();

  discordUrl = HaConstellabHelper.getCommunityDiscordInviteUrl();

  ngOnInit(): void {
    super.setMetaTags(
      'ha.home.title',
      'ha.home.description',
      null,
      HaRouterService.getFullRoute(HaRouterService.getHomeRoute())
    );

    this.jsonLdState.setOrganizationJsonLdContent();

    this.stories$ = this.storyService.getAllPaginatedFiltered(4);
    this.stories$.getFirstPage({ title: '' });

    this.agents$ = this.agentService.getAllWithFiltersPaginated(4);
    this.agents$.getFirstPage({ spacesFilter: [], titleFilter: '' });

    this.bricks$ = this.brickService.getAllWithFiltersPaginated(4);
    this.bricks$.getFirstPage({ spacesFilter: [], titleFilter: '' });

    this.apps$ = this.communityAppService.getAllPaginated(4);
    this.apps$.getFirstPage({ titleFilter: '', spacesFilter: [] });
  }

  onVideoClick(event: MouseEvent): void {
    const srcElement: HTMLVideoElement = event.srcElement as HTMLVideoElement;
    if (srcElement && srcElement.paused) {
      srcElement.play();
    }
  }
}
