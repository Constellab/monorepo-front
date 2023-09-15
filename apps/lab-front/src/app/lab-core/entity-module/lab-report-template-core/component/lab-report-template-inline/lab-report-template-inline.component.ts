import {Component, Input} from '@angular/core';
import {LabReportTemplate} from '../../../../model/entities/lab-report-template.entity';

@Component({
  selector: 'lab-report-template-inline',
  templateUrl: './lab-report-template-inline.component.html',
  styleUrls: ['./lab-report-template-inline.component.scss'],
})
export class LabReportTemplateInlineComponent {
  @Input() reportTemplate: LabReportTemplate;

}
