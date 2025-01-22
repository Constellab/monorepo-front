import { Component, OnInit, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { CaLabService } from '../../../../ca-core/service-api/ca-lab.service';
import { FlDialogModule } from '../../../../../../../../libs/front-core-lib/src/lib/module/fl-dialog/fl-dialog.module';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { FlKeyValueModule } from '../../../../../../../../libs/front-core-lib/src/lib/module/fl-key-value/fl-key-value.module';
import { MatFormField, MatLabel, MatError } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { FlCorePipeModule } from '../../../../../../../../libs/front-core-lib/src/lib/module/fl-core-pipe/fl-core-pipe.module';
import { TranslatePipe } from '@ngx-translate/core';

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
    CdkScrollable,
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
