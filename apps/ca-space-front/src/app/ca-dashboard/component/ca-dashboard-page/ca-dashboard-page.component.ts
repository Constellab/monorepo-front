import { AsyncPipe } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MatRipple } from '@angular/material/core';
import { MatIcon } from '@angular/material/icon';
import { CoCommunityHelperService } from '@monorepo/community-lib';
import { FlCardModule } from '@monorepo/front-core-lib/fl-card';
import { FlCoreDirectiveModule } from '@monorepo/front-core-lib/fl-core-directive';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import { CaUserListInlineComponent } from '../../../ca-core/entity-module/ca-user-core/component/ca-user-list-inline/ca-user-list-inline.component';
import { CaUserDatasourcePaginated } from '../../../ca-core/model/entities/ca-user.class';
import { CaSpace } from '../../../ca-core/model/entities/space/ca-space.class';
import { CaIsSpaceUserDirective } from '../../../ca-core/module/ca-core-directive/ca-is-space-user/ca-is-space-user.directive';
import { CaAuthenticatedUserService } from '../../../ca-core/service-api/ca-authenticated-user.service';
import { CaCurrentSpaceService } from '../../../ca-core/service-api/ca-current-space.service';
import { CaEnvironmentHelper } from '../../../ca-core/utils/ca-environment.helper';
import { CaDashboardAppsComponent } from '../ca-dashboard-apps/ca-dashboard-apps.component';
import { CaDashboardConstellabSuiteComponent } from '../ca-dashboard-constellab-suite/ca-dashboard-constellab-suite.component';
import { CaDashboardFoldersComponent } from '../ca-dashboard-folders/ca-dashboard-folders.component';
import { CaDashboardLabsComponent } from '../ca-dashboard-labs/ca-dashboard-labs.component';
import { CaDashboardTeamsComponent } from '../ca-dashboard-teams/ca-dashboard-teams.component';
import { CaDashboardVideosComponent } from '../ca-dashboard-videos/ca-dashboard-videos.component';

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
    CaDashboardAppsComponent,
    CaDashboardFoldersComponent,
    CaDashboardLabsComponent,
    CaDashboardTeamsComponent,
    MatRipple,
    FlTextIconModule,
    MatIcon,
    CaDashboardConstellabSuiteComponent,
    CaDashboardVideosComponent,
    CaIsSpaceUserDirective,
    AsyncPipe,
    TranslatePipe,
    FlCardModule,
  ],
})
export class CaDashboardPageComponent implements OnInit, OnDestroy {
  private currentSpaceService = inject(CaCurrentSpaceService);
  private communityHelper = inject(CoCommunityHelperService);
  private authenticatedUserService = inject(CaAuthenticatedUserService);

  communityLink: string;
  supportMail = CaEnvironmentHelper.getSupportMail();

  isSpaceUser = this.authenticatedUserService.isCurrentSpaceUser();

  currentSpace$: Observable<CaSpace> = this.currentSpaceService.getCurrentSpace$();
  spaceUsers: CaUserDatasourcePaginated = this.isSpaceUser
    ? this.currentSpaceService.getCurrentSpaceUsersDatasource()
    : null;

  ngOnInit(): void {
    this.communityLink = this.communityHelper.getCommunityUrl();
  }

  ngOnDestroy(): void {
    this.spaceUsers?.disconnect();
  }
}
