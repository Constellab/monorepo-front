import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FlDatasource, FlTableColumnStatic } from '@monorepo/front-core-lib';
import { LabReport } from '../../../../model/entities/lab-report.entity';
import { ClHelpService } from '@monorepo/core-lib';

@Component({
  selector: 'lab-report-table',
  templateUrl: './lab-report-table.component.html',
  styleUrls: ['./lab-report-table.component.scss']
})
export class LabReportTableComponent {

  @Input({required: true}) datasource: FlDatasource<LabReport>;

  @Input() columns: FlTableColumnStatic<LabReport>[] = ['title', 'tags', 'creation', 'lastModification'];

  // when true, the row become clickable and reportSelected event is trigger
  @Input() rowSelectable: boolean = false;

  @Input() rowLinkTarget: '_self' | '_blank' = '_self';

  @Output() reportSelected: EventEmitter<LabReport> = new EventEmitter();

  @Output() reportUnlink: EventEmitter<LabReport> = new EventEmitter();


  rowClicked(report: LabReport): void {
    if (this.rowSelectable) {
      this.reportSelected.next(report);
    }
  }

  unlinkReport(report: LabReport, event: MouseEvent): void {
    ClHelpService.stopEventPropagation(event);
    this.reportUnlink.next(report);
  }
}
