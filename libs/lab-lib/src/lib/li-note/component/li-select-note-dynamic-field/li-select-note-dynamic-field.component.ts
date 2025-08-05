import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatError, MatHint } from '@angular/material/form-field';
import { FlCorePipeModule } from '@monorepo/front-core-lib/fl-core-pipe';
import { FlDynamicFieldAbstractDirective } from '@monorepo/front-core-lib/fl-dynamic-field';
import { FlFormModule } from '@monorepo/front-core-lib/fl-form';

import { LiSelectNoteComponent } from '../li-select-note/li-select-note.component';

@Component({
  selector: 'li-select-note-dynamic-field',
  templateUrl: './li-select-note-dynamic-field.component.html',
  styleUrls: ['./li-select-note-dynamic-field.component.scss'],
  imports: [FlFormModule, LiSelectNoteComponent, ReactiveFormsModule, MatError, MatHint, FlCorePipeModule],
})
export class LiSelectNoteDynamicFieldComponent extends FlDynamicFieldAbstractDirective {}
