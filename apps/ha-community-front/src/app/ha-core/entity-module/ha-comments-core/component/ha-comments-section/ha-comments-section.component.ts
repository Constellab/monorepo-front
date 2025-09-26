import { AsyncPipe } from '@angular/common';
import { Component, ElementRef, inject, input, OnInit, ViewChildren } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAnchor, MatButton } from '@angular/material/button';
import { CoUser } from '@monorepo/community-lib';
import { FlCardModule } from '@monorepo/front-core-lib/fl-card';
import { FlDatasourcePaginated } from '@monorepo/front-core-lib/fl-core';
import { FlCorePipeModule } from '@monorepo/front-core-lib/fl-core-pipe';
import { FlInfiniteScrollModule } from '@monorepo/front-core-lib/fl-infinite-scroll';
import { FlLoaderModule } from '@monorepo/front-core-lib/fl-loader';
import { FlUserModule } from '@monorepo/front-core-lib/fl-user';
import { TeCompleteConfig, TeRichText, TeTextEditorModule } from '@monorepo/text-editor';
import { TranslatePipe } from '@ngx-translate/core';

import { HaRouterService } from '../../../../ha-service/ha-router.service';
import { HaEntityCommentState } from '../../../../ha-state/ha-entity-comment.state';
import { HaAbstractComment, HaCommentEntity } from '../../model/ha-abstract-comment.class';
import { HaCommentComponent } from '../ha-comment/ha-comment.component';

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
    MatAnchor,
    ReactiveFormsModule,
  ],
  templateUrl: './ha-comments-section.component.html',
  styleUrl: './ha-comments-section.component.scss',
})
export class HaCommentsSectionComponent implements OnInit {
  user = input<CoUser>();

  isWritingComment = false;

  textEditorConfig: TeCompleteConfig = new TeCompleteConfig({ hideToolbar: true, dense: true });
  datasource: FlDatasourcePaginated<HaAbstractComment<HaCommentEntity>>;
  isLoading = false;
  formControlCommentInputData: FormControl<TeRichText> = new FormControl();
  loginRoute: string = HaRouterService.getLoginRoute();
  private entityCommentState: HaEntityCommentState = inject(HaEntityCommentState);
  commentsCount = this.entityCommentState.getCommentsCount();

  @ViewChildren('commentEditor') commentEditor: ElementRef;

  ngOnInit(): void {
    this.formControlCommentInputData.patchValue(new TeRichText());
    this.datasource = this.entityCommentState.getComments();
  }

  showCommentTextEditor(): void {
    this.isWritingComment = true;
    this.commentEditor?.nativeElement?.focus();
  }

  hideCommentTextEditor(): void {
    this.isWritingComment = false;
  }

  sendComment(): void {
    if (this.formControlCommentInputData.value && !this.formControlCommentInputData.value.isEmpty()) {
      this.isLoading = true;
      this.entityCommentState
        .sendComment(this.formControlCommentInputData.value)
        .subscribe((comment: HaAbstractComment<HaCommentEntity>) => {
          this.formControlCommentInputData.patchValue(new TeRichText());
          this.datasource.unshiftItem(comment);
          this.isLoading = false;
          this.isWritingComment = false;
        });
    }
  }

  loadMoreResults(): void {
    this.datasource.getNextPage();
  }
}
