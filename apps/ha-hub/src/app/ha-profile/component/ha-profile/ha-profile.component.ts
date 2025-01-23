import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { mergeMap, Observable } from 'rxjs';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HaUserService } from '../../../ha-core/ha-service/ha-user.service';
import { map, share } from 'rxjs/operators';
import { HaSpace } from '../../../ha-core/ha-model/ha-entities/ha-space.class';
import { HaSpaceService } from '../../../ha-core/ha-service/ha-space.service';
import { HaAgentDatasourcePaginated } from '../../../ha-core/ha-model/ha-entities/ha-agent.class';
import { HaAgentService } from '../../../ha-core/ha-service/ha-agent.service';
import { HaBrickService } from '../../../ha-core/ha-service/ha-brick.service';
import { HaBrickDatasourcePaginated } from '../../../ha-core/ha-model/ha-entities/ha-brick.class';
import { HaStoryService } from '../../../ha-core/ha-service/ha-story.service';
import { HaStoryDatasourcePaginated } from '../../../ha-core/ha-model/ha-entities/ha-story.class';
import { ClStringHelper, ClSubscriptionHandler } from '@monorepo/core-lib';
import { FlDialogService, FlUserConfig } from '@monorepo/front-core-lib';
import {
  HaProfileEditDialogComponent,
  HaProfileEditDialogData,
} from '../ha-profile-edit-dialog/ha-profile-edit-dialog.component';
import { CoUser } from '@monorepo/community-lib';
import { HaCommunityPage } from '../../../ha-core/utils/ha-community.page';
import { HaRouterService } from '../../../ha-core/ha-service/ha-router.service';
import { HaJsonLdState } from '../../../ha-core/ha-state/ha-json-ld.state';
import { HaConstellabHelper } from '../../../ha-core/ha-model/ha-config/ha-constellab.helper';
import {
  HaRunStatAggregate,
  HaRunStatAggregateObjectType,
} from '../../../ha-core/ha-model/ha-entities/ha-run-stat-aggregate.class';
import { HaRunStatAggregateService } from '../../../ha-core/ha-service/ha-run-stat-aggregate.service';
import { HaAuthenticatedUserService } from '../../../ha-core/ha-service/ha-authenticated-user.service';
import { FlUserModule } from '../../../../../../../libs/front-core-lib/src/lib/module/fl-user/fl-user.module';
import { MatButton } from '@angular/material/button';
import { HaProfileAttachedLinkComponent } from '../ha-profile-attached-link/ha-profile-attached-link.component';
import { FlKeyValueModule } from '../../../../../../../libs/front-core-lib/src/lib/module/fl-key-value/fl-key-value.module';
import { FlTextIconModule } from '../../../../../../../libs/front-core-lib/src/lib/module/fl-text-icon/fl-text-icon.module';
import { MatIcon } from '@angular/material/icon';
import { CoCommunityLibModule } from '../../../../../../../libs/community-lib/src/lib/co-community-lib.module';
import { HaRunStatAggregatePanelComponent } from '../../../ha-core/ha-component/ha-run-stat-aggregate-panel/ha-run-stat-aggregate-panel.component';
import { MatTabGroup, MatTab, MatTabLabel } from '@angular/material/tabs';
import { FlInfiniteScrollModule } from '../../../../../../../libs/front-core-lib/src/lib/module/fl-inifite-scroll/fl-infinite-scroll.module';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { AsyncPipe } from '@angular/common';
import { FlCorePipeModule } from '../../../../../../../libs/front-core-lib/src/lib/module/fl-core-pipe/fl-core-pipe.module';
import { TranslatePipe } from '@ngx-translate/core';
import { HaDetailRoutePipe } from '../../../ha-core/ha-module/ha-core-pipe/ha-detail-route/ha-detail-route.pipe';
import { HaBrickImagePipe } from '../../../ha-core/ha-module/ha-core-pipe/ha-brick-image/ha-brick-image.pipe';

export interface HaProfileDatasourceFilters {
  userId: string;
}

@Component({
  selector: 'ha-profile',
  templateUrl: './ha-profile.component.html',
  styleUrl: './ha-profile.component.scss',
  imports: [
    FlUserModule,
    MatButton,
    HaProfileAttachedLinkComponent,
    FlKeyValueModule,
    FlTextIconModule,
    MatIcon,
    CoCommunityLibModule,
    HaRunStatAggregatePanelComponent,
    MatTabGroup,
    MatTab,
    MatTabLabel,
    FlInfiniteScrollModule,
    CdkScrollable,
    RouterLink,
    AsyncPipe,
    FlCorePipeModule,
    TranslatePipe,
    HaDetailRoutePipe,
    HaBrickImagePipe,
  ],
})
export class HaProfileComponent extends HaCommunityPage implements OnInit, OnDestroy {
  private authenticatedUserService: HaAuthenticatedUserService = inject(HaAuthenticatedUserService);
  private userService: HaUserService = inject(HaUserService);
  private spaceService: HaSpaceService = inject(HaSpaceService);
  private agentService: HaAgentService = inject(HaAgentService);
  private brickService: HaBrickService = inject(HaBrickService);
  private storyService: HaStoryService = inject(HaStoryService);
  private dialogService: FlDialogService = inject(FlDialogService);
  private userConfig: FlUserConfig = inject(FlUserConfig);
  private route: ActivatedRoute = inject(ActivatedRoute);
  private router: Router = inject(Router);
  private jsonLdState: HaJsonLdState = inject(HaJsonLdState);
  private runStatAggregateService: HaRunStatAggregateService = inject(HaRunStatAggregateService);

  foaLink: string = HaConstellabHelper.getGencoveryFOAUrl();

  subscriptionHandler: ClSubscriptionHandler = new ClSubscriptionHandler();
  user$: Observable<CoUser>;

  isCurrentUser$: Observable<boolean>;
  commonSpace$: Observable<HaSpace[]>;
  agents$: HaAgentDatasourcePaginated<HaProfileDatasourceFilters>;
  stories$: HaStoryDatasourcePaginated<HaProfileDatasourceFilters>;
  bricks$: HaBrickDatasourcePaginated<HaProfileDatasourceFilters>;

  userRunStatAggregate$: Observable<HaRunStatAggregate>;

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

  private init(): void {
    this.agents$ = this.agentService.getUserAgentsPaginated();
    this.bricks$ = this.brickService.getUserBricksPaginated();
    this.stories$ = this.storyService.getUserStoriesPaginated();

    const id$ = this.route.params.pipe(map((params) => params['id']));

    this.userRunStatAggregate$ = id$.pipe(
      mergeMap((id) =>
        this.runStatAggregateService.getObjectRunStatAggregate(id, HaRunStatAggregateObjectType.USER)
      )
    );

    this.commonSpace$ = id$.pipe(mergeMap((id) => this.spaceService.getUserCommonSpace(id)));

    this.user$ = id$.pipe(
      mergeMap((id) => {
        return this.userService.getUserById(id);
      }),
      share()
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
  }
}
