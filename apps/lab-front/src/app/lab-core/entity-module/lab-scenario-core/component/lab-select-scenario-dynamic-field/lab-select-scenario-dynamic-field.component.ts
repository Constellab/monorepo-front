import { Component } from '@angular/core';
import { FlDynamicFieldAbstractDirective } from '@monorepo/front-core-lib';

@Component({
  selector: 'lab-select-scenario-dynamic-field',
  templateUrl: './lab-select-scenario-dynamic-field.component.html',
  styleUrl: './lab-select-scenario-dynamic-field.component.scss',
})
export class LabSelectScenarioDynamicFieldComponent extends FlDynamicFieldAbstractDirective {}
