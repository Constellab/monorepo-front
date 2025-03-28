import { ClApiError } from '@monorepo/core-lib';
import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FlTranslateModule } from '@monorepo/front-core-lib/fl-translate';

/**
 * Component showed when the detail button is clicked on an error message
 */
@Component({
  selector: 'li-error-detail',
  templateUrl: './li-error-detail.component.html',
  styleUrls: ['./li-error-detail.component.scss'],
  imports: [FlTranslateModule]
})
export class LiErrorDetailComponent {
  error: ClApiError = inject(MAT_DIALOG_DATA);
}
