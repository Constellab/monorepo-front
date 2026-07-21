import { ChangeDetectionStrategy,Component, inject, Input } from '@angular/core';
import { FlCardModule } from '@monorepo/front-core-lib/fl-card';
import { FlKeyValueModule } from '@monorepo/front-core-lib/fl-key-value';
import { TranslatePipe } from '@ngx-translate/core';

import {
  CaTeamActionMenuComponent,
} from '../../../../ca-core/entity-module/ca-group-core/component/ca-team-action-menu/ca-team-action-menu.component';
import { CaGroup } from '../../../../ca-core/model/entities/ca-group.entity';
import { CaRouterService } from '../../../../ca-core/service/ca-router.service';
import { CaTeamUsersListComponent } from '../ca-team-users-list/ca-team-users-list.component';

/**
 * Show detail of a team
 */
@Component({
  selector: 'ca-team-detail',
  templateUrl: './ca-team-detail.component.html',
  styleUrls: ['./ca-team-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    FlCardModule,
    FlKeyValueModule,
    CaTeamActionMenuComponent,
    CaTeamUsersListComponent,
    TranslatePipe,
  ],
})
export class CaTeamDetailComponent {
  private routerService = inject(CaRouterService);

  @Input() team: CaGroup;

  onTeamDeleted(): void {
    this.routerService.navigateToMyTeams();
  }
}
