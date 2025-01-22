import { Component, OnInit, inject } from '@angular/core';
import { CaSpaceService } from '../../../../ca-core/service-api/ca-space.service';
import { FlSnackBarService } from '@monorepo/front-core-lib';
import { FormControl, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { CaSpaceRole } from '../../../../ca-core/model/entities/space/ca-space-user.class';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { FlDialogModule } from '../../../../../../../../libs/front-core-lib/src/lib/module/fl-dialog/fl-dialog.module';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { MatFormField, MatLabel, MatError } from '@angular/material/form-field';
import { MatSelect } from '@angular/material/select';
import { MatOption } from '@angular/material/core';
import { MatButton } from '@angular/material/button';
import { FlLoaderModule } from '../../../../../../../../libs/front-core-lib/src/lib/module/fl-loader/fl-loader.module';
import { FlCorePipeModule } from '../../../../../../../../libs/front-core-lib/src/lib/module/fl-core-pipe/fl-core-pipe.module';
import { TranslatePipe } from '@ngx-translate/core';

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
