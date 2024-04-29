import {Component, OnDestroy, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {CaProject} from '../../../../../ca-core/model/entities/project/ca-project.class';
import {CaProjectDetailState} from '../../state/ca-project-detail.state';
import {
  CaProjectComment,
  CaProjectCommentDatasourcePaginated
} from '../../../../../ca-core/model/entities/ca-comment.class';
import {CaProjectService} from '../../../../../ca-core/service-api/ca-project.service';
import {CaAuthenticatedUserService} from '../../../../../ca-core/service-api/ca-authenticated-user.service';
import {CaCommentTextEditorConfig} from '../../../../../ca-core/model/config/ca-comment-text-editor.config';
import {FormControl, Validators} from '@angular/forms';
import {
  FlConfirmDialogInput,
  FlDialogService,
  FlEmojiPickerPortalComponent,
  FlOverlayRef,
  FlPortalService
} from '@monorepo/front-core-lib';
import {ClRichText} from '@monorepo/core-lib';


@Component({
  selector: 'ca-project-comments',
  templateUrl: './ca-project-comments.component.html',
  styleUrls: ['./ca-project-comments.component.scss']
})
export class CaProjectCommentsComponent implements OnInit, OnDestroy {

  project$: Observable<CaProject>;
  comments: CaProjectCommentDatasourcePaginated;
  currentUserId: string;
  textEditorConfig: CaCommentTextEditorConfig = new CaCommentTextEditorConfig(this.projectService,
    this.state.getProjectId$());
  // textEditorConfig2: CaCommentTextEditor2Config;

  formControl: FormControl = new FormControl({value: null}, [Validators.required, Validators.min(1)]);
  projectId: string;

  constructor(private state: CaProjectDetailState,
              private projectService: CaProjectService,
              private userService: CaAuthenticatedUserService,
              private portalService: FlPortalService,
              private dialogService: FlDialogService) {
  }

  ngOnInit(): void {
    this.project$ = this.state.getProject$();

    // this.textEditorConfig2 = new CaCommentTextEditor2Config(
    //   this.state.getProjectId$().pipe(
    //     mergeMap(projectId => this.projectService.getUsersOfProject(projectId)),
    //     share()
    //   )
    // );

    this.project$.subscribe(project => {
      this.projectId = project.id;
      this.comments = this.projectService.getProjectComments(this.projectId);
      this.readProjectCommentsNotification();

      this.projectService.getUsersOfProject(this.projectId).subscribe(users => {
        this.textEditorConfig.setUsers(users);
      });
    });

    this.currentUserId = this.userService.getCurrentUser().id;

    this.textEditorConfig.sendButtonEvent$.subscribe(btEvent => {
      if (btEvent) {
        this.createNewComment();
      }
    });

    this.textEditorConfig.sendEmojiButtonEvent$.subscribe(btEmoji => {
      if (btEmoji) {
        this.openEmojiPanel(btEmoji);
      }
    });
  }

  private readProjectCommentsNotification(): void {
    // this.notificationState.readEntityNotificationsByLink(this.router.url.slice(1), 'PROJECT_COMMENT').subscribe();
  }

  enterEvent(event: Event): void {
    event.preventDefault();
    this.createNewComment();
  }


  private createNewComment(): void {
    if (!ClRichText.isEmpty(this.formControl.value)) {
      this.projectService.newProjectComment(this.projectId, this.formControl.value).subscribe((newComment) => {
        if (newComment) {
          this.comments.addItem(newComment, () => true);
        }
      });
      this.formControl.setValue(null);
    }
  }

  addEmoji(event: string): void {
    this.formControl.setValue(ClRichText.addEmoji(this.formControl.value, event));
  }

  eventOnMessage(event: [FlOverlayRef, string], comment: CaProjectComment): void {
    switch (event[1]) {
      case 'delete':
        const input: FlConfirmDialogInput = {
          title: 'delete_comment_title',
          content: 'delete_comment_confirmation',
          translateTitleAndContent: true,
          successMessage: 'delete_comment_success',
          translateMessage: true
        };
        this.dialogService.openConfirmDialog(input).afterClosed().subscribe((res) => {
          if (res.choice)
            this.deleteComment(this.projectId, comment);
        });
        event[0].dispose();
        break;
      case 'edit':
        event[0].dispose();
        break;
      default:
        break;
    }
  }

  private deleteComment(projectId: string, comment: CaProjectComment): void {
    this.projectService.deleteProjectComment(projectId, comment.id).subscribe(() => {
      this.comments.removeItem(comment);
    });
  }

  private openEmojiPanel(btEmoji: HTMLElement): void {
    const config = this.portalService.configureRelativePortal(btEmoji, ['top', 'bottom', 'left', 'right'],
      {
        hasBackdrop: true,
        disposeOnNavigation: true,
        disposeOnBackdropClick: true,
        transparentBackdrop: true
      });
    this.portalService.createPortal(FlEmojiPickerPortalComponent, config).detachments().subscribe(
      emoji => {
        if (emoji)
          this.addEmoji(emoji);
      }
    );
  }

  ngOnDestroy(): void {
    this.textEditorConfig.destroy();
  }

}
