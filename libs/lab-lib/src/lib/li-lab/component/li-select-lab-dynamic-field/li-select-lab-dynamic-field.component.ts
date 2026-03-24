import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatError, MatHint } from '@angular/material/form-field';
import { FlCorePipeModule } from '@monorepo/front-core-lib/fl-core-pipe';
import { FlDynamicFieldAbstractDirective } from '@monorepo/front-core-lib/fl-dynamic-field';
import { FlFormModule } from '@monorepo/front-core-lib/fl-form';

import { LiSelectLabComponent } from '../li-select-lab/li-select-lab.component';

@Component({
  selector: 'li-select-lab-dynamic-field',
  templateUrl: './li-select-lab-dynamic-field.component.html',
  styleUrls: ['./li-select-lab-dynamic-field.component.scss'],
  imports: [FlFormModule, LiSelectLabComponent, ReactiveFormsModule, MatError, MatHint, FlCorePipeModule],
})
export class LiSelectLabDynamicFieldComponent extends FlDynamicFieldAbstractDirective {}
