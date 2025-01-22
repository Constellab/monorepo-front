import { Component, OnInit, inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'lab-resource-detail-dialog',
  templateUrl: './lab-resource-detail-dialog.component.html',
  styleUrls: ['./lab-resource-detail-dialog.component.scss'],
  standalone: false,
})
export class LabResourceDetailDialogComponent implements OnInit {
  resourceId: string;

  constructor() {
    const resourceId = inject(MAT_DIALOG_DATA);

    this.resourceId = resourceId;
  }

  ngOnInit(): void {}
}
