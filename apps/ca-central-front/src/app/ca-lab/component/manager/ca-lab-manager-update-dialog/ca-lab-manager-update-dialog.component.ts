import { Component, OnInit, inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CaLabService } from '../../../../ca-core/service-api/ca-lab.service';

export interface CaLabManagerUpdateDialogInput {
  labId: string;
  labManagerCurrentVersion: string;
  labManagerRecommendedVersion: string;
}

/**
 * Simple dialog to choose the version of the lab manager to install.
 */
@Component({
  selector: 'ca-lab-manager-update-dialog',
  templateUrl: './ca-lab-manager-update-dialog.component.html',
  styleUrls: ['./ca-lab-manager-update-dialog.component.scss'],
  standalone: false,
})
export class CaLabManagerUpdateDialogComponent implements OnInit {
  private labService = inject(CaLabService);
  private dialogRef = inject<MatDialogRef<CaLabManagerUpdateDialogComponent>>(MatDialogRef);

  input: CaLabManagerUpdateDialogInput;

  formCtrl: FormControl;

  constructor() {
    const input = inject<CaLabManagerUpdateDialogInput>(MAT_DIALOG_DATA);

    this.input = input;
  }

  ngOnInit(): void {
    this.formCtrl = new FormControl(this.input.labManagerRecommendedVersion);
  }

  submit(): void {
    if (this.formCtrl.valid) {
      const obs = this.labService.updateLabManager(this.input.labId, this.formCtrl.value);

      this.dialogRef.close(obs);
    }
  }
}
