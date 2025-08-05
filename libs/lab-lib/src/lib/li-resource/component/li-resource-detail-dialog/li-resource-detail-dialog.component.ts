import { CdkScrollable } from '@angular/cdk/scrolling';
import { Component, inject,OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogContent } from '@angular/material/dialog';

import { LiResourceDetailComponent } from '../li-resource-detail/li-resource-detail.component';

@Component({
  selector: 'li-resource-detail-dialog',
  templateUrl: './li-resource-detail-dialog.component.html',
  styleUrls: ['./li-resource-detail-dialog.component.scss'],
  imports: [CdkScrollable, MatDialogContent, LiResourceDetailComponent],
})
export class LiResourceDetailDialogComponent {
  resourceId: string;

  constructor() {
    const resourceId = inject(MAT_DIALOG_DATA);

    this.resourceId = resourceId;
  }
}
