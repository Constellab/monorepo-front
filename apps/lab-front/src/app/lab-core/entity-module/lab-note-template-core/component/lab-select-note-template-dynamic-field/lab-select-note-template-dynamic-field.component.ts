import { Component } from '@angular/core';
import { FlDynamicFieldAbstractDirective } from '@monorepo/front-core-lib';

@Component({
  selector: 'lab-select-note-template-dynamic-field',
  templateUrl: './lab-select-note-template-dynamic-field.component.html',
  styleUrls: ['./lab-select-note-template-dynamic-field.component.scss'],
})
export class LabSelectNoteTemplateDynamicFieldComponent extends FlDynamicFieldAbstractDirective{}
