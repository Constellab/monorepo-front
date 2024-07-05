import {Component, OnInit} from '@angular/core';
import {HaLiveTaskTextEditorConfig} from '../ha-live-task-core/ha-live-task-text-editor.config';
import {FormControl} from '@ngneat/reactive-forms';
import {HaLiveTask} from '../../../ha-core/ha-model/ha-entities/ha-live-task.class';
import {HaLiveTaskVersion} from '../../../ha-core/ha-model/ha-entities/ha-live-task-version.class';
import {HaLiveTaskService} from '../../../ha-core/ha-service/ha-live-task.service';
import {ActivatedRoute, Router} from '@angular/router';
import {HaAuthenticatedUserService} from '../../../ha-core/ha-service/ha-authenticated-user.service';
import {TeRichTextContent} from '@monorepo/text-editor';
import {HaUser} from '../../../ha-core/ha-model/ha-entities/ha-user';
import {HaLikeType} from '../../../ha-core/ha-model/ha-entities/ha-entity-type.enum';
import {HaLikeService} from '../../../ha-core/ha-service/ha-like.service';
import {HaAuthService} from '../../../ha-core/ha-service/ha-auth.service';
import {
  HaCommentsPortalComponent,
  HaCommentsPortalData
} from '../../../ha-core/entity-module/ha-comments-core/component/ha-comments-portal/ha-comments-portal.component';
import {
  HaCommentsPortalConfig
} from '../../../ha-core/entity-module/ha-comments-core/model/ha-comments-portal-config.class';
import {HaCommentType} from '../../../ha-core/entity-module/ha-comments-core/model/ha-abstract-comment.class';
import {FlConfirmDialogInput, FlConfirmDialogResult, FlDialogService, FlPortalService} from '@monorepo/front-core-lib';
import {HaRouterService} from '../../../ha-core/ha-service/ha-router.service';

@Component({
  selector: 'ha-live-task-overview',
  templateUrl: './ha-live-task-overview.component.html',
  styleUrls: ['./ha-live-task-overview.component.scss'],
})
export class HaLiveTaskOverviewComponent implements OnInit {

  profileRoute = HaRouterService.getProfileRoute();
  liveTaskIsLiked = false;
  liveTask: HaLiveTask;
  liveTaskVersion: HaLiveTaskVersion;
  textEditorConfig: HaLiveTaskTextEditorConfig;
  descriptionFormControl: FormControl<TeRichTextContent> = new FormControl<TeRichTextContent>();
  descriptionEditorDisabled: boolean = true;
  canEditLt: boolean = false;
  isLoading: boolean = true;
  liveTaskCoAuthors: HaUser[];
  currentUser: HaUser;

  constructor(
    private liveTaskService: HaLiveTaskService,
    private activeRoute: ActivatedRoute,
    private authenticatedUserService: HaAuthenticatedUserService,
    private authService: HaAuthService,
    private likeService: HaLikeService,
    private portalService: FlPortalService,
    private dialogService: FlDialogService,
    private router: Router,) {
  }

  ngOnInit(): void {
    this.activeRoute.params.subscribe(params => {
      this.setupLiveTask(params['id'])
      this.setupLatestLiveTaskVersion(params['id']);
    });

    this.checkIfLiveTaskIsLiked(this.activeRoute.snapshot.params['id'])
  }

  setupLatestLiveTaskVersion(id: string): void {
    this.liveTaskService.getLatestLiveTaskVersionByLiveTaskId(id).subscribe(liveTaskVersion => {
      this.liveTaskVersion = liveTaskVersion;
      this.isLoading = false;
    });
  }

  private setupLiveTask(id: string): void {
    this.liveTaskService.getLiveTaskById(id).subscribe(liveTask => {
      if(!liveTask) return;
      this.liveTask = liveTask;
      this.textEditorConfig = new HaLiveTaskTextEditorConfig(this.liveTaskService, this.liveTask.id);
      this.descriptionFormControl.setValue(this.liveTask?.description);
      this.descriptionFormControl.disable();
      this.setupCoAuthors();
    });
  }

  private setupCoAuthors(): void{
    this.liveTaskService.getCoAuthors(this.liveTask.id).subscribe(coAuthors => {
      this.liveTaskCoAuthors = coAuthors;
      this.setupCanEdit();
    });
  }

  private setupCanEdit():void{
    this.authenticatedUserService.getUser().subscribe(user => {
      this.currentUser = user;
      this.canEditLt = (user?.id === this.liveTask?.createdBy.id ||
        this.liveTaskCoAuthors?.some(coAuthor => coAuthor.id === user?.id));
    });
  }

  private checkIfLiveTaskIsLiked(liveTaskId: string): void {
    this.likeService.checkIfLiked(HaLikeType.LIVE_TASK_LIKE, liveTaskId).subscribe((isLiked) => {
      this.liveTaskIsLiked = isLiked;
    });
  }

  onDescriptionChange(description: TeRichTextContent): void {
    this.liveTask.description = description;
  }

  onDescriptionEditorButtonClick(): void {
    if (this.descriptionEditorDisabled) {
      this.descriptionEditorDisabled = false;
      this.descriptionFormControl.enable();
      return;
    }

    this.liveTaskService.saveLiveTaskDescription(this.liveTask.id, this.liveTask.description).subscribe((liveTask) => {
      if (liveTask) {
        this.liveTask = liveTask;
        if (this.liveTaskVersion)
          this.liveTaskVersion.liveTask = liveTask;
      }
      this.descriptionEditorDisabled = true;
      this.descriptionFormControl.disable();
    })
  }

  onTitleChange(title: string): void {
    this.liveTaskService.updateTitle(this.liveTask.id, title).subscribe();
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

  private unlikeLiveTask(): void {
    this.likeService.unlike(HaLikeType.LIVE_TASK_LIKE, this.liveTask.id).subscribe((liveTask: HaLiveTask) => {
      if (liveTask != null) {
        this.liveTask.likes = liveTask.likes;
        this.liveTaskIsLiked = false;
      }
    });
  }

  private likeLiveTask(): void {
    if (!this.authService.hasAuthorizationCookie()){
      // navigate to login page
      this.router.navigate(['/login']);
      return;
    }
    this.likeService.like(HaLikeType.LIVE_TASK_LIKE, this.liveTask.id).subscribe((liveTask: HaLiveTask) => {
      if (liveTask != null) {
        this.liveTask.likes = liveTask.likes;
        this.liveTaskIsLiked = true;
      }
    });
  }
}
