import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, UntypedFormGroup, ValidatorFn, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatDatepicker, MatDatepickerInput, MatDatepickerToggle } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent } from '@angular/material/dialog';
import { MatError, MatFormField, MatLabel, MatSuffix } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatSelect, MatSelectTrigger } from '@angular/material/select';
import { FlFormMode } from '@monorepo/front-core-lib/fl-core';
import { FlCoreDirectiveModule } from '@monorepo/front-core-lib/fl-core-directive';
import { FlCorePipeModule } from '@monorepo/front-core-lib/fl-core-pipe';
import { FlDialogModule, FlFormDialogAbstractDirective } from '@monorepo/front-core-lib/fl-dialog';
import { FlLoaderModule } from '@monorepo/front-core-lib/fl-loader';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import { CaFolder, CnSaveFolderDTO } from '../../../../model/entities/folder/ca-folder.class';
import { CaFolderService } from '../../../../service-api/ca-folder.service';
import { CaSpaceService } from '../../../../service-api/ca-space.service';
import { CaBucketLocationInlineComponent } from '../../../ca-object-storage-core/component/ca-bucket-location-inline/ca-bucket-location-inline.component';
import { CaBucketLocationSelectOptionsComponent } from '../../../ca-object-storage-core/component/ca-bucket-location-select-options/ca-bucket-location-select-options.component';

export interface CaFolderFormDialogInput {
  mode: FlFormMode;
  folderId?: string; // only on update mode
  parentId?: string; // only on create mode
}

/**
 * Dialog to create or update a folder
 */
@Component({
  selector: 'ca-folder-form-dialog',
  templateUrl: './ca-folder-form-dialog.component.html',
  styleUrls: ['./ca-folder-form-dialog.component.scss'],
  imports: [
    FlDialogModule,
    MatDialogContent,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    FlCoreDirectiveModule,
    MatError,
    MatDatepickerInput,
    MatDatepickerToggle,
    MatSuffix,
    MatDatepicker,
    MatSelect,
    MatSelectTrigger,
    CaBucketLocationInlineComponent,
    CaBucketLocationSelectOptionsComponent,
    MatDialogActions,
    MatButton,
    FlLoaderModule,
    FlCorePipeModule,
    TranslatePipe,
  ],
})
export class CaFolderFormDialogComponent
  extends FlFormDialogAbstractDirective<CnSaveFolderDTO, CaFolder>
  implements OnInit
{
  private folderService = inject(CaFolderService);
  private spaceService = inject(CaSpaceService);

  dialogInput: CaFolderFormDialogInput = inject(MAT_DIALOG_DATA);

  constructor() {
    super();
  }

  get title(): string {
    return this.isCreateMode() ? 'new_folder' : 'update_folder';
  }

  get showStorage(): boolean {
    return !this.dialogInput.parentId && this.isCreateMode();
  }

  async ngOnInit(): Promise<void> {
    this.init();

    if (this.showStorage) {
      this.spaceService.getCurrentSpaceSettings().subscribe((spaceSettings) => {
        this.formGp.get('mainStorage').setValue(spaceSettings.defaultFolderStorageLocation);
        this.formGp.get('backupStorage').setValue(spaceSettings.defaultFolderBackupStorageLocation);
      });
    }

    this.formGp.disable();
    if (this.isUpdateMode()) {
      this.folderService.getById(this.dialogInput.folderId).subscribe((folder) => {
        this.formGp.patchValue(folder);
        this.formGp.enable();
      });
    } else if (this.isCreateMode() && this.dialogInput.parentId) {
      // in create child mode, we copy the date from the parent folder
      this.folderService.getById(this.dialogInput.parentId).subscribe((parentFolder) => {
        this.formGp.get('startingDate').setValue(parentFolder.startingDate);
        this.formGp.get('endingDate').setValue(parentFolder.endingDate);
        this.formGp.enable();
      });
    } else {
      this.formGp.enable();
    }
  }

  buildForm(): UntypedFormGroup {
    return new FormBuilder().group(
      {
        name: [null, Validators.required],
        code: [null],
        startingDate: [null],
        endingDate: [null],
        mainStorage: [null, this.showStorage ? Validators.required : null],
        backupStorage: [null],
      },
      { validators: this.showStorage ? this.differentStorageValidator() : null }
    );
  }

  create(formValue: CnSaveFolderDTO): Observable<CaFolder> {
    if (this.dialogInput.parentId) {
      return this.folderService.createSubFolder(formValue, this.dialogInput.parentId);
    } else {
      return this.folderService.createFolder(formValue);
    }
  }

  update(formValue: CnSaveFolderDTO): Observable<CaFolder> {
    return this.folderService.update(this.dialogInput.folderId, formValue);
  }

  getCreateSuccessMessage(): string {
    return 'folder_created';
  }

  getUpdateSuccessMessage(): string {
    return 'folder_updated';
  }

  private differentStorageValidator(): ValidatorFn {
    return (control: UntypedFormGroup): { [key: string]: any } => {
      const value: CnSaveFolderDTO = control.value;
      if (value.mainStorage == null || value.backupStorage == null) return null;

      if (value.mainStorage.bucketId === value.backupStorage.bucketId) {
        return { sameBackupStorage: true };
      }
      return null;
    };
  }
}
