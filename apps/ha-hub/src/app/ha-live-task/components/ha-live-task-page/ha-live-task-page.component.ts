import {Component, OnInit} from '@angular/core';
import {HaLiveTaskService} from '../../../ha-core/ha-service/ha-live-task.service';
import {ActivatedRoute, Router} from '@angular/router';
import {HaLiveTask} from '../../../ha-core/ha-model/ha-entities/ha-live-task.class';
import {HaBrickVersion} from '../../../ha-core/ha-model/ha-entities/ha-brick-version.class';
import {Observable} from 'rxjs';
import {
  CoCommentsPortalComponent,
  CoCommentsPortalConfig,
  CoCommentsPortalData,
  CoCommentType
} from '@monorepo/community-lib';
import {HaAuthService} from '../../../ha-core/ha-service/ha-auth.service';
import {FlPortalService} from '@monorepo/front-core-lib';
import {HaUser} from '../../../ha-core/ha-model/ha-entities/ha-user';
import {HaAuthenticatedUserService} from '../../../ha-core/ha-service/ha-authenticated-user.service';
import {HaLikeService} from '../../../ha-core/ha-service/ha-like.service';
import {HaLikeType} from '../../../ha-core/ha-model/ha-entities/ha-entity-type.enum';
import {HaCommentService} from '../../../ha-core/ha-service/ha-comment.service';


@Component({
  selector: 'ha-live-task-page',
  templateUrl: './ha-live-task-page.component.html',
  styleUrls: ['./ha-live-task-page.component.scss']
})
export class HaLiveTaskPageComponent implements OnInit {

  liveTask: HaLiveTask;
  brickDependencies$: Observable<HaBrickVersion[]>;
  currentTab: string;
  isLoading = true;
  liveTaskIsLiked = false;
  currentUser: HaUser;

  constructor(
    private liveTaskService: HaLiveTaskService,
    private activeRoute: ActivatedRoute,
    private router: Router,
    private portalService: FlPortalService,
    private authenticatedUserService: HaAuthenticatedUserService,
    private authService: HaAuthService,
    private likeService: HaLikeService,
    private commentService: HaCommentService) {
  }

  ngOnInit(): void {
    this.authenticatedUserService.getUser().subscribe(user => {
      this.currentUser = user;
    });

    this.liveTaskService.getLiveTaskById(this.activeRoute.snapshot.params.id).subscribe(liveTask => {
      if (liveTask == null) {
        this.router.navigate(['../'], {relativeTo: this.activeRoute});
      } else {
        this.liveTask = liveTask;
        this.brickDependencies$ = this.liveTaskService.getLiveTaskBrickDependencies(this.liveTask.id);
        this.isLoading = false;
      }
    });

    this.checkIfLiveTaskIsLiked(this.activeRoute.snapshot.params.id);

    this.currentTab = this.activeRoute.snapshot.firstChild.url[0]?.path;
  }

  openCommentsPannel(): void {
    this.portalService.createPortal(CoCommentsPortalComponent, CoCommentsPortalConfig.create(), {
      service: this.commentService,
      user: this.currentUser,
      entity: this.liveTask,
      commentType: CoCommentType.LIVE_TASK_COMMENT
    } as CoCommentsPortalData).detachments();

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
}
