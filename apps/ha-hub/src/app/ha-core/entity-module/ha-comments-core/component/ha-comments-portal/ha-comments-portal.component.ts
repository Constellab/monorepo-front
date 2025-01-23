import { Component, inject, OnInit } from '@angular/core';
import { FL_PORTAL_DATA, FlOverlayRef } from '@monorepo/front-core-lib/fl-portal';
import { FlDatasourcePaginated } from '@monorepo/front-core-lib/fl-core';
import { TeRichText } from '@monorepo/text-editor';
import { HaAbstractComment, HaCommentEntity, HaCommentType } from '../../model/ha-abstract-comment.class';
import { HaCommentService } from '../../../../ha-service/ha-comment.service';
import { HaRouterService } from '../../../../ha-service/ha-router.service';
import { HaCommentTextEditorConfig } from '../../model/ha-comment-text-editor.config';
import { CoUser } from '@monorepo/community-lib';
import { FlInfiniteScrollModule } from '@monorepo/front-core-lib/fl-infinite-scroll';
import { MatAnchor, MatButton, MatIconButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { MatIcon } from '@angular/material/icon';
import { FlCardModule } from '@monorepo/front-core-lib/fl-card';
import { FlUserModule } from '@monorepo/front-core-lib/fl-user';
import { TeTextEditorModule } from '@monorepo/text-editor';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlLoaderModule } from '@monorepo/front-core-lib/fl-loader';
import { RouterLink } from '@angular/router';
import { HaCommentComponent } from '../ha-comment/ha-comment.component';
import { AsyncPipe } from '@angular/common';
import { FlCorePipeModule } from '@monorepo/front-core-lib/fl-core-pipe';
import { TranslatePipe } from '@ngx-translate/core';

export interface HaCommentsPortalData {
  entity: HaCommentsEntity;
  commentType: HaCommentType;
  user: CoUser;
}

export interface HaCommentsEntity {
  id: string;
  comments: number;
}

@Component({
  selector: 'ha-comments-portal',
  templateUrl: './ha-comments-portal.component.html',
  styleUrls: ['./ha-comments-portal.component.scss'],
  imports: [
    FlInfiniteScrollModule,
    MatIconButton,
    MatTooltip,
    MatIcon,
    FlCardModule,
    FlUserModule,
    TeTextEditorModule,
    ReactiveFormsModule,
    FormsModule,
    MatButton,
    FlLoaderModule,
    MatAnchor,
    RouterLink,
    HaCommentComponent,
    AsyncPipe,
    FlCorePipeModule,
    TranslatePipe,
  ],
})
export class HaCommentsPortalComponent implements OnInit {
  private overlayRef = inject(FlOverlayRef);
  private commentService = inject(HaCommentService);

  textEditorConfig: HaCommentTextEditorConfig = new HaCommentTextEditorConfig();
  commentIsValid = false;
  user: CoUser;
  entity: HaCommentsEntity;
  datasource: FlDatasourcePaginated<HaAbstractComment<HaCommentEntity>>;
  isLoading = false;
  commentType: HaCommentType;
  commentInputData = new TeRichText();
  loginRoute: string = HaRouterService.getLoginRoute();

  constructor() {
    const data = inject<HaCommentsPortalData>(FL_PORTAL_DATA);

    this.user = data.user;
    this.entity = data.entity;
    this.commentType = data.commentType;
  }

  ngOnInit(): void {
    this.datasource = this.commentService.getComments(this.commentType, this.entity.id);
  }

  closePortal(): void {
    this.overlayRef.dispose(this.entity.comments);
  }

  checkCommentValidity(): void {
    this.commentIsValid = !this.commentInputData.isEmpty();
  }

  sendComment(): void {
    if (this.commentIsValid) {
      this.isLoading = true;

      this.commentService
        .sendComment(this.commentType, this.commentInputData, this.entity.id)
        .subscribe((comment: HaAbstractComment<HaCommentEntity>) => {
          this.commentInputData = new TeRichText();
          this.datasource.unshiftItem(comment);
          this.entity.comments++;
          this.isLoading = false;
        });
    }
  }

  loadMoreResults(): void {
    this.datasource.getNextPage();
  }
}
