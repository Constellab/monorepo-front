import { CdkScrollable } from '@angular/cdk/scrolling';
import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatOption } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatSelect, MatSelectTrigger } from '@angular/material/select';
import { FlCorePipeModule } from '@monorepo/front-core-lib/fl-core-pipe';
import { FlDialogModule } from '@monorepo/front-core-lib/fl-dialog';
import { FlLoaderModule } from '@monorepo/front-core-lib/fl-loader';
import { FlSnackBarService } from '@monorepo/front-core-lib/fl-snack-bar';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import { CaSpaceRole } from '../../../../ca-core/model/entities/space/ca-space-user.class';
import { CaSpaceService } from '../../../../ca-core/service-api/ca-space.service';

export interface CaSpaceUserRoleDialogInput {
  currentRole: CaSpaceRole;
  updateRole: (role: CaSpaceRole) => Observable<any>;
}

/**
 * Dialog to update the role of a user in an space
 */
@Component({
  selector: 'ca-space-user-role-dialog',
  templateUrl: './ca-space-user-role-dialog.component.html',
  styleUrls: ['./ca-space-user-role-dialog.component.scss'],
  imports: [
    FlDialogModule,
    CdkScrollable,
    MatDialogContent,
    ReactiveFormsModule,
    FormsModule,
    MatFormField,
    MatLabel,
    MatSelect,
    MatSelectTrigger,
    MatOption,
    MatError,
    MatDialogActions,
    MatButton,
    FlLoaderModule,
    FlCorePipeModule,
    TranslatePipe,
  ],
})
export class CaSpaceUserRoleDialogComponent implements OnInit {
  private input = inject<CaSpaceUserRoleDialogInput>(MAT_DIALOG_DATA);
  private dialogRef = inject<MatDialogRef<CaSpaceUserRoleDialogComponent>>(MatDialogRef);
  private spaceService = inject(CaSpaceService);
  private snackBarService = inject(FlSnackBarService);

  formControl: FormControl;

  availableRoles = CaSpaceRole;

  isLoading: boolean = false;

  ngOnInit(): void {
    this.formControl = new FormControl<any>(this.input.currentRole, [Validators.required]);
  }

  submit(): void {
    if (this.formControl.valid && !this.isLoading) {
      this.updateRole(this.formControl.value);
    }
  }

  private updateRole(role: CaSpaceRole): void {
    this.isLoading = true;
    this.input.updateRole(role).subscribe({
      next: () => this.updateRoleSuccess(role),
      error: () => (this.isLoading = false),
    });
  }

  private updateRoleSuccess(role: CaSpaceRole): void {
    this.snackBarService.openSuccessMessage({ text: 'space_role_updated', translateText: true });
    this.dialogRef.close(role);
  }
}
