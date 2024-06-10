import {Component, Input, OnInit} from '@angular/core';
import {FlTableColumnStatic} from '@monorepo/front-core-lib';
import {
  CaLabInstanceStatusHistory,
  CaLabInstanceStatusHistoryDatasource
} from '../../../model/entities/lab/ca-lab-instance.class';

@Component({
  selector: 'ca-status-history-table',
  templateUrl: './ca-status-history-table.component.html',
  styleUrls: ['./ca-status-history-table.component.scss']
})
export class CaStatusHistoryTableComponent implements OnInit {

  @Input() datasource: CaLabInstanceStatusHistoryDatasource;

  @Input() columns: FlTableColumnStatic<CaLabInstanceStatusHistory>[] = ['createdAt', 'endDate', 'status', 'createdBy'];

  constructor() {
  }

  ngOnInit(): void {
  }
}
