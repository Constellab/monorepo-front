import { Component } from '@angular/core';
import { FlDynamicFieldAbstractDirective } from '@monorepo/front-core-lib';

@Component({
  selector: 'lab-select-note-dynamic-field',
  templateUrl: './lab-select-note-dynamic-field.component.html',
  styleUrls: ['./lab-select-note-dynamic-field.component.scss'],
})
export class LabSelectNoteDynamicFieldComponent extends FlDynamicFieldAbstractDirective {}
