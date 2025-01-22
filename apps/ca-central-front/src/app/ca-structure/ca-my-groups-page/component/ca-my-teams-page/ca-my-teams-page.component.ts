import { Component, OnInit, inject } from '@angular/core';
import { CaGroup, CaGroupDatasource } from '../../../../ca-core/model/entities/ca-group.entity';
import { CaGroupService } from '../../../../ca-core/service-api/ca-group.service';
import { FlDialogService, FlFormDialogInput } from '@monorepo/front-core-lib';
import { CaRouterService } from '../../../../ca-core/service/ca-router.service';
import { CaTeamFormDialogComponent } from '../../../../ca-core/entity-module/ca-group-core/component/ca-team-form-dialog/ca-team-form-dialog.component';
import { FlSectionModule } from '../../../../../../../../libs/front-core-lib/src/lib/module/fl-section/fl-section.module';
import { FlTextIconModule } from '../../../../../../../../libs/front-core-lib/src/lib/module/fl-text-icon/fl-text-icon.module';
import { MatIcon } from '@angular/material/icon';
import { FlIconModule } from '../../../../../../../../libs/front-core-lib/src/lib/module/fl-svg-icon/fl-icon.module';
import { MatButton } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { CaTeamCardComponent } from '../../../../ca-core/entity-module/ca-group-core/component/ca-team-card/ca-team-card.component';
import { FlInfiniteScrollModule } from '../../../../../../../../libs/front-core-lib/src/lib/module/fl-inifite-scroll/fl-infinite-scroll.module';
import { CaDetailRoutePipe } from '../../../../ca-core/module/ca-core-pipe/ca-detail-route/ca-detail-route.pipe';
import { TranslatePipe } from '@ngx-translate/core';

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
