import { ChangeDetectionStrategy,Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatError, MatHint } from '@angular/material/form-field';
import { FlCorePipeModule } from '@monorepo/front-core-lib/fl-core-pipe';
import { FlDynamicFieldAbstractDirective } from '@monorepo/front-core-lib/fl-dynamic-field';
import { FlFormModule } from '@monorepo/front-core-lib/fl-form';

import { LiFolderInlineSelectComponent } from '../li-folder-inline-select/li-folder-inline-select.component';

@Component({
  selector: 'li-select-folder-dynamic-field',
  imports: [
    FlCorePipeModule,
    FlFormModule,
    ReactiveFormsModule,
    MatError,
    MatHint,
    LiFolderInlineSelectComponent,
  ],
  templateUrl: './li-select-folder-dynamic-field.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './li-select-folder-dynamic-field.component.scss',
})
export class LiSelectFolderDynamicFieldComponent extends FlDynamicFieldAbstractDirective {}
