import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { FlCorePipeModule } from '@monorepo/front-core-lib/fl-core-pipe';
import { FlDialogModule } from '@monorepo/front-core-lib/fl-dialog';
import { FlLoaderModule } from '@monorepo/front-core-lib/fl-loader';
import { FlSnackBarService } from '@monorepo/front-core-lib/fl-snack-bar';
import { LiLab } from '@monorepo/lab-lib/li-core';
import { TranslatePipe } from '@ngx-translate/core';

import { LiLabService } from '../../service/li-lab.service';

@Component({
  selector: 'li-lab-update-domain-dialog',
  templateUrl: './li-lab-update-domain-dialog.component.html',
  styleUrls: ['./li-lab-update-domain-dialog.component.scss'],
  imports: [
    FlDialogModule,
    MatDialogContent,
    ReactiveFormsModule,
    FormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    MatError,
    MatDialogActions,
    MatButton,
    FlLoaderModule,
    FlCorePipeModule,
    TranslatePipe,
  ],
})
export class LiLabUpdateDomainDialogComponent implements OnInit {
  private lab = inject<LiLab>(MAT_DIALOG_DATA);
  private dialogRef = inject<MatDialogRef<LiLabUpdateDomainDialogComponent>>(MatDialogRef);
  private labService = inject(LiLabService);
  private snackBarService = inject(FlSnackBarService);

  formCtrl: FormControl<string>;

  isLoading: boolean = false;

  ngOnInit(): void {
    this.formCtrl = new FormControl<string>(this.lab.domain, [Validators.required]);
  }

  submit(): void {
    if (!this.isLoading && this.formCtrl.valid) {
      this.updateDomain(this.formCtrl.value);
    }
  }

  private updateDomain(domain: string): void {
    this.isLoading = true;
    this.labService.updateDomain(this.lab.id, domain).subscribe(
      (lab) => this.updateDomainSuccess(lab),
      () => (this.isLoading = false)
    );
  }

  private updateDomainSuccess(lab: LiLab): void {
    this.snackBarService.openSuccessMessage({ text: 'li.lab_domain_updated', translateText: true });
    this.dialogRef.close(lab);
    this.isLoading = false;
  }
}
