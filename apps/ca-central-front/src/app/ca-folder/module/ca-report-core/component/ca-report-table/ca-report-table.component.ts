import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FlDatasource, FlTableColumnStatic } from '@monorepo/front-core-lib';
import { CaReport } from '../../../../../ca-core/model/entities/folder/ca-report.class';

@Component({
  selector: 'ca-report-table',
  templateUrl: './ca-report-table.component.html',
  styleUrls: ['./ca-report-table.component.scss']
})
export class CaReportTableComponent {

  @Input({ required: true }) datasource: FlDatasource<CaReport>;

  @Input() columns: FlTableColumnStatic<CaReport>[] = ['title', 'createdBy', 'lastSync'];

  // when true, the row become clickable and resourceSelected event is trigger
  @Input() rowSelectable: boolean = false;

  @Output() reportSelected: EventEmitter<CaReport> = new EventEmitter();

  rowClicked(report: CaReport): void {
    if (this.rowSelectable) {
      this.reportSelected.next(report);
    }
  }

}
