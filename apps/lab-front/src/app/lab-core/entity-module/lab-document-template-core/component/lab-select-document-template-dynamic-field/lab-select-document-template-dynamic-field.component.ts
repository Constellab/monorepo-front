import { Component } from '@angular/core';
import { FlDynamicFieldAbstractDirective } from '@monorepo/front-core-lib';

@Component({
  selector: 'lab-select-document-template-dynamic-field',
  templateUrl: './lab-select-document-template-dynamic-field.component.html',
  styleUrls: ['./lab-select-document-template-dynamic-field.component.scss'],
})
export class LabSelectDocumentTemplateDynamicFieldComponent extends FlDynamicFieldAbstractDirective{}
