import { AsyncPipe, NgClass } from '@angular/common';
import { Component, computed, inject, OnDestroy, OnInit, Signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  CoCommunityAppListItemComponent,
  CoCommunityLibModule,
  CoUser,
  CoVisibilityBadgeComponent,
} from '@monorepo/community-lib';
import { ClStringHelper, ClSubscriptionHandler } from '@monorepo/core-lib';
import { FlCorePipeModule } from '@monorepo/front-core-lib/fl-core-pipe';
import { FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import { FlInfiniteScrollModule } from '@monorepo/front-core-lib/fl-infinite-scroll';
import { FlKeyValueModule } from '@monorepo/front-core-lib/fl-key-value';
import { FlLoaderModule } from '@monorepo/front-core-lib/fl-loader';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { FlUserConfig, FlUserModule } from '@monorepo/front-core-lib/fl-user';
import { TeTextEditorModule } from '@monorepo/text-editor';
import { TranslatePipe } from '@ngx-translate/core';

import { HaFooterComponent } from '../../../ha-core/ha-component/ha-footer/ha-footer/ha-footer.component';
import { HaHeaderComponent } from '../../../ha-core/ha-component/ha-header/ha-header/ha-header.component';
import { HaListOfItemsComponent } from '../../../ha-core/ha-component/ha-list-of-items/ha-list-of-items.component';
import { HaConstellabHelper } from '../../../ha-core/ha-model/ha-config/ha-constellab.helper';
import { HaAgentDatasourcePaginated } from '../../../ha-core/ha-model/ha-entities/ha-agent.class';
import { HaBrickDatasourcePaginated } from '../../../ha-core/ha-model/ha-entities/ha-brick.class';
import { HaCommunityAppDatasourcePaginated } from '../../../ha-core/ha-model/ha-entities/ha-community-app.class';
import { HaPartner } from '../../../ha-core/ha-model/ha-entities/ha-partner';
import { HaRunStatAggregate } from '../../../ha-core/ha-model/ha-entities/ha-run-stat-aggregate.class';
import { HaSpace } from '../../../ha-core/ha-model/ha-entities/ha-space.class';
import { HaStoryListDatasourcePaginated } from '../../../ha-core/ha-model/ha-entities/ha-story.class';
import { HaCommunityPageDirective } from '../../../ha-core/ha-module/ha-core-directive/ha-community-page/ha-community-page.directive';
import { HaAppPicturePipe } from '../../../ha-core/ha-module/ha-core-pipe/ha-app-picture/ha-app-picture.pipe';
import { HaBrickImagePipe } from '../../../ha-core/ha-module/ha-core-pipe/ha-brick-image/ha-brick-image.pipe';
import { HaDetailRoutePipe } from '../../../ha-core/ha-module/ha-core-pipe/ha-detail-route/ha-detail-route.pipe';
import { HaPartnerService } from '../../../ha-core/ha-service/ha-partner.service';
import { HaRouterService } from '../../../ha-core/ha-service/ha-router.service';
import { HaStoryService } from '../../../ha-core/ha-service/ha-story.service';
import { HaJsonLdState } from '../../../ha-core/ha-state/ha-json-ld.state';
import {
  HaEditPartnerDialogInput,
  HaPartnerEditDialogComponent,
} from '../../../ha-partner/module/ha-partner-create-dialog/ha-partner-edit-dialog.component';
import { HaProfileState } from '../../state/ha-profile.state';
import {
  HaProfileEditDialogComponent,
  HaProfileEditDialogData,
} from '../ha-profile-edit-dialog/ha-profile-edit-dialog.component';

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
    MatButton,
    MatIcon,
    TeTextEditorModule,
    ReactiveFormsModule,
    FlLoaderModule,
  ],
  providers: [HaProfileState],
})
export class HaProfileComponent extends HaCommunityPageDirective implements OnInit, OnDestroy {
  private storyService: HaStoryService = inject(HaStoryService);
  private dialogService: FlDialogService = inject(FlDialogService);
  private userConfig: FlUserConfig = inject(FlUserConfig);
  private route: ActivatedRoute = inject(ActivatedRoute);
  private router: Router = inject(Router);
  private jsonLdState: HaJsonLdState = inject(HaJsonLdState);
  private partnerService: HaPartnerService = inject(HaPartnerService);

  private profileState: HaProfileState = inject(HaProfileState);

  foaLink: string = HaConstellabHelper.getGencoveryFOAUrl();

  subscriptionHandler: ClSubscriptionHandler = new ClSubscriptionHandler();

  agents$: HaAgentDatasourcePaginated<HaProfileDatasourceFilters>;
  stories$: HaStoryListDatasourcePaginated<HaProfileDatasourceFilters>;
  bricks$: HaBrickDatasourcePaginated<HaProfileDatasourceFilters>;
  apps$: HaCommunityAppDatasourcePaginated<HaProfileDatasourceFilters>;

  currentType = 'stories' as HaProfileSectionType;
  sectionsTypes: HaProfileSectionType[] = ['stories', 'apps', 'agents', 'bricks'];

  user: Signal<CoUser> = computed(() => {
    const user = this.profileState.user();
    if (user) {
      this.onUser(user);
    }
    return user;
  });

  isCurrentUser: Signal<boolean> = this.profileState.isCurrentUser.asReadonly();

  commonSpaces: Signal<HaSpace[]> = this.profileState.commonSpaces.asReadonly();

  userRunStatAggregate: Signal<HaRunStatAggregate> = this.profileState.userRunStatAggregate.asReadonly();

  partner = this.profileState.partner.asReadonly();

  partnerPageUrl = computed(() => {
    const partner = this.partner();
    if (partner) {
      return HaRouterService.getPartnerPage(partner.id, ClStringHelper.getCleanUrlPath(partner.name));
    }
    return null;
  });

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

  changeCurrentType(type: HaProfileSectionType): void {
    this.currentType = type;
  }

  openBecomePartnerDialog(): void {
    const dialogInput: HaEditPartnerDialogInput = {
      mode: 'create',
    };

    this.dialogService
      .openMediumDialog(HaPartnerEditDialogComponent, { data: dialogInput })
      .afterClosed()
      .subscribe((result: HaPartner) => {
        if (result) {
          this.router.navigateByUrl(
            HaRouterService.getPartnerPage(result.id, ClStringHelper.getCleanUrlPath(result.name))
          );
        }
      });
  }

  private init(): void {
    const routeParamsSubscription = this.route.params.subscribe((params) => {
      const userId = params['id'];
      this.profileState.init(userId);
      this.apps$ = this.profileState.apps$;
      this.agents$ = this.profileState.agents$;
      this.bricks$ = this.profileState.bricks$;
      this.stories$ = this.profileState.stories$;
    });

    this.subscriptionHandler.add(routeParamsSubscription);
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
    this.profileState.onDestroy();
  }
}
