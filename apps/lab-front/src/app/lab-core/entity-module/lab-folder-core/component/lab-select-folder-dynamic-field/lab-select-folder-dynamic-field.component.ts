import { Component } from '@angular/core';
import { FlCorePipeModule } from '@monorepo/front-core-lib/fl-core-pipe';
import { FlFormModule } from '@monorepo/front-core-lib/fl-form';
import { MatError, MatHint } from '@angular/material/form-field';
import { LabFolderInlineSelectComponent } from '../lab-folder-inline-select/lab-folder-inline-select.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FlDynamicFieldAbstractDirective } from '@monorepo/front-core-lib/fl-dynamic-field';

@Component({
  selector: 'lab-select-folder-dynamic-field',
  imports: [
    FlCorePipeModule,
    FlFormModule,
    ReactiveFormsModule,
    MatError,
    MatHint,
    LabFolderInlineSelectComponent,
  ],
  templateUrl: './lab-select-folder-dynamic-field.component.html',
  styleUrl: './lab-select-folder-dynamic-field.component.scss',
})
export class LabSelectFolderDynamicFieldComponent extends FlDynamicFieldAbstractDirective {}
