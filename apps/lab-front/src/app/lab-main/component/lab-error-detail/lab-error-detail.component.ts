import { Component, OnInit, inject } from '@angular/core';
import { LabApiError } from '../../../lab-core/model/global/lab-api-error.class';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

/**
 * Component showed when the detail button is clicked on a error message
 */
@Component({
  selector: 'lab-error-detail',
  templateUrl: './lab-error-detail.component.html',
  styleUrls: ['./lab-error-detail.component.scss'],
  standalone: false,
})
export class LabErrorDetailComponent implements OnInit {
  error: LabApiError;

  constructor() {
    const error = inject<LabApiError>(MAT_DIALOG_DATA);

    this.error = error;
  }

  ngOnInit(): void {}
}
