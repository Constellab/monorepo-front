import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import { FlThemeService } from '@monorepo/front-core-lib/fl-theme';
import { TranslatePipe } from '@ngx-translate/core';

import { CaTeamCardComponent } from '../../../ca-core/entity-module/ca-group-core/component/ca-team-card/ca-team-card.component';
import {
  CaTeamFormDialogComponent,
  CaTeamFormDialogInput,
} from '../../../ca-core/entity-module/ca-group-core/component/ca-team-form-dialog/ca-team-form-dialog.component';
import { CaGroup, CaGroupDatasource } from '../../../ca-core/model/entities/ca-group.entity';
import { CaIsSpaceUserDirective } from '../../../ca-core/module/ca-core-directive/ca-is-space-user/ca-is-space-user.directive';
import { CaRouterService } from '../../../ca-core/service/ca-router.service';
import { CaAuthenticatedUserService } from '../../../ca-core/service-api/ca-authenticated-user.service';
import { CaGroupService } from '../../../ca-core/service-api/ca-group.service';
import { CaDashboardEmptyListComponent } from '../ca-dashboard-empty-list/ca-dashboard-empty-list.component';
import { CaDashboardListLayoutComponent } from '../ca-dashboard-list-layout/ca-dashboard-list-layout.component';

/**
 * Small list of groups in the dashboard
 */
@Component({
  selector: 'ca-dashboard-teams',
  templateUrl: './ca-dashboard-teams.component.html',
  styleUrls: ['./ca-dashboard-teams.component.scss'],
  imports: [
    CaDashboardListLayoutComponent,
    CaTeamCardComponent,
    CaDashboardEmptyListComponent,
    CaIsSpaceUserDirective,
    MatButtonModule,
    MatIcon,
    TranslatePipe,
  ],
})
export class CaDashboardTeamsComponent implements OnInit {
  private groupService = inject(CaGroupService);
  private dialogService = inject(FlDialogService);
  private routerService = inject(CaRouterService);

  isSpaceUser = inject(CaAuthenticatedUserService).isCurrentSpaceUser();

  teamsDatasource: CaGroupDatasource;

  myTeamsRoute: string = CaRouterService.getMyTeamsRoute();

  color = inject(FlThemeService).getCurrentThemeDetail().accent;

  ngOnInit(): void {
    this.teamsDatasource = this.groupService.getMyTeamsDatasource(CaDashboardListLayoutComponent.maxItems);
  }

  openCreateTeamDialog(): void {
    const input: CaTeamFormDialogInput = { mode: 'create' };

    this.dialogService
      .openSmallDialog(CaTeamFormDialogComponent, { data: input })
      .afterClosed()
      .subscribe((team) => this.onOpenTeamDialogClosed(team));
  }

  private onOpenTeamDialogClosed(team?: CaGroup): void {
    if (team) {
      this.routerService.navigateToTeam(team.id);
    }
  }
}
