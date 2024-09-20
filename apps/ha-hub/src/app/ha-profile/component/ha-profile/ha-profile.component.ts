import { Component, OnInit } from '@angular/core';
import { Observable, of, switchMap } from 'rxjs';
import { HaUser } from '../../../ha-core/ha-model/ha-entities/ha-user';
import { HaAuthenticatedUserService } from '../../../ha-core/ha-service/ha-authenticated-user.service';
import { ActivatedRoute } from '@angular/router';
import { HaUserService } from '../../../ha-core/ha-service/ha-user.service';
import { map } from 'rxjs/operators';
import { HaSpace } from '../../../ha-core/ha-model/ha-entities/ha-space.class';
import { HaSpaceService } from '../../../ha-core/ha-service/ha-space.service';
import { HaLiveTaskDatasourcePaginated } from '../../../ha-core/ha-model/ha-entities/ha-live-task.class';
import { HaLiveTaskService } from '../../../ha-core/ha-service/ha-live-task.service';
import { HaBrickService } from '../../../ha-core/ha-service/ha-brick.service';
import { HaBrickDatasourcePaginated } from '../../../ha-core/ha-model/ha-entities/ha-brick.class';
import { HaStoryService } from '../../../ha-core/ha-service/ha-story.service';
import { HaStoryDatasourcePaginated } from '../../../ha-core/ha-model/ha-entities/ha-story.class';
import { ClStringHelper } from '@monorepo/core-lib';
import { FlDialogService } from '@monorepo/front-core-lib';
import {
  HaProfileEditDialogComponent,
  HaProfileEditDialogData
} from '../ha-profile-edit-dialog/ha-profile-edit-dialog.component';
import { CoUser } from '@monorepo/community-lib';

@Component({
  selector: 'ha-profile',
  templateUrl: './ha-profile.component.html',
  styleUrl: './ha-profile.component.scss'
})
export class HaProfileComponent implements OnInit {

  user$: Observable<CoUser>;
  currentUser$: Observable<HaUser>;
  isCurrentUser$: Observable<boolean>;
  commonSpace$: Observable<HaSpace[]>;
  liveTasks$: HaLiveTaskDatasourcePaginated;
  stories$: HaStoryDatasourcePaginated;
  bricks$: HaBrickDatasourcePaginated;

  constructor(private authenticatedUserService: HaAuthenticatedUserService,
              private userService: HaUserService,
              private spaceService: HaSpaceService,
              private liveTaskService: HaLiveTaskService,
              private brickService: HaBrickService,
              private storyService: HaStoryService,
              private dialogService: FlDialogService,
              private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.init();
  }

  openEditProfileDialog(user: CoUser): void {
    this.dialogService.openMediumDialog(HaProfileEditDialogComponent, {
      data: {
        user: user
      } as HaProfileEditDialogData
    }).afterClosed().subscribe(user => {
      if (user) {
        this.init();
      }
    });
  }

  getStoryImageLink(storyId: string, imageLinkOrId?: string): string {
    if (!imageLinkOrId) {
      return '';
    }
    return ClStringHelper.isHttpLink(imageLinkOrId) ? imageLinkOrId : this.storyService.getImageUrl(storyId, imageLinkOrId);
  }

  private init(): void {
    this.user$ = this.route.params.pipe(
      switchMap(params => {
        this.liveTasks$ = this.liveTaskService.getUserLiveTasksPaginated();
        this.bricks$ = this.brickService.getUserBricksPaginated();
        this.stories$ = this.storyService.getUserStoriesPaginated();
        this.updateDatasources(params.id);
        return this.userService.getUserById(params.id);
      })
    );
    this.currentUser$ = this.authenticatedUserService.getUser();
    this.isCurrentUser$ = this.user$.pipe(
      switchMap(user => this.currentUser$.pipe(
        map(currentUser => currentUser?.id === user?.id)
      ))
    );
    this.commonSpace$ = this.user$.pipe(
      switchMap(user => this.currentUser$.pipe(
        switchMap(currentUser => this.isCurrentUser$.pipe(
          switchMap(isCurrentUser => {
            if (currentUser != null && !isCurrentUser) {
              return this.spaceService.getUserCommonSpace(user.id).pipe(
                map(spaces => {
                  return spaces;
                })
              );
            } else {
              return of([]);
            }
          })
        ))
      ))
    );
  }

  private updateDatasources(userId: string): void {
    this.liveTasks$.getFirstPage({
      userId: userId
    });
    this.bricks$.getFirstPage({
      userId: userId
    });
    this.stories$.getFirstPage({
      userId: userId
    });
  }

}
