import {Component, OnDestroy, OnInit} from '@angular/core';
import {CaProjectDetailState} from '../../state/ca-project-detail.state';
import {
  CaProjectComment,
  CaProjectCommentDatasourcePaginated
} from '../../../../../ca-core/model/entities/ca-comment.class';
import {CaProjectService} from '../../../../../ca-core/service-api/ca-project.service';
import {CaAuthenticatedUserService} from '../../../../../ca-core/service-api/ca-authenticated-user.service';
import {TeRichTextContent} from '@monorepo/text-editor';


@Component({
  selector: 'ca-project-comments',
  templateUrl: './ca-project-comments.component.html',
  styleUrls: ['./ca-project-comments.component.scss']
})
export class CaProjectCommentsComponent implements OnInit, OnDestroy {

  comments: CaProjectCommentDatasourcePaginated;
  currentUserId: string;

  projectId: string;

  constructor(private state: CaProjectDetailState,
              private projectService: CaProjectService,
              private userService: CaAuthenticatedUserService) {
  }

  ngOnInit(): void {
    this.state.getProject$().subscribe(project => {
      this.projectId = project.id;
      this.comments = this.projectService.getComments(this.projectId);
    });

    this.currentUserId = this.userService.getCurrentUser().id;
  }


  createNewComment(comment: TeRichTextContent): void {
    this.projectService.createComment(this.projectId, comment).subscribe(
      comment => this.createSuccess(comment)
    );
  }

  private createSuccess(comment: CaProjectComment): void {
    this.comments.addItem(comment, () => true);
  }


  commentUpdated(comment: CaProjectComment): void {
    this.comments.updateItem(comment);
  }

  commentDeleted(comment: CaProjectComment): void {
    this.comments.removeItem(comment);
  }

  ngOnDestroy(): void {
    this.comments?.disconnect();
  }


}
