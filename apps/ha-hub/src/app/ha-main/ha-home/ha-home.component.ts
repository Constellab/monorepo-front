import { Component, OnInit, Signal } from '@angular/core';
import { HaConstellabHelper } from '../../ha-core/ha-model/ha-config/ha-constellab.helper';
import { HaMetadataService } from '../../ha-core/ha-service/ha-metadata.service';
import { HaRouterService } from '../../ha-core/ha-service/ha-router.service';
import { HaStoryService } from '../../ha-core/ha-service/ha-story.service';
import { HaStoryDatasourcePaginated } from '../../ha-core/ha-model/ha-entities/ha-story.class';
import { ClStringHelper } from '@monorepo/core-lib';
import { HaAgentDatasourcePaginated } from '../../ha-core/ha-model/ha-entities/ha-agent.class';
import { HaAgentService } from '../../ha-core/ha-service/ha-agent.service';
import { HaBrickDatasourcePaginated } from '../../ha-core/ha-model/ha-entities/ha-brick.class';
import { HaBrickService } from '../../ha-core/ha-service/ha-brick.service';
import { HaUserService } from '../../ha-core/ha-service/ha-user.service';
import { HaThemeState } from '../../ha-core/ha-state/ha-theme.state';
import { HaEnvironmentHelper } from '../../ha-core/ha-model/ha-config/ha-environment.helper';

@Component({
  selector: 'ha-ha-home',
  templateUrl: './ha-home.component.html',
  styleUrls: ['./ha-home.component.scss'],
})
export class HaHomeComponent implements OnInit {
  constellabUrl: string = HaConstellabHelper.getConstellabUrl();

  stories$: HaStoryDatasourcePaginated;
  agents$: HaAgentDatasourcePaginated;
  bricks$: HaBrickDatasourcePaginated;

  storyListRoute: string = HaRouterService.getStoriesListRoute();
  agentsListRoute: string = HaRouterService.getAgentsListRoute();
  brickListRoute: string = HaRouterService.getBrickListRoute();

  techDocRoute: string = HaRouterService.getTechDocRoute();
  productDocRoute: string = HaRouterService.getProductDocRoute();
  iconsRoute: string = HaRouterService.getIconsRoute();

  discordLink: string = HaEnvironmentHelper.getDiscordLink();
  gwsCoreRepoLink: string = HaRouterService.getGwsCoreRepoLink();
  gLabLink: string = HaRouterService.getDockerHubGlabLink();
  signupLink: string = HaConstellabHelper.getConstellabSignupUrl();
  usersCount: number = 0;

  isDarkTheme: Signal<boolean> = this.themeState.isDarkTheme;

  constructor(
    private metadataService: HaMetadataService,
    private storyService: HaStoryService,
    private agentService: HaAgentService,
    private brickService: HaBrickService,
    private userService: HaUserService,
    private themeState: HaThemeState
  ) {}

  ngOnInit(): void {
    this.metadataService.setPageTitle('ha.home.title');
    this.metadataService.addMetaTag('description', 'ha.home.description');

    this.stories$ = this.storyService.getAllPaginatedFiltered(4);
    this.stories$.getFirstPage({ spacesFilter: [], titleFilter: '' });

    this.agents$ = this.agentService.getAllWithFiltersPaginated(4);
    this.agents$.getFirstPage({ spacesFilter: [], titleFilter: '' });

    this.bricks$ = this.brickService.getAllWithFiltersPaginated(4);
    this.bricks$.getFirstPage({ spacesFilter: [], titleFilter: '' });

    this.userService.getCount().subscribe((count) => (this.usersCount = count));
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
