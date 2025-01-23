import { Component, OnInit, inject } from '@angular/core';
import { FL_PORTAL_DATA, FlDatasourcePaginated, FlOverlayRef } from '@monorepo/front-core-lib';
import { TeRichText } from '@monorepo/text-editor';
import { HaAbstractComment, HaCommentEntity, HaCommentType } from '../../model/ha-abstract-comment.class';
import { HaCommentService } from '../../../../ha-service/ha-comment.service';
import { HaRouterService } from '../../../../ha-service/ha-router.service';
import { HaCommentTextEditorConfig } from '../../model/ha-comment-text-editor.config';
import { CoUser } from '@monorepo/community-lib';
import { FlInfiniteScrollModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-inifite-scroll/fl-infinite-scroll.module';
import { MatIconButton, MatButton, MatAnchor } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { MatIcon } from '@angular/material/icon';
import { FlCardModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-card/fl-card.module';
import { FlUserModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-user/fl-user.module';
import { TeTextEditorModule } from '../../../../../../../../../libs/text-editor/src/lib/te-text-editor.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FlLoaderModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-loader/fl-loader.module';
import { RouterLink } from '@angular/router';
import { HaCommentComponent } from '../ha-comment/ha-comment.component';
import { AsyncPipe } from '@angular/common';
import { FlCorePipeModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-core-pipe/fl-core-pipe.module';
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
