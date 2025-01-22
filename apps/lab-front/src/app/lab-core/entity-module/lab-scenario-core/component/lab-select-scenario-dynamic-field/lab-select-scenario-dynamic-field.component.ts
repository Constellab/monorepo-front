import { Component } from '@angular/core';
import { FlDynamicFieldAbstractDirective } from '@monorepo/front-core-lib';
import { FlFormModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-form/fl-form.module';
import { LabSelectScenarioComponent } from '../lab-select-scenario/lab-select-scenario.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatError, MatHint } from '@angular/material/form-field';
import { FlCorePipeModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-core-pipe/fl-core-pipe.module';

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
