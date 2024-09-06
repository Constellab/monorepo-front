import { Component, computed, EventEmitter, input, OnDestroy, OnInit, Output } from '@angular/core';
import { CaProjectComment } from '../../../../model/entities/ca-comment.class';
import { CaProjectCommentTextEditorConfig } from '../../../../model/config/ca-comment-text-editor.config';
import { CaProjectService } from '../../../../service-api/ca-project.service';
import { CaAuthenticatedUserService } from '../../../../service-api/ca-authenticated-user.service';
import { FlConfirmDialogInput, FlConfirmDialogResult, FlDialogService } from '@monorepo/front-core-lib';
import { TeRichTextContent } from '@monorepo/text-editor';

/**
 * Component to show a message in a chat
 */
@Component({
  selector: 'ca-chat-message',
  templateUrl: './ca-chat-message.component.html',
  styleUrl: './ca-chat-message.component.scss'
})
export class CaChatMessageComponent implements OnInit, OnDestroy {

  comment = input.required<CaProjectComment>();
  folderId = input.required<string>();

  @Output() commentUpdated = new EventEmitter<CaProjectComment>();
  @Output() commentDeleted = new EventEmitter<CaProjectComment>();

  showButtons = computed(() => this.authUserService.getCurrentUser().id === this.comment().createdBy.id &&
    this.comment().createdAt.diffNow('minute').as('minute') > -5);

  editMode: boolean = false;

  textEditorConfig: CaProjectCommentTextEditorConfig;

  constructor(private projectService: CaProjectService,
              private authUserService: CaAuthenticatedUserService,
              private dialogService: FlDialogService) {
  }

  ngOnInit(): void {
    this.textEditorConfig = new CaProjectCommentTextEditorConfig(this.folderId(), this.projectService);
  }

  enableEditMode(): void {
    this.editMode = true;
  }

  disableEditMode(): void {
    this.editMode = false;
  }

  updateComment(commentContent: TeRichTextContent): void {
    this.projectService.updateComment(this.folderId(), this.comment().id,
      commentContent).subscribe((comment: CaProjectComment) =>
      this.updateCommentSuccess(comment)
    );
  }

  private updateCommentSuccess(comment: CaProjectComment): void {
    this.disableEditMode();
    this.commentUpdated.emit(comment);
  }

  deleteComment(): void {
    const input: FlConfirmDialogInput = {
      title: 'delete_comment',
      content: 'delete_comment_confirmation',
      translateTitleAndContent: true,
      observable: this.projectService.deleteComment(this.folderId(),
        this.comment().id),
      successMessage: 'delete_comment_success',
      translateMessage: true
    };
    this.dialogService.openConfirmDialog(input).afterClosed().subscribe(
      (res) => this.deleteCommentClosed(res)
    );
  }

  private deleteCommentClosed(result: FlConfirmDialogResult): void {
    if (result.choice) {
      this.commentDeleted.emit(this.comment());
    }
  }

  ngOnDestroy(): void {
    this.textEditorConfig?.event.destroy();
  }
}
