import { Component, inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FlDialogModule } from '@monorepo/front-core-lib';
import { LmsConfigureLabManagerComponent } from '../lms-configure-lab-manager/lms-configure-lab-manager.component';

@Component({
  selector: 'lms-configure-lab-manager-dialog',
  standalone: true,
  imports: [FlDialogModule, LmsConfigureLabManagerComponent],
  templateUrl: './lms-configure-lab-manager-dialog.component.html',
  styleUrl: './lms-configure-lab-manager-dialog.component.scss',
})
export class LmsConfigureLabManagerDialogComponent {
  private dialogRef = inject(MatDialogRef);

  close(): void {
    this.dialogRef.close();
  }
}
