import { AfterContentInit, Component, inject, input, OnInit, PLATFORM_ID, Signal } from '@angular/core';
import { HaConstellabHelper } from '../../ha-core/ha-model/ha-config/ha-constellab.helper';
import { HaRouterService } from '../../ha-core/ha-service/ha-router.service';
import { HaStoryService } from '../../ha-core/ha-service/ha-story.service';
import {
  HaStoryFilters,
  HaStoryListDatasourcePaginated,
} from '../../ha-core/ha-model/ha-entities/ha-story.class';
import { ClStringHelper } from '@monorepo/core-lib';
import {
  HaAgentDatasourceFilters,
  HaAgentDatasourcePaginated,
} from '../../ha-core/ha-model/ha-entities/ha-agent.class';
import {
  HaBrickDatasourceFilters,
  HaBrickDatasourcePaginated,
} from '../../ha-core/ha-model/ha-entities/ha-brick.class';
import { HaUserService } from '../../ha-core/ha-service/ha-user.service';
import { HaThemeState } from '../../ha-core/ha-state/ha-theme.state';
import { AsyncPipe, isPlatformBrowser, NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CoCommunityAppListItemComponent, CoCommunityLibModule } from '@monorepo/community-lib';
import { MatAnchor } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';
import { FlCorePipeModule } from '@monorepo/front-core-lib/fl-core-pipe';
import { HaDetailRoutePipe } from '../../ha-core/ha-module/ha-core-pipe/ha-detail-route/ha-detail-route.pipe';
import { HaBrickImagePipe } from '../../ha-core/ha-module/ha-core-pipe/ha-brick-image/ha-brick-image.pipe';
import {
  HaCommunityAppDatasourceFilters,
  HaCommunityAppDatasourcePaginated,
} from '../../ha-core/ha-model/ha-entities/ha-community-app.class';
import { HaAppPicturePipe } from '../../ha-core/ha-module/ha-core-pipe/ha-app-picture/ha-app-picture.pipe';

@Component({
  selector: 'ha-logged-in-home',
  templateUrl: './ha-logged-in-home.component.html',
  styleUrls: ['./ha-logged-in-home.component.scss'],
  imports: [
    RouterLink,
    CoCommunityLibModule,
    MatAnchor,
    MatIcon,
    NgOptimizedImage,
    AsyncPipe,
    TranslatePipe,
    FlCorePipeModule,
    HaDetailRoutePipe,
    HaBrickImagePipe,
    CoCommunityAppListItemComponent,
    HaAppPicturePipe,
  ],
})
export class HaLoggedInHomeComponent implements OnInit, AfterContentInit {
  private storyService: HaStoryService = inject(HaStoryService);
  private userService: HaUserService = inject(HaUserService);
  private themeState: HaThemeState = inject(HaThemeState);
  private platformId: object = inject(PLATFORM_ID);

  apps$ = input<HaCommunityAppDatasourcePaginated<HaCommunityAppDatasourceFilters>>();
  stories$ = input<HaStoryListDatasourcePaginated<HaStoryFilters>>();
  agents$ = input<HaAgentDatasourcePaginated<HaAgentDatasourceFilters>>();
  bricks$ = input<HaBrickDatasourcePaginated<HaBrickDatasourceFilters>>();

  constellabUrl: string = HaConstellabHelper.getConstellabUrl();

  appsListRoute: string = HaRouterService.getCommunityAppListRoute();
  storyListRoute: string = HaRouterService.getStoriesListRoute();
  agentsListRoute: string = HaRouterService.getAgentsListRoute();
  brickListRoute: string = HaRouterService.getBrickListRoute();

  techDocRoute: string = HaRouterService.getTechDocRoute();
  productDocRoute: string = HaRouterService.getProductDocRoute();
  iconsRoute: string = HaRouterService.getIconsRoute();

  usersCount: number = 0;

  contentIsInit: boolean;

  isDarkTheme: Signal<boolean> = this.themeState.isDarkTheme;

  ngOnInit(): void {
    this.userService.getCount().subscribe((count) => (this.usersCount = count));
  }

  ngAfterContentInit(): void {
    if (isPlatformBrowser(this.platformId)) this.contentIsInit = true;
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
