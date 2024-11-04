import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { HaAuthenticatedUserService } from '../../../ha-core/ha-service/ha-authenticated-user.service';
import { ActivatedRoute } from '@angular/router';
import { HaUserService } from '../../../ha-core/ha-service/ha-user.service';
import { map } from 'rxjs/operators';
import { HaSpace } from '../../../ha-core/ha-model/ha-entities/ha-space.class';
import { HaSpaceService } from '../../../ha-core/ha-service/ha-space.service';
import { HaAgentDatasourcePaginated } from '../../../ha-core/ha-model/ha-entities/ha-agent.class';
import { HaAgentService } from '../../../ha-core/ha-service/ha-agent.service';
import { HaBrickService } from '../../../ha-core/ha-service/ha-brick.service';
import { HaBrickDatasourcePaginated } from '../../../ha-core/ha-model/ha-entities/ha-brick.class';
import { HaStoryService } from '../../../ha-core/ha-service/ha-story.service';
import { HaStoryDatasourcePaginated } from '../../../ha-core/ha-model/ha-entities/ha-story.class';
import { ClStringHelper } from '@monorepo/core-lib';
import { FlDialogService } from '@monorepo/front-core-lib';
import {
  HaProfileEditDialogComponent,
  HaProfileEditDialogData,
} from '../ha-profile-edit-dialog/ha-profile-edit-dialog.component';
import { CoUser } from '@monorepo/community-lib';

export interface HaProfileDatasourceFilters {
  userId: string;
}

@Component({
  selector: 'ha-profile',
  templateUrl: './ha-profile.component.html',
  styleUrl: './ha-profile.component.scss',
})
export class HaProfileComponent implements OnInit {
  user: CoUser;
  isCurrentUser: boolean;
  commonSpace$: Observable<HaSpace[]>;
  agents$: HaAgentDatasourcePaginated<HaProfileDatasourceFilters>;
  stories$: HaStoryDatasourcePaginated<HaProfileDatasourceFilters>;
  bricks$: HaBrickDatasourcePaginated<HaProfileDatasourceFilters>;

  constructor(
    private authenticatedUserService: HaAuthenticatedUserService,
    private userService: HaUserService,
    private spaceService: HaSpaceService,
    private agentService: HaAgentService,
    private brickService: HaBrickService,
    private storyService: HaStoryService,
    private dialogService: FlDialogService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.init();
  }

  openEditProfileDialog(user: CoUser): void {
    this.dialogService
      .openMediumDialog(HaProfileEditDialogComponent, {
        data: {
          user: user,
        } as HaProfileEditDialogData,
      })
      .afterClosed()
      .subscribe((user) => {
        if (user) {
          this.init();
        }
      });
  }

  getStoryImageLink(storyId: string, imageLinkOrId?: string): string {
    if (!imageLinkOrId) {
      return '';
    }
    return ClStringHelper.isHttpLink(imageLinkOrId)
      ? imageLinkOrId
      : this.storyService.getImageUrl(storyId, imageLinkOrId);
  }

  private init(): void {
    const paramId = this.route.snapshot.params['id'];
    this.agents$ = this.agentService.getUserAgentsPaginated();
    this.bricks$ = this.brickService.getUserBricksPaginated();
    this.stories$ = this.storyService.getUserStoriesPaginated();
    this.updateDatasources(paramId);

    this.userService.getUserById(paramId).subscribe((user) => {
      this.user = user;
      this.authenticatedUserService.getUser().subscribe((currentUser) => {
        this.isCurrentUser = currentUser?.id === user?.id;
        if (currentUser != null) {
          this.commonSpace$ = this.spaceService
            .getUserCommonSpace(user.id)
            .pipe(
              map((spaces) => {
                return spaces;
              })
            );
        }
      });
    });
  }

  private updateDatasources(userId: string): void {
    this.agents$.getFirstPage({
      userId: userId,
    });
    this.bricks$.getFirstPage({
      userId: userId,
    });
    this.stories$.getFirstPage({
      userId: userId,
    });
  }
}
