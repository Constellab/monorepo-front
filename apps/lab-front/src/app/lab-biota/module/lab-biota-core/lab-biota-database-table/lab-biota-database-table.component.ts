import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FlDatasourcePaginated } from '@monorepo/front-core-lib';
import { LabBiotaData } from '../../../model/lab-biota-data.class';

@Component({
  selector: 'lab-biota-database-table',
  templateUrl: './lab-biota-database-table.component.html',
  styleUrls: ['./lab-biota-database-table.component.scss'],
})
export class LabBiotaDatabaseTableComponent {
  @Input() datasource: FlDatasourcePaginated<LabBiotaData>;

  @Input() columns: string[] = ['id', 'name'];

  @Output() showDetail: EventEmitter<LabBiotaData> = new EventEmitter();

  onShowDetail(data: LabBiotaData): void {
    this.showDetail.emit(data);
  }
}
