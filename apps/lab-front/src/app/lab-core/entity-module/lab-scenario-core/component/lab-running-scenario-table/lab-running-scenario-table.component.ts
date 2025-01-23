import { Component, Input, OnInit } from '@angular/core';
import { FlDatasource } from '@monorepo/front-core-lib/fl-core';
import { LabRunningScenarioInfo } from '../../../../model/entities/lab-scenario.entity';
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
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { MatIcon } from '@angular/material/icon';
import { FlIconModule } from '@monorepo/front-core-lib/fl-svg-icon';
import { LabRunningProcessComponent } from '../../../lab-process-core/component/lab-running-process/lab-running-process.component';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { FlColorModule } from '@monorepo/front-core-lib/fl-color';
import { LabDetailRoutePipe } from '../../../../lab-core-pipe/lab-detail-route/lab-detail-route.pipe';

@Component({
  selector: 'lab-running-scenario-table',
  templateUrl: './lab-running-scenario-table.component.html',
  styleUrls: ['./lab-running-scenario-table.component.scss'],
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
    LabRunningProcessComponent,
    MatHeaderRowDef,
    MatHeaderRow,
    MatRowDef,
    MatRow,
    RouterLink,
    TranslatePipe,
    FlColorModule,
    LabDetailRoutePipe,
  ],
})
export class LabRunningScenarioTableComponent implements OnInit {
  @Input() datasource: FlDatasource<LabRunningScenarioInfo>;

  @Input() columns: string[];

  constructor() {}

  ngOnInit(): void {}
}
