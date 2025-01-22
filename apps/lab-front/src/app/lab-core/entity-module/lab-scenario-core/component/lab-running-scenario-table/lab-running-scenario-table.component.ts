import { Component, Input, OnInit } from '@angular/core';
import { FlDatasource } from '@monorepo/front-core-lib';
import { LabRunningScenarioInfo } from '../../../../model/entities/lab-scenario.entity';
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
import { FlTextIconModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-text-icon/fl-text-icon.module';
import { MatIcon } from '@angular/material/icon';
import { FlIconModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-svg-icon/fl-icon.module';
import { LabRunningProcessComponent } from '../../../lab-process-core/component/lab-running-process/lab-running-process.component';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { FlColorModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-color/fl-color.module';
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
