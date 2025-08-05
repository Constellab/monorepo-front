import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { FlCorePipeModule } from '@monorepo/front-core-lib/fl-core-pipe';
import { FlDialogModule } from '@monorepo/front-core-lib/fl-dialog';
import { FlKeyValueModule } from '@monorepo/front-core-lib/fl-key-value';
import { TranslatePipe } from '@ngx-translate/core';

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
  imports: [
    FlDialogModule,
    MatDialogContent,
    ReactiveFormsModule,
    FormsModule,
    FlKeyValueModule,
    MatFormField,
    MatLabel,
    MatInput,
    MatError,
    MatDialogActions,
    MatButton,
    FlCorePipeModule,
    TranslatePipe,
  ],
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
