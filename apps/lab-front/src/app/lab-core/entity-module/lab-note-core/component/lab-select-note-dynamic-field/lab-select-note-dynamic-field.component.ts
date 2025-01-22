import { Component } from '@angular/core';
import { FlDynamicFieldAbstractDirective } from '@monorepo/front-core-lib';
import { FlFormModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-form/fl-form.module';
import { LabSelectNoteComponent } from '../lab-select-note/lab-select-note.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatError, MatHint } from '@angular/material/form-field';
import { FlCorePipeModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-core-pipe/fl-core-pipe.module';

@Component({
  selector: 'lab-select-note-dynamic-field',
  templateUrl: './lab-select-note-dynamic-field.component.html',
  styleUrls: ['./lab-select-note-dynamic-field.component.scss'],
  imports: [FlFormModule, LabSelectNoteComponent, ReactiveFormsModule, MatError, MatHint, FlCorePipeModule],
})
export class LabSelectNoteDynamicFieldComponent extends FlDynamicFieldAbstractDirective {}
