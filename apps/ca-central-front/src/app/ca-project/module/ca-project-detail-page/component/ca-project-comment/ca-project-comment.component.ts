import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CaProjectComment} from '../../../../../ca-core/model/entities/ca-comment.class';
import {CaProjectService} from '../../../../../ca-core/service-api/ca-project.service';
import {FlConfirmDialogInput, FlConfirmDialogResult, FlDialogService} from '@monorepo/front-core-lib';
import {CaAuthenticatedUserService} from '../../../../../ca-core/service-api/ca-authenticated-user.service';
import {CaProjectDetailState} from '../../state/ca-project-detail.state';
import {TeRichTextContent} from '@monorepo/text-editor';
import {CaProjectCommentTextEditorConfig} from '../../../../../ca-core/model/config/ca-comment-text-editor.config';

@Component({
  selector: 'ca-project-comment',
  templateUrl: './ca-project-comment.component.html',
  styleUrls: ['./ca-project-comment.component.scss']
})
export class CaProjectCommentComponent implements OnInit {

  @Input() comment: CaProjectComment;

  @Output() commentUpdated = new EventEmitter<CaProjectComment>();
  @Output() commentDeleted = new EventEmitter<CaProjectComment>();

  editMode: boolean = false;
  textEditorConfig: CaProjectCommentTextEditorConfig = new CaProjectCommentTextEditorConfig(
    this.state.getProjectId$(), this.projectService);

  showButtons: boolean = false;

  constructor(private projectService: CaProjectService,
              private authUserService: CaAuthenticatedUserService,
              private state: CaProjectDetailState,
              private dialogService: FlDialogService) {
  }

  ngOnInit(): void {
    // only the author of the message can modify the comment within 5 minutes
    this.showButtons = this.authUserService.getCurrentUser().id === this.comment.createdBy.id &&
      this.comment.createdAt.diffNow('minute').as('minute') > -5;
  }


  enableEditMode(): void {
    this.editMode = true;
  }

  disableEditMode(): void {
    this.editMode = false;
  }

  updateComment(commentContent: TeRichTextContent): void {
    this.projectService.updateComment(this.comment.project.id, this.comment.id,
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
      observable: this.projectService.deleteComment(this.state.getCurrentProject().id,
        this.comment.id),
      successMessage: 'delete_comment_success',
      translateMessage: true
    };
    this.dialogService.openConfirmDialog(input).afterClosed().subscribe(
      (res) => this.deleteCommentClosed(res)
    );
  }

  private deleteCommentClosed(result: FlConfirmDialogResult): void {
    if (result.choice) {
      this.commentDeleted.emit(this.comment);
    }
  }
}
