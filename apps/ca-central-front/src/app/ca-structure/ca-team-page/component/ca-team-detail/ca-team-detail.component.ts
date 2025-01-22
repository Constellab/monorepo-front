import { Component, Input, OnInit, inject } from '@angular/core';
import { CaGroup } from '../../../../ca-core/model/entities/ca-group.entity';
import { CaRouterService } from '../../../../ca-core/service/ca-router.service';
import { FlCardModule } from '../../../../../../../../libs/front-core-lib/src/lib/module/fl-card/fl-card.module';
import { FlKeyValueModule } from '../../../../../../../../libs/front-core-lib/src/lib/module/fl-key-value/fl-key-value.module';
import { CaTeamActionMenuComponent } from '../../../../ca-core/entity-module/ca-group-core/component/ca-team-action-menu/ca-team-action-menu.component';
import { CaTeamUsersListComponent } from '../ca-team-users-list/ca-team-users-list.component';
import { TranslatePipe } from '@ngx-translate/core';

/**
 * Show detail of a team
 */
@Component({
  selector: 'ca-team-detail',
  templateUrl: './ca-team-detail.component.html',
  styleUrls: ['./ca-team-detail.component.scss'],
  imports: [
    FlCardModule,
    FlKeyValueModule,
    CaTeamActionMenuComponent,
    CaTeamUsersListComponent,
    TranslatePipe,
  ],
})
export class CaTeamDetailComponent implements OnInit {
  private routerService = inject(CaRouterService);

  @Input() team: CaGroup;

  ngOnInit(): void {}

  onTeamDeleted(): void {
    this.routerService.navigateToMyTeams();
  }
}
