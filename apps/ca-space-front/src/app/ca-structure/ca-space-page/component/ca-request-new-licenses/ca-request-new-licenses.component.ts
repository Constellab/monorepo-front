import { ChangeDetectionStrategy,Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatDialogActions, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { FlCorePipeModule } from '@monorepo/front-core-lib/fl-core-pipe';
import { FlDialogModule } from '@monorepo/front-core-lib/fl-dialog';
import { FlLoaderModule } from '@monorepo/front-core-lib/fl-loader';
import { FlSnackBarService } from '@monorepo/front-core-lib/fl-snack-bar';
import { TranslatePipe } from '@ngx-translate/core';

import { CaRequestNewLicensesDto } from '../../../../ca-core/model/entities/space/ca-space.dto';
import { CaSpaceService } from '../../../../ca-core/service-api/ca-space.service';

@Component({
  selector: 'ca-request-new-licenses',
  templateUrl: './ca-request-new-licenses.component.html',
  styleUrls: ['./ca-request-new-licenses.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    FlDialogModule,
    MatDialogContent,
    ReactiveFormsModule,
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
export class CaRequestNewLicensesComponent {
  private dialogRef = inject<MatDialogRef<CaRequestNewLicensesComponent>>(MatDialogRef);
  private spaceService = inject(CaSpaceService);
  private snackBarService = inject(FlSnackBarService);

  isLoading: boolean = false;

  formGroup = new FormBuilder().group({
    nbLicenses: [0, Validators.required],
    text: '',
  });

  submit(): void {
    if (!this.isLoading && this.formGroup.valid) {
      this.sendRequest(this.formGroup.getRawValue());
    }
  }

  private sendRequest(request: CaRequestNewLicensesDto): void {
    this.isLoading = true;
    this.spaceService.requestNewLicenses(request).subscribe({
      next: () => this.onSuccess(),
      error: () => (this.isLoading = false),
    });
  }

  private onSuccess(): void {
    this.snackBarService.openSuccessMessage({ text: 'new_licenses_requested', translateText: true });
    this.isLoading = false;
    this.dialogRef.close();
  }
}
