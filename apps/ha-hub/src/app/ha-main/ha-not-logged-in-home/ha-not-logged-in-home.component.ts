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
import { HaEmailSignUpComponent } from '../../ha-core/ha-component/ha-email-sign-up/ha-email-sign-up.component';
import { MatTab, MatTabGroup } from '@angular/material/tabs';
import { MatAnchor, MatButton } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { AsyncPipe, NgFor, NgOptimizedImage } from '@angular/common';
import { CoCommunityLibModule } from '@monorepo/community-lib';
import { MatIcon } from '@angular/material/icon';
import { HaGithubStarButtonComponent } from '../../ha-core/ha-component/ha-github-star-button/ha-github-star-button.component';
import { TranslatePipe } from '@ngx-translate/core';
import { FlCorePipeModule } from '@monorepo/front-core-lib/fl-core-pipe';
import { HaDetailRoutePipe } from '../../ha-core/ha-module/ha-core-pipe/ha-detail-route/ha-detail-route.pipe';
import { HaBrickImagePipe } from '../../ha-core/ha-module/ha-core-pipe/ha-brick-image/ha-brick-image.pipe';

@Component({
  selector: 'ha-not-logged-in-home',
  templateUrl: './ha-not-logged-in-home.component.html',
  styleUrl: './ha-not-logged-in-home.component.scss',
  imports: [
    HaEmailSignUpComponent,
    MatTabGroup,
    MatTab,
    MatButton,
    RouterLink,
    NgFor,
    CoCommunityLibModule,
    MatAnchor,
    MatIcon,
    NgOptimizedImage,
    HaGithubStarButtonComponent,
    AsyncPipe,
    TranslatePipe,
    FlCorePipeModule,
    HaDetailRoutePipe,
    HaBrickImagePipe,
  ],
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
