import { Component, Input } from '@angular/core';
import { CaLabInstanceRunningStatus } from '../../../../ca-core/model/entities/lab/ca-lab-instance-status.dto';
import { FlDatasource, FlTableColumnStatic } from '@monorepo/front-core-lib';

@Component({
  selector: 'ca-lab-instance-running-status-table',
  templateUrl: './ca-lab-instance-running-status-table.component.html',
  styleUrls: ['./ca-lab-instance-running-status-table.component.scss'],
})
export class CaLabInstanceRunningStatusTableComponent {

  @Input({required: true}) datasource: FlDatasource<CaLabInstanceRunningStatus>;

  @Input() columns: FlTableColumnStatic<CaLabInstanceRunningStatus>[] =
    ['fromDate', 'toDate', 'duration', 'price', 'user'];
}
