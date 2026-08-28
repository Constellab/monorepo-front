import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FlCorePipeModule } from '@monorepo/front-core-lib/fl-core-pipe';
import { FlDialogModule } from '@monorepo/front-core-lib/fl-dialog';
import { FlFormModule } from '@monorepo/front-core-lib/fl-form';
import { FlLoaderModule } from '@monorepo/front-core-lib/fl-loader';
import { FlUserModule } from '@monorepo/front-core-lib/fl-user';
import { TranslatePipe } from '@ngx-translate/core';

import { CaUser } from '../../../../model/entities/ca-user.class';
import { CaFolderUser, CaRootFolderUserRole } from '../../../../model/entities/folder/ca-folder-user.class';
import { CaFolderService } from '../../../../service-api/ca-folder.service';

export interface CaFolderUserUpdateRoleDialogInput {
  folderId: string;
  user: CaUser;
  role: CaRootFolderUserRole;
}

@Component({
  selector: 'ca-folder-user-update-role-dialog',
  imports: [
    FlCorePipeModule,
    FlDialogModule,
    FlFormModule,
    FlLoaderModule,
    MatButton,
    TranslatePipe,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    FlUserModule,
  ],
  templateUrl: './ca-folder-user-update-role-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './ca-folder-user-update-role-dialog.component.scss',
})
export class CaFolderUserUpdateRoleDialogComponent {
  input: CaFolderUserUpdateRoleDialogInput = inject(MAT_DIALOG_DATA);

  formControl = new FormControl(this.input.role, { nonNullable: true, validators: Validators.required });

  private folderService = inject(CaFolderService);
  private dialogRef = inject(MatDialogRef);

  isLoading: boolean = false;

  roles = CaRootFolderUserRole;

  submit(): void {
    if (this.formControl.valid && !this.isLoading) {
      this.isLoading = true;
      this.folderService
        .updateFolderUserRole(this.input.folderId, this.input.user.id, this.formControl.value)
        .subscribe({
          next: (folderUser: CaFolderUser) => this.onUpdateSuccess(folderUser),
          error: () => (this.isLoading = false),
        });
    }
  }

  private onUpdateSuccess(folderUser: CaFolderUser): void {
    this.isLoading = false;
    this.dialogRef.close(folderUser);
  }
}
