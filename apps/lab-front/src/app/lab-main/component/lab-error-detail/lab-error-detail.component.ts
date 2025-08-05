import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LiApiError } from '@monorepo/lab-lib/li-core';
import { TranslatePipe } from '@ngx-translate/core';

/**
 * Component showed when the detail button is clicked on a error message
 */
@Component({
  selector: 'lab-error-detail',
  templateUrl: './lab-error-detail.component.html',
  styleUrls: ['./lab-error-detail.component.scss'],
  imports: [TranslatePipe],
})
export class LabErrorDetailComponent {
  error: LiApiError = inject<LiApiError>(MAT_DIALOG_DATA);
}
