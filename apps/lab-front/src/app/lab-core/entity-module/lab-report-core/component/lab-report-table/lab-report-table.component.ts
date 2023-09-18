import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FlDatasource, FlTableColumnStatic} from '@monorepo/front-core-lib';
import {LabReport} from '../../../../model/entities/lab-report.entity';
import {ClHelpService} from '@monorepo/core-lib';

@Component({
  selector: 'lab-report-table',
  templateUrl: './lab-report-table.component.html',
  styleUrls: ['./lab-report-table.component.scss']
})
export class LabReportTableComponent {

  @Input() datasource: FlDatasource<LabReport>;

  @Input() columns: FlTableColumnStatic<LabReport>[] = ['title', 'creation', 'lastModification'];

  // when true, the row become clickable and reportSelected event is trigger
  @Input() rowSelectable: boolean = false;

  @Output() reportSelected: EventEmitter<LabReport> = new EventEmitter();

  @Output() reportDisassociate: EventEmitter<LabReport> = new EventEmitter();


  rowClicked(report: LabReport): void {
    if (this.rowSelectable) {
      this.reportSelected.next(report);
    }
  }

  disassociateReport(report: LabReport, event: MouseEvent): void {
    ClHelpService.stopEventPropagation(event);
    this.reportDisassociate.next(report);
  }
}
