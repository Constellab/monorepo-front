import { Component, computed, input, OnDestroy, Signal } from '@angular/core';
import { CaProjectComment, CaProjectCommentDatasourcePaginated } from '../../../../model/entities/ca-comment.class';
import { CaProjectService } from '../../../../service-api/ca-project.service';
import { TeRichTextContent } from '@monorepo/text-editor';

/**
 * Component to load message of a chat of a folder and show them.
 * The user can add a new message to the chat
 */
@Component({
  selector: 'ca-chat-folder',
  templateUrl: './ca-chat-folder.component.html',
  styleUrl: './ca-chat-folder.component.scss'
})
export class CaChatFolderComponent implements OnDestroy {

  folderId = input.required<string>();


  comments: Signal<CaProjectCommentDatasourcePaginated> = computed(() => this.projectService.getComments(this.folderId()));

  constructor(private projectService: CaProjectService) {
  }

  createNewComment(comment: TeRichTextContent): void {
    this.projectService.createComment(this.folderId(), comment).subscribe(
      comment => this.createSuccess(comment)
    );
  }

  private createSuccess(comment: CaProjectComment): void {
    this.comments().addItem(comment, () => true);
  }


  commentUpdated(comment: CaProjectComment): void {
    this.comments().updateItem(comment);
  }

  commentDeleted(comment: CaProjectComment): void {
    this.comments().removeItem(comment);
  }

  ngOnDestroy(): void {
    this.comments()?.disconnect();
  }
}
