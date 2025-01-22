import { Component } from '@angular/core';
import { FlDynamicFieldAbstractDirective } from '@monorepo/front-core-lib';
import { FlFormModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-form/fl-form.module';
import { LabSelectNoteTemplateComponent } from '../lab-select-note-template/lab-select-note-template.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatError, MatHint } from '@angular/material/form-field';
import { FlCorePipeModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-core-pipe/fl-core-pipe.module';

@Component({
  selector: 'lab-select-note-template-dynamic-field',
  templateUrl: './lab-select-note-template-dynamic-field.component.html',
  styleUrls: ['./lab-select-note-template-dynamic-field.component.scss'],
  imports: [
    FlFormModule,
    LabSelectNoteTemplateComponent,
    ReactiveFormsModule,
    MatError,
    MatHint,
    FlCorePipeModule,
  ],
})
export class LabSelectNoteTemplateDynamicFieldComponent extends FlDynamicFieldAbstractDirective {}
