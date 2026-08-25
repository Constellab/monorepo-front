import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatOption } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FlCorePipeModule } from '@monorepo/front-core-lib/fl-core-pipe';
import { FlDialogModule } from '@monorepo/front-core-lib/fl-dialog';
import { FlFormModule } from '@monorepo/front-core-lib/fl-form';
import { FlLoaderModule } from '@monorepo/front-core-lib/fl-loader';
import { FlSnackBarService } from '@monorepo/front-core-lib/fl-snack-bar';
import { TranslatePipe } from '@ngx-translate/core';

import { CaGroup } from '../../../../model/entities/ca-group.entity';
import { CaFolderUser, CaRootFolderUserRole } from '../../../../model/entities/folder/ca-folder-user.class';
import { CaFolderService } from '../../../../service-api/ca-folder.service';
import { CaSelectGroupComponent } from '../../../ca-group-core/component/ca-select-group/ca-select-group.component';

export interface CaFolderShareDialogInput {
  rootFolderId: string;
}

/**
 * Dialog to share a folder to a group
 */
@Component({
  selector: 'ca-folder-share-dialog',
  templateUrl: './ca-folder-share-dialog.component.html',
  styleUrls: ['./ca-folder-share-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    FlDialogModule,
    MatDialogContent,
    ReactiveFormsModule,
    FormsModule,
    FlFormModule,
    CaSelectGroupComponent,
    MatError,
    MatDialogActions,
    MatButton,
    FlLoaderModule,
    FlCorePipeModule,
    TranslatePipe,
    MatFormField,
    MatLabel,
    MatOption,
    MatSelectModule,
  ],
})
export class CaFolderShareDialogComponent {
  private input = inject<CaFolderShareDialogInput>(MAT_DIALOG_DATA);
  private dialogRef = inject(MatDialogRef);
  private snackBarService = inject(FlSnackBarService);
  private folderService = inject(CaFolderService);

  formGp = new FormBuilder().group({
    group: [null as CaGroup | null, Validators.required],
    role: new FormControl(CaRootFolderUserRole.USER, {
      nonNullable: true,
      validators: Validators.required,
    }),
  });

  roles = CaRootFolderUserRole;

  isLoading: boolean = false;

  submit(): void {
    if (this.formGp.valid && !this.isLoading) {
      this.shareObject();
    }
  }

  private shareObject(): void {
    const value = this.formGp.getRawValue();
    if (value.group == null) {
      return;
    }
    this.isLoading = true;
    this.folderService.shareFolder(this.input.rootFolderId, value.group.id, value.role).subscribe({
      next: (result) => this.shareObjectSuccess(result),
      error: () => (this.isLoading = false),
    });
  }

  private shareObjectSuccess(result: CaFolderUser[]): void {
    this.snackBarService.openSuccessMessage({ text: 'folder_shared', translateText: true });
    this.isLoading = false;
    this.dialogRef.close(result);
  }
}
