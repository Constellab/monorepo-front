import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatError, MatHint } from '@angular/material/form-field';
import { FlCorePipeModule } from '@monorepo/front-core-lib/fl-core-pipe';
import { FlDynamicFieldAbstractDirective } from '@monorepo/front-core-lib/fl-dynamic-field';
import { FlFormModule } from '@monorepo/front-core-lib/fl-form';

import { LiSelectScenarioComponent } from '../li-select-scenario/li-select-scenario.component';

@Component({
  selector: 'li-select-scenario-dynamic-field',
  templateUrl: './li-select-scenario-dynamic-field.component.html',
  styleUrl: './li-select-scenario-dynamic-field.component.scss',
  imports: [
    FlFormModule,
    LiSelectScenarioComponent,
    ReactiveFormsModule,
    MatError,
    MatHint,
    FlCorePipeModule,
  ],
})
export class LiSelectScenarioDynamicFieldComponent extends FlDynamicFieldAbstractDirective {}
