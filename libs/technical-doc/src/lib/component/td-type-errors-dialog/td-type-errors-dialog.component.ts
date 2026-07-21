import { ChangeDetectionStrategy,Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { TdTypingErrorDTO } from '../../model/td-type.class';

export interface TdTypeErrorsDialogData {
  typingName: string;
  errors: TdTypingErrorDTO[] | null;
}

@Component({
  selector: 'td-type-errors-dialog',
  templateUrl: './td-type-errors-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class TdTypeErrorsDialogComponent {
  data: TdTypeErrorsDialogData = inject(MAT_DIALOG_DATA);
}
