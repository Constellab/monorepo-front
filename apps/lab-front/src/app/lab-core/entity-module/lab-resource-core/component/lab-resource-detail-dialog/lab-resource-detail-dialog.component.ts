import { Component, OnInit, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogContent } from '@angular/material/dialog';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { LabResourceDetailComponent } from '../lab-resource-detail/lab-resource-detail.component';

@Component({
  selector: 'lab-resource-detail-dialog',
  templateUrl: './lab-resource-detail-dialog.component.html',
  styleUrls: ['./lab-resource-detail-dialog.component.scss'],
  imports: [CdkScrollable, MatDialogContent, LabResourceDetailComponent],
})
export class LabResourceDetailDialogComponent {
  resourceId: string;

  constructor() {
    const resourceId = inject(MAT_DIALOG_DATA);

    this.resourceId = resourceId;
  }
}
