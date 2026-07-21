import { ChangeDetectionStrategy,Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatError, MatHint } from '@angular/material/form-field';
import { FlCorePipeModule } from '@monorepo/front-core-lib/fl-core-pipe';
import { FlDynamicFieldAbstractDirective } from '@monorepo/front-core-lib/fl-dynamic-field';
import { FlFormModule } from '@monorepo/front-core-lib/fl-form';

import { LiSelectNoteTemplateComponent } from '../li-select-note-template/li-select-note-template.component';

@Component({
  selector: 'li-select-note-template-dynamic-field',
  templateUrl: './li-select-note-template-dynamic-field.component.html',
  styleUrls: ['./li-select-note-template-dynamic-field.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    FlFormModule,
    LiSelectNoteTemplateComponent,
    ReactiveFormsModule,
    MatError,
    MatHint,
    FlCorePipeModule,
  ],
})
export class LiSelectNoteTemplateDynamicFieldComponent extends FlDynamicFieldAbstractDirective {}
