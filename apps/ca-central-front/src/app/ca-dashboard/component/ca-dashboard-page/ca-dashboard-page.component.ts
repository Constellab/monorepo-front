import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CaCurrentSpaceService } from '../../../ca-core/service-api/ca-current-space.service';
import { Observable } from 'rxjs';
import { CaSpace } from '../../../ca-core/model/entities/space/ca-space.class';
import { CaUserDatasourcePaginated } from '../../../ca-core/model/entities/ca-user.class';
import { CaEnvironmentHelper } from '../../../ca-core/utils/ca-environment.helper';
import { CoCommunityHelperService } from '@monorepo/community-lib';
import { FlCoreDirectiveModule } from '@monorepo/front-core-lib/fl-core-directive';
import { CaUserListInlineComponent } from '../../../ca-core/entity-module/ca-user-core/component/ca-user-list-inline/ca-user-list-inline.component';
import { CaDashboardFoldersComponent } from '../ca-dashboard-folders/ca-dashboard-folders.component';
import { CaDashboardLabsComponent } from '../ca-dashboard-labs/ca-dashboard-labs.component';
import { CaDashboardTeamsComponent } from '../ca-dashboard-teams/ca-dashboard-teams.component';
import { MatRipple } from '@angular/material/core';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { MatIcon } from '@angular/material/icon';
import {
  CaDashboardMyActivityComponent
} from '../ca-dashboard-my-activity/ca-dashboard-my-activity.component';
import { CaDashboardVideosComponent } from '../ca-dashboard-videos/ca-dashboard-videos.component';
import { AsyncPipe } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';

/**
 * Page containing the user dashboard
 */
@Component({
  selector: 'ca-dashboard-page',
  templateUrl: './ca-dashboard-page.component.html',
  styleUrls: ['./ca-dashboard-page.component.scss'],
  imports: [
    FlCoreDirectiveModule,
    CaUserListInlineComponent,
    CaDashboardFoldersComponent,
    CaDashboardLabsComponent,
    CaDashboardTeamsComponent,
    MatRipple,
    FlTextIconModule,
    MatIcon,
    CaDashboardMyActivityComponent,
    CaDashboardVideosComponent,
    AsyncPipe,
    TranslatePipe,
  ],
})
export class CaDashboardPageComponent implements OnInit, OnDestroy {
  private currentSpaceService = inject(CaCurrentSpaceService);
  private communityHelper = inject(CoCommunityHelperService);

  communityLink: string;
  supportMail = CaEnvironmentHelper.getSupportMail();

  currentSpace$: Observable<CaSpace> = this.currentSpaceService.getCurrentSpace$();
  spaceUsers: CaUserDatasourcePaginated = this.currentSpaceService.getCurrentSpaceUsersDatasource();

  ngOnInit(): void {
    this.communityLink = this.communityHelper.getCommunityUrl();
  }

  ngOnDestroy(): void {
    this.spaceUsers.disconnect();
  }
}
