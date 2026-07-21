import { ChangeDetectionStrategy,Component, inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'lml-clean-lab-manager-form-dialog',
  templateUrl: './lml-clean-lab-manager-form-dialog.component.html',
  styleUrls: ['./lml-clean-lab-manager-form-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class LmlCleanLabManagerFormDialogComponent {
  formGp = new FormBuilder().group({
    removeErrorSubComposes: [true],
    pruneSystem: [false],
  });

  private dialogRef = inject(MatDialogRef);

  submit(): void {
    if (this.formGp.valid) {
      this.dialogRef.close(this.formGp.getRawValue());
    }
  }
}
