import { Component, inject, input, OnInit } from '@angular/core';
import { HaCommentTextEditorConfig } from '../../model/ha-comment-text-editor.config';
import { CoUser } from '@monorepo/community-lib';

import { FlDatasourcePaginated } from '@monorepo/front-core-lib/fl-core';
import { HaAbstractComment, HaCommentEntity } from '../../model/ha-abstract-comment.class';
import { TeRichText, TeTextEditorModule } from '@monorepo/text-editor';
import { HaRouterService } from '../../../../ha-service/ha-router.service';
import { HaCommentService } from '../../../../ha-service/ha-comment.service';
import { FlInfiniteScrollModule } from '@monorepo/front-core-lib/fl-infinite-scroll';
import { FlCardModule } from '@monorepo/front-core-lib/fl-card';
import { FlUserModule } from '@monorepo/front-core-lib/fl-user';
import { MatAnchor, MatButton } from '@angular/material/button';
import { FlLoaderModule } from '@monorepo/front-core-lib/fl-loader';
import { HaCommentComponent } from '../ha-comment/ha-comment.component';
import { FlCorePipeModule } from '@monorepo/front-core-lib/fl-core-pipe';
import { AsyncPipe } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HaEntityType } from '../../../../ha-model/ha-entities/ha-entity-type';

export interface HaCommentsEntity {
  id: string;
  comments: number;
}

@Component({
  selector: 'ha-comments-section',
  imports: [
    FlInfiniteScrollModule,
    FlCardModule,
    FlUserModule,
    TeTextEditorModule,
    MatButton,
    FlLoaderModule,
    HaCommentComponent,
    FlCorePipeModule,
    AsyncPipe,
    TranslatePipe,
    FormsModule,
    RouterLink,
    MatAnchor,
  ],
  templateUrl: './ha-comments-section.component.html',
  styleUrl: './ha-comments-section.component.scss',
})
export class HaCommentsSectionComponent implements OnInit {
  user = input<CoUser>();
  entity = input.required<HaCommentsEntity>();
  commentType = input.required<HaEntityType>();

  private commentService = inject(HaCommentService);

  textEditorConfig: HaCommentTextEditorConfig = new HaCommentTextEditorConfig();
  datasource: FlDatasourcePaginated<HaAbstractComment<HaCommentEntity>>;
  isLoading = false;
  commentInputData = new TeRichText();
  loginRoute: string = HaRouterService.getLoginRoute();
  commentsNumber: number;

  ngOnInit(): void {
    this.datasource = this.commentService.getComments(this.commentType(), this.entity().id);
    this.commentsNumber = this.entity().comments;
  }

  sendComment(): void {
    if (this.commentInputData && !this.commentInputData.isEmpty()) {
      this.isLoading = true;
      this.commentService
        .sendComment(this.commentType(), this.commentInputData, this.entity().id)
        .subscribe((comment: HaAbstractComment<HaCommentEntity>) => {
          this.commentInputData = new TeRichText();
          this.datasource.unshiftItem(comment);
          this.commentsNumber++;
          this.isLoading = false;
        });
    }
  }

  loadMoreResults(): void {
    this.datasource.getNextPage();
  }
}
