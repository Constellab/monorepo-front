import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'ca-lab-pull-biota-form-dialog',
  templateUrl: './ca-lab-pull-biota-form-dialog.component.html',
  styleUrls: ['./ca-lab-pull-biota-form-dialog.component.scss'],
})
export class CaLabPullBiotaFormDialogComponent {
  formGp = new FormBuilder().group({
    forceUpdate: [false],
  });

  constructor(private dialogRef: MatDialogRef<CaLabPullBiotaFormDialogComponent>) {}

  submit(): void {
    if (this.formGp.valid) {
      this.dialogRef.close(this.formGp.getRawValue());
    }
  }
}
