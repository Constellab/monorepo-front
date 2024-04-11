import {Component, OnInit} from '@angular/core';
import {HaLiveTaskService} from '../../../ha-core/ha-service/ha-live-task.service';
import {ActivatedRoute, Router} from '@angular/router';
import {HaLiveTask} from '../../../ha-core/ha-model/ha-entities/ha-live-task.class';
import {HaBrickVersion} from '../../../ha-core/ha-model/ha-entities/ha-brick-version.class';
import {Observable} from 'rxjs';
import {HaAuthService} from '../../../ha-core/ha-service/ha-auth.service';
import {FlConfirmDialogInput, FlConfirmDialogResult, FlDialogService, FlPortalService} from '@monorepo/front-core-lib';
import {HaUser} from '../../../ha-core/ha-model/ha-entities/ha-user';
import {HaAuthenticatedUserService} from '../../../ha-core/ha-service/ha-authenticated-user.service';
import {HaLikeService} from '../../../ha-core/ha-service/ha-like.service';
import {HaLikeType} from '../../../ha-core/ha-model/ha-entities/ha-entity-type.enum';
import {
  HaCommentsPortalConfig
} from '../../../ha-core/entity-module/ha-comments-core/model/ha-comments-portal-config.class';
import {HaCommentType} from '../../../ha-core/entity-module/ha-comments-core/model/ha-abstract-comment.class';
import {
  HaCommentsPortalComponent,
  HaCommentsPortalData
} from '../../../ha-core/entity-module/ha-comments-core/component/ha-comments-portal/ha-comments-portal.component';
import {
  HaCoAuthorDialogComponent,
  HaCreateStoryDtoInput
} from '../../../ha-core/entity-module/ha-co-author-core/component/ha-co-author-dialog/ha-co-author-dialog.component';


@Component({
  selector: 'ha-live-task-page',
  templateUrl: './ha-live-task-page.component.html',
  styleUrls: ['./ha-live-task-page.component.scss']
})
export class HaLiveTaskPageComponent implements OnInit {

  liveTask: HaLiveTask;
  brickDependencies$: Observable<HaBrickVersion[]>;
  isLoading = true;
  liveTaskIsLiked = false;
  currentUser: HaUser;
  canEditLt = false;

  constructor(
    private liveTaskService: HaLiveTaskService,
    private activeRoute: ActivatedRoute,
    private router: Router,
    private portalService: FlPortalService,
    private authenticatedUserService: HaAuthenticatedUserService,
    private authService: HaAuthService,
    private likeService: HaLikeService,
    private dialogService: FlDialogService) {
  }

  ngOnInit(): void {
    this.authenticatedUserService.getUser().subscribe(user => {
      this.currentUser = user;
    });

    this.liveTaskService.getLiveTaskById(this.activeRoute.snapshot.params.id).subscribe(liveTask => {
      if (liveTask == null) {
        this.router.navigate(['../../'], {relativeTo: this.activeRoute});
      } else {
        this.liveTask = liveTask;
        this.brickDependencies$ = this.liveTaskService.getLiveTaskBrickDependencies(this.liveTask.id);
        this.isLoading = false;
        if (this.currentUser != null) {
          this.canEditLt = this.currentUser.id === this.liveTask.createdBy.id;
          if (!this.canEditLt) {
            this.liveTaskService.getCoAuthors(this.liveTask.id).subscribe((coAuthors) => {
              this.canEditLt = coAuthors.some(coAuthor => coAuthor.id === this.currentUser.id);
            });
          }
        }
      }
    });

    this.checkIfLiveTaskIsLiked(this.activeRoute.snapshot.params.id);
  }

  openCommentsPannel(): void {
    this.portalService.createPortal(HaCommentsPortalComponent, HaCommentsPortalConfig.create(), {
      user: this.currentUser,
      entity: this.liveTask,
      commentType: HaCommentType.LIVE_TASK_COMMENT
    } as HaCommentsPortalData).detachments();

  }

  toggleLikeLiveTaskButton(): void{
    if(this.liveTaskIsLiked){
      this.unlikeLiveTask();
    } else {
      this.likeLiveTask();
    }
  }

  private checkIfLiveTaskIsLiked(liveTaskId: string): void {
    this.likeService.checkIfLiked(HaLikeType.LIVE_TASK_LIKE, liveTaskId).subscribe((isLiked) => {
      this.liveTaskIsLiked = isLiked;
    });
  }

  private unlikeLiveTask(): void {
    this.likeService.unlike(HaLikeType.LIVE_TASK_LIKE, this.liveTask.id).subscribe((liveTask: HaLiveTask) => {
      if (liveTask != null) {
        this.liveTask = liveTask;
        this.liveTaskIsLiked = false;
      }
    });
  }

  private likeLiveTask(): void {
    if (!this.authService.hasAuthorizationCookie()){
      // navigate to login page
      this.router.navigate(['/login'])
      return;
    }
    this.likeService.like(HaLikeType.LIVE_TASK_LIKE, this.liveTask.id).subscribe((liveTask: HaLiveTask) => {
      if (liveTask != null) {
        this.liveTask = liveTask;
        this.liveTaskIsLiked = true;
      }
    });
  }

  onTitleChange(title: string): void {
    this.liveTaskService.updateTitle(this.liveTask.id, title).subscribe((liveTask: HaLiveTask) => {
    });
  }

  openCoAuthorDialog(): void{
    const input: HaCreateStoryDtoInput = {
      id: this.liveTask.id,
      service: this.liveTaskService,
      inviteText: 'invite_live_task_coauthor_information'
    };

    this.dialogService.openSmallDialog(HaCoAuthorDialogComponent, {data: input}).afterClosed().subscribe();
  }

  deleteLiveTask(): void {
    const confirmDeleteDialogInput: FlConfirmDialogInput = {
      title: 'delete_livetask',
      content: 'delete_livetask_content',
      successMessage: 'livetask_deleted',
      translateTitleAndContent: true,
      translateMessage: true,
      observable: this.liveTaskService.deleteLiveTask(this.liveTask.id),
    };
    this.dialogService.openConfirmDialog(confirmDeleteDialogInput).afterClosed().subscribe((res: FlConfirmDialogResult) => {
      if (res.choice) {
        this.router.navigate(['../'], {relativeTo: this.activeRoute});
      }
    });
  }
}
