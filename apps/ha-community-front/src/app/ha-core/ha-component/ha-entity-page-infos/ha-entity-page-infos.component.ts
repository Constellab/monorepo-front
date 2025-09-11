import { ViewportScroller } from '@angular/common';
import { Component, inject, input, OnInit } from '@angular/core';
import { CoStatsListComponent, CoVisibilityBadgeComponent } from '@monorepo/community-lib';
import { FlDateModule } from '@monorepo/front-core-lib/fl-date';
import { FlUserModule } from '@monorepo/front-core-lib/fl-user';
import { TranslatePipe } from '@ngx-translate/core';
import { DateTime } from 'luxon';

import { HaEntityType } from '../../ha-model/ha-entities/ha-entity-type';
import { HaSpace } from '../../ha-model/ha-entities/ha-space.class';
import { HaUser } from '../../ha-model/ha-entities/ha-user';
import { HaEntityCommentState } from '../../ha-state/ha-entity-comment.state';
import { HaEntityLikeState } from '../../ha-state/ha-entity-like.state';

@Component({
  selector: 'ha-entity-page-infos',
  templateUrl: './ha-entity-page-infos.component.html',
  styleUrl: './ha-entity-page-infos.component.scss',
  imports: [FlUserModule, FlDateModule, CoVisibilityBadgeComponent, TranslatePipe, CoStatsListComponent],
  providers: [HaEntityLikeState],
})
export class HaEntityPageInfosComponent implements OnInit {
  private entityLikeState = inject(HaEntityLikeState);
  private entityCommentState = inject(HaEntityCommentState);
  private scroller: ViewportScroller = inject(ViewportScroller);

  entityId = input.required<string>();
  entityType = input.required<HaEntityType>();
  contributors = input.required<HaUser[]>();
  date = input.required<DateTime>();
  space = input<HaSpace>(undefined);
  executions = input<number>(undefined);
  isAuthor = input<boolean>(false);

  isLiked = this.entityLikeState.getIsLiked();
  likesCount = this.entityLikeState.getLikesCount();
  commentsCount = this.entityCommentState.getCommentsCount();

  ngOnInit(): void {
    this.entityLikeState.init(this.entityId(), this.entityType());
  }

  onLikeClicked(): void {
    this.entityLikeState.toggleLike();
  }

  onCommentClicked(): void {
    this.scroller.scrollToAnchor('comments');
  }
}
