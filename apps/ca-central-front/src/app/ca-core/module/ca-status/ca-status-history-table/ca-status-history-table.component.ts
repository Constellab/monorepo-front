import { Component, Input } from '@angular/core';
import { FlTableColumnStatic } from '@monorepo/front-core-lib';
import { CaLabStatusHistory, CaLabStatusHistoryDatasource } from '../../../model/entities/lab/ca-lab.class';

@Component({
    selector: 'ca-status-history-table',
    templateUrl: './ca-status-history-table.component.html',
    styleUrls: ['./ca-status-history-table.component.scss'],
    standalone: false
})
export class CaStatusHistoryTableComponent {
  @Input({ required: true }) datasource: CaLabStatusHistoryDatasource<any>;

  @Input() columns: FlTableColumnStatic<CaLabStatusHistory>[] = [
    'createdAt',
    'endDate',
    'status',
    'createdBy',
  ];
}
