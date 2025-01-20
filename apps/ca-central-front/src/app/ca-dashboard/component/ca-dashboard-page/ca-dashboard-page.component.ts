import { Component, OnDestroy, OnInit } from '@angular/core';
import { CaCurrentSpaceService } from '../../../ca-core/service-api/ca-current-space.service';
import { Observable } from 'rxjs';
import { CaSpace } from '../../../ca-core/model/entities/space/ca-space.class';
import { CaUserDatasourcePaginated } from '../../../ca-core/model/entities/ca-user.class';
import { CaEnvironmentHelper } from '../../../ca-core/utils/ca-environment.helper';
import { CoCommunityHelperService } from '@monorepo/community-lib';

/**
 * Page containing the user dashboard
 */
@Component({
    selector: 'ca-dashboard-page',
    templateUrl: './ca-dashboard-page.component.html',
    styleUrls: ['./ca-dashboard-page.component.scss'],
    standalone: false
})
export class CaDashboardPageComponent implements OnInit, OnDestroy {
  communityLink: string;
  supportMail = CaEnvironmentHelper.getSupportMail();

  currentSpace$: Observable<CaSpace> = this.currentSpaceService.getCurrentSpace$();
  spaceUsers: CaUserDatasourcePaginated = this.currentSpaceService.getCurrentSpaceUsersDatasource();

  constructor(
    private currentSpaceService: CaCurrentSpaceService,
    private communityHelper: CoCommunityHelperService
  ) {}

  ngOnInit(): void {
    this.communityLink = this.communityHelper.getCommunityUrl();
  }

  ngOnDestroy(): void {
    this.spaceUsers.disconnect();
  }
}
