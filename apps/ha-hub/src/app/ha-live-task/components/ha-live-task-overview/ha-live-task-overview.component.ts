import {Component, computed, OnInit, Signal} from '@angular/core';
import {HaLiveTaskTextEditorConfig} from '../ha-live-task-core/ha-live-task-text-editor.config';
import {FormControl} from '@ngneat/reactive-forms';
import {HaLiveTask} from '../../../ha-core/ha-model/ha-entities/ha-live-task.class';
import {HaLiveTaskVersion} from '../../../ha-core/ha-model/ha-entities/ha-live-task-version.class';
import {HaLiveTaskService} from '../../../ha-core/ha-service/ha-live-task.service';
import {ActivatedRoute, Router} from '@angular/router';
import {TeRichTextContent} from '@monorepo/text-editor';
import {HaLikeType} from '../../../ha-core/ha-model/ha-entities/ha-entity-type.enum';
import {HaLikeService} from '../../../ha-core/ha-service/ha-like.service';
import {HaAuthService} from '../../../ha-core/ha-service/ha-auth.service';
import {
  HaCommentsPortalComponent,
  HaCommentsPortalData
} from '../../../ha-core/entity-module/ha-comments-core/component/ha-comments-portal/ha-comments-portal.component';
import {HaCommentType} from '../../../ha-core/entity-module/ha-comments-core/model/ha-abstract-comment.class';
import {FlConfirmDialogInput, FlConfirmDialogResult, FlDialogService, FlPortalService} from '@monorepo/front-core-lib';
import {HaRouterService} from '../../../ha-core/ha-service/ha-router.service';
import {HaLiveTaskPageState} from '../../state/ha-live-task-page.state';

@Component({
  selector: 'ha-live-task-overview',
  templateUrl: './ha-live-task-overview.component.html',
  styleUrls: ['./ha-live-task-overview.component.scss'],
})
export class HaLiveTaskOverviewComponent implements OnInit {

  profileRoute = HaRouterService.getProfileRoute();

  descriptionEditorDisabled: boolean = true;


  liveTask: Signal<HaLiveTask> = this.liveTaskPageState.getLiveTask();
  liveTaskVersion: Signal<HaLiveTaskVersion> = this.liveTaskPageState.liveTaskVersion;
  isLiveTaskVersionError: Signal<boolean> = this.liveTaskPageState.isLiveTaskVersionError;
  isLiveTaskVersionLoading: Signal<boolean> = this.liveTaskPageState.isLiveTaskVersionLoading;
  canEditLt: Signal<boolean> = this.liveTaskPageState.canEditLt;
  liveTaskIsLiked: Signal<boolean> = this.liveTaskPageState.getIsLiked();
  isLoading: Signal<boolean> = this.liveTaskPageState.getIsLoading();
  isAuthor: Signal<boolean> = this.liveTaskPageState.isAuthor;
  liveTaskDescription: Signal<TeRichTextContent> = this.liveTaskPageState.getLiveTaskDescription();
  descriptionFormControl: Signal<FormControl<TeRichTextContent>> = computed(() => {
    const formControl = new FormControl<TeRichTextContent>();
    if (this.liveTaskDescription()) {
      formControl.setValue(this.liveTaskDescription());
      formControl.disable();
    }
    return formControl;
  });
  textEditorConfig: Signal<HaLiveTaskTextEditorConfig> = computed(() => {
    return new HaLiveTaskTextEditorConfig(this.liveTaskService, this.liveTask().id);
  });

  constructor(
    private liveTaskService: HaLiveTaskService,
    private activeRoute: ActivatedRoute,
    private authService: HaAuthService,
    private likeService: HaLikeService,
    private portalService: FlPortalService,
    private dialogService: FlDialogService,
    private router: Router,
    private liveTaskPageState: HaLiveTaskPageState) {
  }

  ngOnInit(): void {
    this.activeRoute.params.subscribe(params => {
      if (params['id'] != null) {
        this.setupLatestLiveTaskVersion(params['id']);
      }
    });

  }

  setupLatestLiveTaskVersion(id: string): void {
    this.liveTaskPageState.setLatestLiveTaskVersion(id);
  }

  onDescriptionChange(description: TeRichTextContent): void {
    this.descriptionFormControl().setValue(description);
  }


  onDescriptionEditorButtonClick(): void {
    if (this.descriptionEditorDisabled) {
      this.descriptionEditorDisabled = false;
      this.descriptionFormControl().enable();
      return;
    }

    this.liveTaskService.saveLiveTaskDescription(this.liveTask().id, this.descriptionFormControl().value)
      .subscribe((liveTask: HaLiveTask) => {
        this.descriptionEditorDisabled = true;
        if (liveTask != null) {
          this.liveTaskPageState.setLiveTask(liveTask);
        }
        this.descriptionFormControl().disable();
      })
  }

  onTitleChange(title: string): void {
    this.liveTaskService.updateTitle(this.liveTask().id, title).subscribe();
  }

  openCommentsPanel(): void {
    this.portalService.createPortal(HaCommentsPortalComponent, this.portalService.getRightSidePortalConfig(), {
      user: this.liveTaskPageState.getCurrentUser()(),
      entity: this.liveTask(),
      commentType: HaCommentType.LIVE_TASK_COMMENT
    } as HaCommentsPortalData).detachments();

  }

  toggleLikeLiveTaskButton(): void{
    if (this.liveTaskIsLiked()) {
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
      observable: this.liveTaskService.deleteLiveTask(this.liveTask().id),
    };
    this.dialogService.openConfirmDialog(confirmDeleteDialogInput).afterClosed().subscribe((res: FlConfirmDialogResult) => {
      if (res.choice) {
        this.router.navigate(['../'], {relativeTo: this.activeRoute});
      }
    });
  }

  private unlikeLiveTask(): void {
    if (!this.authService.hasAuthorizationCookie()) {
      // navigate to login page
      this.router.navigate(['/login']);
      return;
    }
    this.likeService.unlike(HaLikeType.LIVE_TASK_LIKE, this.liveTask().id).subscribe((liveTask: HaLiveTask) => {
      if (liveTask != null) {
        this.liveTaskPageState.setIsLiked(false);
        this.liveTaskPageState.setLiveTask(liveTask);
      }
    });
  }

  private likeLiveTask(): void {
    if (!this.authService.hasAuthorizationCookie()){
      // navigate to login page
      this.router.navigate(['/login']);
      return;
    }
    this.likeService.like(HaLikeType.LIVE_TASK_LIKE, this.liveTask().id).subscribe((liveTask: HaLiveTask) => {
      if (liveTask != null) {
        this.liveTaskPageState.setIsLiked(true);
        this.liveTaskPageState.setLiveTask(liveTask);
      }
    });
  }
}
