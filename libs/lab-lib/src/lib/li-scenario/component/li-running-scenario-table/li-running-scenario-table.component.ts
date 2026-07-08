import { Component, Input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
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
import { FlColorModule } from '@monorepo/front-core-lib/fl-color';
import { FlDatasource } from '@monorepo/front-core-lib/fl-core';
import { FlIconModule } from '@monorepo/front-core-lib/fl-svg-icon';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { LiDetailRoutePipe, LiRunningScenarioInfo } from '@monorepo/lab-lib/li-core';
import { LiRunningProcessComponent } from '@monorepo/lab-lib/li-process';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'li-running-scenario-table',
  templateUrl: './li-running-scenario-table.component.html',
  styleUrls: ['./li-running-scenario-table.component.scss'],
  imports: [
    MatTable,
    MatColumnDef,
    MatHeaderCellDef,
    MatHeaderCell,
    MatCellDef,
    MatCell,
    FlTextIconModule,
    MatIcon,
    FlIconModule,
    LiRunningProcessComponent,
    MatHeaderRowDef,
    MatHeaderRow,
    MatRowDef,
    MatRow,
    RouterLink,
    TranslatePipe,
    FlColorModule,
    LiDetailRoutePipe,
  ],
})
export class LiRunningScenarioTableComponent {
  @Input() datasource: FlDatasource<LiRunningScenarioInfo>;

  @Input() columns: string[];
}
