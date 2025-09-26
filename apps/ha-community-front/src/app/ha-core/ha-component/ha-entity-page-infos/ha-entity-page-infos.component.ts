import { ViewportScroller } from '@angular/common';
import { Component, computed, inject, input, OnInit } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { CoStatsListComponent, CoVisibilityBadgeComponent } from '@monorepo/community-lib';
import { FlDateModule } from '@monorepo/front-core-lib/fl-date';
import { FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import { FlIconModule } from '@monorepo/front-core-lib/fl-svg-icon';
import { FlUserModule } from '@monorepo/front-core-lib/fl-user';
import { TranslatePipe } from '@ngx-translate/core';
import { DateTime } from 'luxon';

import {
  HaCoAuthorDialogComponent,
  HaCoAuthorsDialogInput,
} from '../../entity-module/ha-co-author-core/component/ha-co-author-dialog/ha-co-author-dialog.component';
import { HaShareButtonElement } from '../../entity-module/ha-share-core/model/ha-share.class';
import { HaEntityType } from '../../ha-model/ha-entities/ha-entity-type';
import { HaSpace } from '../../ha-model/ha-entities/ha-space.class';
import { HaUser } from '../../ha-model/ha-entities/ha-user';
import { HaAuthenticatedUserService } from '../../ha-service/ha-authenticated-user.service';
import { HaMetadataService } from '../../ha-service/ha-metadata.service';
import { HaRouterService } from '../../ha-service/ha-router.service';
import { HaCurrentPageState } from '../../ha-state/ha-current-page.state';
import { HaEntityCommentState } from '../../ha-state/ha-entity-comment.state';
import { HaEntityLikeState } from '../../ha-state/ha-entity-like.state';

@Component({
  selector: 'ha-entity-page-infos',
  templateUrl: './ha-entity-page-infos.component.html',
  styleUrl: './ha-entity-page-infos.component.scss',
  imports: [
    FlUserModule,
    FlDateModule,
    CoVisibilityBadgeComponent,
    TranslatePipe,
    CoStatsListComponent,
    MatIconButton,
    MatTooltip,
    MatIcon,
    FlIconModule,
  ],
  providers: [HaEntityLikeState],
})
export class HaEntityPageInfosComponent implements OnInit {
  private entityCommentState = inject(HaEntityCommentState);
  private entityLikeState = inject(HaEntityLikeState);
  private scroller = inject(ViewportScroller);
  private metaService = inject(HaMetadataService);
  private dialogService = inject(FlDialogService);
  private currentPageState = inject(HaCurrentPageState);
  private authenticatedUserService = inject(HaAuthenticatedUserService);
  private router = inject(Router);

  entityId = input.required<string>();
  entityType = input.required<HaEntityType>();
  contributors = input.required<HaUser[]>();
  date = input.required<DateTime>();
  space = input<HaSpace>(undefined);
  executions = input<number>(undefined);
  isAuthor = input<boolean>(false);

  isLiked = this.entityLikeState.getIsLiked();
  likesCount = this.entityLikeState.getLikesCount();
  commentsCount = computed(() => {
    const entityType = this.entityType();
    if (entityType === HaEntityType.BRICK || entityType === HaEntityType.TAG) return undefined;
    return this.entityCommentState.getCommentsCount()();
  });
  user = toSignal(this.authenticatedUserService.getUser());

  shareButtons: HaShareButtonElement[];
  loginRoute = HaRouterService.getLoginRoute();

  ngOnInit(): void {
    this.entityLikeState.init(this.entityId(), this.entityType());

    this.shareButtons = [
      {
        icon: 'facebook',
        label: 'Facebook',
        onClick: () => this.shareOnFacebook(this.metaService),
      },
      {
        icon: 'x',
        label: 'X',
        onClick: () => this.shareOnX(this.metaService),
      },
      {
        icon: 'linkedin',
        label: 'LinkedIn',
        onClick: () => this.shareOnLinkedIn(this.metaService),
      },
    ];
  }

  onLikeClicked(): void {
    if (!this.user()) {
      this.router.navigateByUrl(this.loginRoute);
      return;
    }
    this.entityLikeState.toggleLike();
  }

  onCommentClicked(): void {
    this.scroller.scrollToAnchor('comments');
  }

  openCoAuthorDialog(): void {
    let inviteText: string = '';
    switch (this.entityType()) {
      case HaEntityType.STORY:
        inviteText = 'invite_story_coauthor_information';
        break;
      case HaEntityType.BRICK:
        inviteText = 'invite_brick_coauthor_information';
        break;
      case HaEntityType.APP:
        inviteText = 'invite_app_coauthor_information';
        break;
      case HaEntityType.AGENT:
        inviteText = 'invite_agent_coauthor_information';
        break;
      default:
        throw new Error('Unsupported entity type for co-author dialog');
    }

    const input: HaCoAuthorsDialogInput = {
      id: this.entityId(),
      service: this.currentPageState.entityService(),
      inviteText: inviteText,
      authorId: this.contributors()[0].id,
    };

    this.dialogService.openSmallDialog(HaCoAuthorDialogComponent, { data: input }).afterClosed().subscribe();
  }

  shareOnFacebook(metadataService: HaMetadataService): void {
    const facebookUrl = metadataService.getFacebookShareUrl();
    window.open(facebookUrl, '_blank');
  }

  shareOnX(metadataService: HaMetadataService): void {
    const twitterUrl = metadataService.getTwitterShareUrl();
    window.open(twitterUrl, '_blank');
  }

  shareOnLinkedIn(metadataService: HaMetadataService): void {
    const linkedInUrl = metadataService.getLinkedInShareUrl();
    window.open(linkedInUrl, '_blank');
  }
}
