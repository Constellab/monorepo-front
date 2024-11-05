import { Component, Input } from '@angular/core';
import { CaLabRunningStatus } from '../../../../ca-core/model/entities/lab/ca-lab-stats.dto';
import { FlDatasource, FlTableColumnStatic } from '@monorepo/front-core-lib';

@Component({
  selector: 'ca-lab-running-status-table',
  templateUrl: './ca-lab-running-status-table.component.html',
  styleUrls: ['./ca-lab-running-status-table.component.scss'],
})
export class CaLabRunningStatusTableComponent {
  @Input({ required: true }) datasource: FlDatasource<CaLabRunningStatus>;

  @Input() columns: FlTableColumnStatic<CaLabRunningStatus>[] = [
    'fromDate',
    'toDate',
    'duration',
    'price',
    'user',
  ];
}
