import {Component, EventEmitter, Input, Output} from '@angular/core';
import {LabReportTemplate, LabReportTemplateDatasource} from '../../../../model/entities/lab-report-template.entity';
import {FlTableColumnStatic} from '@monorepo/front-core-lib';

@Component({
  selector: 'lab-report-template-table',
  templateUrl: './lab-report-template-table.component.html',
  styleUrls: ['./lab-report-template-table.component.scss'],
})
export class LabReportTemplateTableComponent {

  // when true, the row become clickable and resourceSelected event is trigger
  @Input() rowSelectable: boolean = false;

  @Input() datasource: LabReportTemplateDatasource;

  @Input() columns: FlTableColumnStatic<LabReportTemplate>[] = ['title', 'creation', 'lastModification'];

  @Output() reportTemplateSelected: EventEmitter<LabReportTemplate> = new EventEmitter();


  rowClicked(reportTemplate: LabReportTemplate): void {
    if (this.rowSelectable) {
      this.reportTemplateSelected.next(reportTemplate);
    }
  }
}
