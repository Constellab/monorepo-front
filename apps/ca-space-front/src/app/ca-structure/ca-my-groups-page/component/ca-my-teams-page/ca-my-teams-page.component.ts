import { Component, inject, OnInit } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { FlFormDialogInput } from '@monorepo/front-core-lib/fl-core';
import { FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import { FlInfiniteScrollModule } from '@monorepo/front-core-lib/fl-infinite-scroll';
import { FlSectionModule } from '@monorepo/front-core-lib/fl-section';
import { FlIconModule } from '@monorepo/front-core-lib/fl-svg-icon';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { TranslatePipe } from '@ngx-translate/core';

import { CaTeamCardComponent } from '../../../../ca-core/entity-module/ca-group-core/component/ca-team-card/ca-team-card.component';
import { CaTeamFormDialogComponent } from '../../../../ca-core/entity-module/ca-group-core/component/ca-team-form-dialog/ca-team-form-dialog.component';
import { CaGroup, CaGroupDatasource } from '../../../../ca-core/model/entities/ca-group.entity';
import { CaIsSpaceUserDirective } from '../../../../ca-core/module/ca-core-directive/ca-is-space-user/ca-is-space-user.directive';
import { CaDetailRoutePipe } from '../../../../ca-core/module/ca-core-pipe/ca-detail-route/ca-detail-route.pipe';
import { CaRouterService } from '../../../../ca-core/service/ca-router.service';
import { CaGroupService } from '../../../../ca-core/service-api/ca-group.service';

@Component({
  selector: 'ca-my-teams-page',
  templateUrl: './ca-my-teams-page.component.html',
  styleUrls: ['./ca-my-teams-page.component.scss'],
  imports: [
    FlSectionModule,
    FlTextIconModule,
    MatIcon,
    FlIconModule,
    MatButton,
    RouterLink,
    CaTeamCardComponent,
    FlInfiniteScrollModule,
    CaDetailRoutePipe,
    CaIsSpaceUserDirective,
    TranslatePipe,
  ],
})
export class CaMyTeamsPageComponent implements OnInit {
  private groupService = inject(CaGroupService);
  private routerService = inject(CaRouterService);
  private dialogService = inject(FlDialogService);

  teamsDatasource: CaGroupDatasource;

  ngOnInit(): void {
    this.teamsDatasource = this.groupService.getMyTeamsDatasource();
  }

  createTeam(): void {
    const input: FlFormDialogInput = {
      mode: 'create',
    };

    this.dialogService
      .openSmallDialog(CaTeamFormDialogComponent, { data: input })
      .afterClosed()
      .subscribe((group) => this.onCreateClosed(group));
  }

  private onCreateClosed(group?: CaGroup): void {
    if (group) {
      this.routerService.navigateToTeam(group.id);
    }
  }
}
