import { Component, inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'lml-pull-biota-form-dialog',
  templateUrl: './lml-pull-biota-form-dialog.component.html',
  styleUrls: ['./lml-pull-biota-form-dialog.component.scss'],
  standalone: false,
})
export class LmlPullBiotaFormDialogComponent {
  formGp = new FormBuilder().group({
    forceUpdate: [false],
  });

  private dialogRef = inject(MatDialogRef);

  submit(): void {
    if (this.formGp.valid) {
      this.dialogRef.close(this.formGp.getRawValue());
    }
  }
}
