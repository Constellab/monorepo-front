import {Component, Input} from '@angular/core';
import {LabReport} from '../../../../model/entities/lab-report.entity';

@Component({
  selector: 'lab-report-inline',
  templateUrl: './lab-report-inline.component.html',
  styleUrls: ['./lab-report-inline.component.scss'],
})
export class LabReportInlineComponent {

  @Input() report: LabReport;
}
