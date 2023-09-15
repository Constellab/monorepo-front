import {Component} from '@angular/core';
import {FlDynamicFieldAbstractDirective} from '@monorepo/front-core-lib';

@Component({
  selector: 'lab-select-report-template-dynamic-field',
  templateUrl: './lab-select-report-template-dynamic-field.component.html',
  styleUrls: ['./lab-select-report-template-dynamic-field.component.scss'],
})
export class LabSelectReportTemplateDynamicFieldComponent extends FlDynamicFieldAbstractDirective{}
