import {Component, OnInit} from '@angular/core';
import {HaLiveTaskService} from '../../../ha-core/ha-service/ha-live-task.service';
import {ActivatedRoute, Router} from '@angular/router';
import {HaLiveTask} from '../../../ha-core/ha-model/ha-entities/ha-live-task.class';
import {HaBrickVersion} from '../../../ha-core/ha-model/ha-entities/ha-brick-version.class';
import {Observable} from 'rxjs';
import {HaLikeLiveTaskService} from '../../../ha-core/ha-service/ha-like-live-task.service';
import {HaCommentLiveTaskService} from '../../../ha-core/ha-service/ha-comment-live-task.service';
import {CoCommentsPortalComponent, CoCommentsPortalConfig, CoCommentsPortalData} from '@monorepo/community-lib';
import {HaAuthService} from '../../../ha-core/ha-service/ha-auth.service';
import {FlPortalService} from '@monorepo/front-core-lib';
import {HaUser} from '../../../ha-core/ha-model/ha-entities/ha-user';
import {HaAuthenticatedUserService} from '../../../ha-core/ha-service/ha-authenticated-user.service';


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
    private likeLiveTaskService: HaLikeLiveTaskService,
    private commentLiveTaskService: HaCommentLiveTaskService){
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

  private checkIfLiveTaskIsLiked(liveTaskId: string): void {
    this.likeLiveTaskService.checkIfLiked(liveTaskId).subscribe((isLiked) => {
      this.liveTaskIsLiked = isLiked;
    });
  }

  toggleLikeLiveTaskButton(): void{
    if(this.liveTaskIsLiked){
      this.unlikeLiveTask();
    } else {
      this.likeLiveTask();
    }
  }

  private unlikeLiveTask(): void {
    this.likeLiveTaskService.unlike(this.liveTask.id).subscribe((liveTask) => {
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
    this.likeLiveTaskService.like(this.liveTask.id).subscribe((liveTask) => {
      if (liveTask != null) {
        this.liveTask = liveTask;
        this.liveTaskIsLiked = true;
      }
    });
  }

  openCommentsPannel(): void {
    this.portalService.createPortal(CoCommentsPortalComponent, CoCommentsPortalConfig.create(), {
      service: this.commentLiveTaskService,
      user: this.currentUser,
      entityId: this.liveTask.id
    } as CoCommentsPortalData).detachments();

  }
}
