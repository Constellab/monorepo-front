import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { CaServerCloud } from '../../../../model/entities/server/ca-server-cloud.class';

@Component({
    selector: 'ca-select-server-cloud-dialog',
    templateUrl: './ca-select-server-cloud-dialog.component.html',
    styleUrl: './ca-select-server-cloud-dialog.component.scss',
    standalone: false
})
export class CaSelectServerCloudDialogComponent {
  constructor(private dialogRef: MatDialogRef<CaSelectServerCloudDialogComponent>) {}

  selectServerCloud(serverCloud: CaServerCloud): void {
    this.dialogRef.close(serverCloud);
  }
}
