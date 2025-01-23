import { Component, OnInit, inject } from '@angular/core';
import { LabApiError } from '../../../lab-core/model/global/lab-api-error.class';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
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
  error: LabApiError;

  constructor() {
    const error = inject<LabApiError>(MAT_DIALOG_DATA);

    this.error = error;
  }
}
