import { ChangeDetectionStrategy,Component, Input } from '@angular/core';
import { MatSortHeader } from '@angular/material/sort';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable,
} from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { FlArrayObs, FlTableColumnStatic } from '@monorepo/front-core-lib/fl-core';
import { FlSearchModule } from '@monorepo/front-core-lib/fl-search';
import { FlUserModule } from '@monorepo/front-core-lib/fl-user';
import { TranslatePipe } from '@ngx-translate/core';

import { CaGroup } from '../../../../model/entities/ca-group.entity';
import { CaDetailRoutePipe } from '../../../../module/ca-core-pipe/ca-detail-route/ca-detail-route.pipe';
import { CaTeamActionMenuComponent } from '../ca-team-action-menu/ca-team-action-menu.component';

@Component({
  selector: 'ca-team-table',
  templateUrl: './ca-team-table.component.html',
  styleUrls: ['./ca-team-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    MatTable,
    FlSearchModule,
    MatColumnDef,
    MatHeaderCellDef,
    MatHeaderCell,
    MatSortHeader,
    MatCellDef,
    MatCell,
    RouterLink,
    FlUserModule,
    CaTeamActionMenuComponent,
    MatHeaderRowDef,
    MatHeaderRow,
    MatRowDef,
    MatRow,
    CaDetailRoutePipe,
    TranslatePipe,
  ],
})
export class CaTeamTableComponent {
  @Input({ required: true }) datasource: FlArrayObs<CaGroup>;

  @Input() columns: FlTableColumnStatic<CaGroup>[] = ['label', 'creation', 'actions'];

  onTeamDeleted(team: CaGroup): void {
    this.datasource.removeItem(team);
  }
}
