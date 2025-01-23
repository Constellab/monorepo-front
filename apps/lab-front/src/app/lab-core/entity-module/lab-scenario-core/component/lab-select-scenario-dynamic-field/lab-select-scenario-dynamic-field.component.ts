import { Component } from '@angular/core';
import { FlDynamicFieldAbstractDirective } from '@monorepo/front-core-lib/fl-dynamic-field';
import { FlFormModule } from '@monorepo/front-core-lib/fl-form';
import { LabSelectScenarioComponent } from '../lab-select-scenario/lab-select-scenario.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatError, MatHint } from '@angular/material/form-field';
import { FlCorePipeModule } from '@monorepo/front-core-lib/fl-core-pipe';

@Component({
  selector: 'lab-select-scenario-dynamic-field',
  templateUrl: './lab-select-scenario-dynamic-field.component.html',
  styleUrl: './lab-select-scenario-dynamic-field.component.scss',
  imports: [
    FlFormModule,
    LabSelectScenarioComponent,
    ReactiveFormsModule,
    MatError,
    MatHint,
    FlCorePipeModule,
  ],
})
export class LabSelectScenarioDynamicFieldComponent extends FlDynamicFieldAbstractDirective {}
