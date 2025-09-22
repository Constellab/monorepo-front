import { afterNextRender, Component, inject, Injector, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CoCommunityAppListItemComponent, CoCommunityLibModule, CoUser, CoVisibilityBadgeComponent } from '@monorepo/community-lib';
import { ClStringHelper, ClSubscriptionHandler } from '@monorepo/core-lib';
import { FlCorePipeModule } from '@monorepo/front-core-lib/fl-core-pipe';
import { FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import { FlInfiniteScrollModule } from '@monorepo/front-core-lib/fl-infinite-scroll';
import { FlKeyValueModule } from '@monorepo/front-core-lib/fl-key-value';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { FlUserConfig, FlUserModule } from '@monorepo/front-core-lib/fl-user';
import { mergeMap, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HaConstellabHelper } from '../../../ha-core/ha-model/ha-config/ha-constellab.helper';
import { HaAgentDatasourcePaginated } from '../../../ha-core/ha-model/ha-entities/ha-agent.class';
import { HaBrickDatasourcePaginated } from '../../../ha-core/ha-model/ha-entities/ha-brick.class';
import { HaCommunityAppDatasourcePaginated } from '../../../ha-core/ha-model/ha-entities/ha-community-app.class';
import {
  HaRunStatAggregate,
  HaRunStatAggregateObjectType,
} from '../../../ha-core/ha-model/ha-entities/ha-run-stat-aggregate.class';
import { HaSpace } from '../../../ha-core/ha-model/ha-entities/ha-space.class';
import { HaStoryListDatasourcePaginated } from '../../../ha-core/ha-model/ha-entities/ha-story.class';
import {
  HaCommunityPageDirective
} from '../../../ha-core/ha-module/ha-core-directive/ha-community-page/ha-community-page.directive';
import { HaAgentService } from '../../../ha-core/ha-service/ha-agent.service';
import { HaAuthenticatedUserService } from '../../../ha-core/ha-service/ha-authenticated-user.service';
import { HaBrickService } from '../../../ha-core/ha-service/ha-brick.service';
import { HaCommunityAppService } from '../../../ha-core/ha-service/ha-community-app.service';
import { HaRouterService } from '../../../ha-core/ha-service/ha-router.service';
import { HaRunStatAggregateService } from '../../../ha-core/ha-service/ha-run-stat-aggregate.service';
import { HaSpaceService } from '../../../ha-core/ha-service/ha-space.service';
import { HaStoryService } from '../../../ha-core/ha-service/ha-story.service';
import { HaUserService } from '../../../ha-core/ha-service/ha-user.service';
import { HaJsonLdState } from '../../../ha-core/ha-state/ha-json-ld.state';
import {
  HaProfileEditDialogComponent,
  HaProfileEditDialogData,
} from '../ha-profile-edit-dialog/ha-profile-edit-dialog.component';
import { HaHeaderComponent } from '../../../ha-core/ha-component/ha-header/ha-header/ha-header.component';
import { AsyncPipe, NgClass } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import {
  HaHomeItemsListSectionType,
} from '../../../ha-home/ha-home-items-list-section/ha-home-items-list-section.component';
import { HaDetailRoutePipe } from '../../../ha-core/ha-module/ha-core-pipe/ha-detail-route/ha-detail-route.pipe';
import { HaListOfItemsComponent } from '../../../ha-core/ha-component/ha-list-of-items/ha-list-of-items.component';
import { HaAppPicturePipe } from '../../../ha-core/ha-module/ha-core-pipe/ha-app-picture/ha-app-picture.pipe';
import { HaBrickImagePipe } from '../../../ha-core/ha-module/ha-core-pipe/ha-brick-image/ha-brick-image.pipe';
import { HaFooterComponent } from '../../../ha-core/ha-component/ha-footer/ha-footer/ha-footer.component';

export interface HaProfileDatasourceFilters {
  userId: string;
}

export type HaProfileSectionType = 'stories' | 'apps' | 'agents' | 'bricks';

@Component({
  selector: 'ha-profile',
  templateUrl: './ha-profile.component.html',
  styleUrl: './ha-profile.component.scss',
  imports: [
    FlUserModule,
    FlKeyValueModule,
    FlTextIconModule,
    CoCommunityLibModule,
    FlInfiniteScrollModule,
    FlCorePipeModule,
    HaHeaderComponent,
    AsyncPipe,
    TranslatePipe,
    CoVisibilityBadgeComponent,
    NgClass,
    HaDetailRoutePipe,
    HaListOfItemsComponent,
    RouterLink,
    CoCommunityAppListItemComponent,
    HaAppPicturePipe,
    HaBrickImagePipe,
    HaFooterComponent,
  ],
})
export class HaProfileComponent extends HaCommunityPageDirective implements OnInit, OnDestroy {
  private authenticatedUserService: HaAuthenticatedUserService = inject(HaAuthenticatedUserService);
  private userService: HaUserService = inject(HaUserService);
  private spaceService: HaSpaceService = inject(HaSpaceService);
  private appService: HaCommunityAppService = inject(HaCommunityAppService);
  private agentService: HaAgentService = inject(HaAgentService);
  private brickService: HaBrickService = inject(HaBrickService);
  private storyService: HaStoryService = inject(HaStoryService);
  private dialogService: FlDialogService = inject(FlDialogService);
  private userConfig: FlUserConfig = inject(FlUserConfig);
  private route: ActivatedRoute = inject(ActivatedRoute);
  private router: Router = inject(Router);
  private jsonLdState: HaJsonLdState = inject(HaJsonLdState);
  private runStatAggregateService: HaRunStatAggregateService = inject(HaRunStatAggregateService);
  private injector: Injector = inject(Injector);

  foaLink: string = HaConstellabHelper.getGencoveryFOAUrl();

  subscriptionHandler: ClSubscriptionHandler = new ClSubscriptionHandler();
  user$: Observable<CoUser>;

  isCurrentUser$: Observable<boolean>;
  commonSpace$: Observable<HaSpace[]>;
  agents$: HaAgentDatasourcePaginated<HaProfileDatasourceFilters>;
  stories$: HaStoryListDatasourcePaginated<HaProfileDatasourceFilters>;
  bricks$: HaBrickDatasourcePaginated<HaProfileDatasourceFilters>;
  apps$: HaCommunityAppDatasourcePaginated<HaProfileDatasourceFilters>;

  userRunStatAggregate$: Observable<HaRunStatAggregate>;

  itemTypes: HaProfileSectionType[] = ['stories', 'apps', 'agents', 'bricks'];
  currentType = 'stories' as HaProfileSectionType;

  ngOnInit(): void {
    this.init();
  }

  openEditProfileDialog(user: CoUser): void {
    this.dialogService
      .openMediumDialog(HaProfileEditDialogComponent, {
        data: {
          user: user,
        } as HaProfileEditDialogData,
      })
      .afterClosed()
      .subscribe((user) => {
        if (user) {
          this.init();
        }
      });
  }

  getStoryImageLink(storyId: string, imageLinkOrId?: string): string {
    if (!imageLinkOrId) {
      return '';
    }
    return ClStringHelper.isHttpLink(imageLinkOrId)
      ? imageLinkOrId
      : this.storyService.getImageUrl(storyId, imageLinkOrId);
  }

  changeCurrentType(type: HaHomeItemsListSectionType): void {
    this.currentType = type;
  }

  private init(): void {
    this.apps$ = this.appService.getUserCommunityAppsPaginated();
    this.agents$ = this.agentService.getUserAgentsPaginated();
    this.bricks$ = this.brickService.getUserBricksPaginated();
    this.stories$ = this.storyService.getUserStoriesPaginated();

    const id$ = this.route.params.pipe(map((params) => params['id']));

    this.userRunStatAggregate$ = id$.pipe(
      mergeMap((id) =>
        this.runStatAggregateService.getObjectRunStatAggregate(id, HaRunStatAggregateObjectType.USER)
      )
    );

    afterNextRender(
      () => {
        this.commonSpace$ = id$.pipe(mergeMap((id) => this.spaceService.getUserCommonSpace(id)));
      },
      { injector: this.injector }
    );

    this.user$ = id$.pipe(
      mergeMap((id) => {
        return this.userService.getUserById(id);
      })
      // TODO: Share avec hydration
      // share()
    );

    this.isCurrentUser$ = id$.pipe(
      mergeMap((id) => {
        return this.authenticatedUserService.getUser().pipe(
          map((authUser) => {
            return authUser && authUser.id === id;
          })
        );
      })
    );

    this.subscriptionHandler.add(id$.subscribe((id) => this.updateDatasources(id)));

    this.subscriptionHandler.add(this.user$.subscribe((user) => this.onUser(user)));
  }

  private updateDatasources(userId: string): void {
    this.agents$.getFirstPage({
      userId: userId,
    });
    this.bricks$.getFirstPage({
      userId: userId,
    });
    this.stories$.getFirstPage({
      userId: userId,
    });
    this.apps$.getFirstPage({
      userId: userId,
    });
  }

  private onUser(user: CoUser): void {
    this.jsonLdState.setProfilePageJsonLdContent(
      user,
      user.photo ? this.userConfig.getUserPhotoUrl(user.photo) : null
    );

    super.setMetaTags(
      {
        text: 'ha.user.title',
        translateParam: { param: { alias: user.alias } },
      },
      {
        text: 'ha.user.description',
        translateParam: { param: { alias: user.alias } },
      },
      user.photo ? this.userConfig.getUserPhotoUrl(user.photo) : null,
      HaRouterService.getFullRoute(this.router.url)
    );
  }

  ngOnDestroy(): void {
    this.jsonLdState.clearJsonLdContent();
    this.subscriptionHandler.unsubscribe();
    this.stories$.disconnect();
    this.agents$.disconnect();
    this.bricks$.disconnect();
    this.apps$.disconnect();
  }
}
