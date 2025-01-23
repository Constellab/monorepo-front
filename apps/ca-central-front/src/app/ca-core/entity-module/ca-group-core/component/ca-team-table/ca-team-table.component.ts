import { Component, Input } from '@angular/core';
import { FlArrayObs } from '@monorepo/front-core-lib/fl-core';
import { FlTableColumnStatic } from '@monorepo/front-core-lib/fl-core';
import { CaGroup } from '../../../../model/entities/ca-group.entity';
import {
  MatTable,
  MatColumnDef,
  MatHeaderCellDef,
  MatHeaderCell,
  MatCellDef,
  MatCell,
  MatHeaderRowDef,
  MatHeaderRow,
  MatRowDef,
  MatRow,
} from '@angular/material/table';
import { MatSort, MatSortHeader } from '@angular/material/sort';
import { FlSearchModule } from '@monorepo/front-core-lib/fl-search';
import { RouterLink } from '@angular/router';
import { FlUserModule } from '@monorepo/front-core-lib/fl-user';
import { CaTeamActionMenuComponent } from '../ca-team-action-menu/ca-team-action-menu.component';
import { CaDetailRoutePipe } from '../../../../module/ca-core-pipe/ca-detail-route/ca-detail-route.pipe';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'ca-team-table',
  templateUrl: './ca-team-table.component.html',
  styleUrls: ['./ca-team-table.component.scss'],
  imports: [
    MatTable,
    MatSort,
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
