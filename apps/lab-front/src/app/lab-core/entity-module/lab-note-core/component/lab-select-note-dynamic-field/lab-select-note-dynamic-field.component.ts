import { Component } from '@angular/core';
import { FlDynamicFieldAbstractDirective } from '@monorepo/front-core-lib/fl-dynamic-field';
import { FlFormModule } from '@monorepo/front-core-lib/fl-form';
import { LabSelectNoteComponent } from '../lab-select-note/lab-select-note.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatError, MatHint } from '@angular/material/form-field';
import { FlCorePipeModule } from '@monorepo/front-core-lib/fl-core-pipe';

@Component({
  selector: 'lab-select-note-dynamic-field',
  templateUrl: './lab-select-note-dynamic-field.component.html',
  styleUrls: ['./lab-select-note-dynamic-field.component.scss'],
  imports: [FlFormModule, LabSelectNoteComponent, ReactiveFormsModule, MatError, MatHint, FlCorePipeModule],
})
export class LabSelectNoteDynamicFieldComponent extends FlDynamicFieldAbstractDirective {}
