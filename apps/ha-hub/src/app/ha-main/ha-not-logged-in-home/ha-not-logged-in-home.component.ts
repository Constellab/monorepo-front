import { Component, inject, input, Signal } from '@angular/core';
import { HaConstellabHelper } from '../../ha-core/ha-model/ha-config/ha-constellab.helper';
import { HaRouterService } from '../../ha-core/ha-service/ha-router.service';
import { HaEnvironmentHelper } from '../../ha-core/ha-model/ha-config/ha-environment.helper';
import {
  HaStoryDatasourcePaginated,
  HaStoryFilters,
} from '../../ha-core/ha-model/ha-entities/ha-story.class';
import {
  HaAgentDatasourceFilters,
  HaAgentDatasourcePaginated,
} from '../../ha-core/ha-model/ha-entities/ha-agent.class';
import {
  HaBrickDatasourceFilters,
  HaBrickDatasourcePaginated,
} from '../../ha-core/ha-model/ha-entities/ha-brick.class';
import { ClStringHelper } from '@monorepo/core-lib';
import { HaStoryService } from '../../ha-core/ha-service/ha-story.service';
import { HaThemeState } from '../../ha-core/ha-state/ha-theme.state';
import { HaUserService } from '../../ha-core/ha-service/ha-user.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'ha-not-logged-in-home',
  templateUrl: './ha-not-logged-in-home.component.html',
  styleUrl: './ha-not-logged-in-home.component.scss',
})
export class HaNotLoggedInHomeComponent {
  private storyService: HaStoryService = inject(HaStoryService);
  private themeState: HaThemeState = inject(HaThemeState);
  private userService: HaUserService = inject(HaUserService);

  stories$ = input<HaStoryDatasourcePaginated<HaStoryFilters>>();
  agents$ = input<HaAgentDatasourcePaginated<HaAgentDatasourceFilters>>();
  bricks$ = input<HaBrickDatasourcePaginated<HaBrickDatasourceFilters>>();

  isDarkTheme: Signal<boolean> = this.themeState.isDarkTheme;

  constellabUrl: string = HaConstellabHelper.getConstellabUrl();
  gencoveryFOALink: string = HaConstellabHelper.getGencoveryFOAUrl();

  storyListRoute: string = HaRouterService.getStoriesListRoute();
  agentsListRoute: string = HaRouterService.getAgentsListRoute();
  brickListRoute: string = HaRouterService.getBrickListRoute();

  techDocRoute: string = HaRouterService.getTechDocRoute();
  productDocRoute: string = HaRouterService.getProductDocRoute();
  iconsRoute: string = HaRouterService.getIconsRoute();

  discordLink: string = HaEnvironmentHelper.getDiscordLink();
  gwsCoreRepoLink: string = HaRouterService.getGwsCoreRepoLink();
  gLabLink: string = HaRouterService.getDockerHubGlabLink();
  usersCount$: Observable<number> = this.userService.getCount();

  selectedVideoIndex: number = 0;

  video_sections = ['stories', 'agents', 'bricks'];

  selectVideo(index: number): void {
    this.selectedVideoIndex = index;
  }

  getStoryImageLink(storyId: string, imageLinkOrId?: string): string {
    if (!imageLinkOrId) {
      return '';
    }
    return ClStringHelper.isHttpLink(imageLinkOrId)
      ? imageLinkOrId
      : this.storyService.getImageUrl(storyId, imageLinkOrId);
  }

  onVideoClick(event: MouseEvent): void {
    const srcElement: HTMLVideoElement = event.srcElement as HTMLVideoElement;
    if (srcElement && srcElement.paused) {
      srcElement.play();
    }
  }
}
