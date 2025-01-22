import { Component, inject, OnInit } from '@angular/core';
import { FlFormDialogAbstractDirective, FlFormDialogInput } from '@monorepo/front-core-lib';
import { CaFolderService } from '../../../../../ca-core/service-api/ca-folder.service';
import { Observable } from 'rxjs';
import { FormBuilder, UntypedFormGroup, ValidatorFn, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CaFolderStorageDTO } from '../../../../../ca-core/model/entities/folder/ca-folder.class';

export interface CaFolderConfigureStorageInput extends FlFormDialogInput<CaFolderStorageDTO> {
  folderId: string;
}

/**
 * Dialog to configure the storage for a folder
 */
@Component({
  selector: 'ca-folder-configure-storage',
  templateUrl: './ca-folder-configure-storage.component.html',
  styleUrls: ['./ca-folder-configure-storage.component.scss'],
  standalone: false,
})
export class CaFolderConfigureStorageComponent
  extends FlFormDialogAbstractDirective<CaFolderStorageDTO>
  implements OnInit
{
  private folderService = inject(CaFolderService);

  dialogInput: CaFolderConfigureStorageInput = inject(MAT_DIALOG_DATA);

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.init();
  }

  buildForm(): UntypedFormGroup {
    return new FormBuilder().group(
      {
        mainStorage: [
          { value: null, disabled: this.dialogInput.object.mainStorage != null },
          Validators.required,
        ],
        backupStorage: [{ value: null, disabled: this.dialogInput.object.backupStorage != null }],
      },
      { validator: this.differentBackupStorageValidator() }
    );
  }

  create(): Observable<CaFolderStorageDTO> {
    return undefined;
  }

  getCreateSuccessMessage(): string {
    return '';
  }

  // Update is not supported
  getUpdateSuccessMessage(): string {
    return 'folder_storage_configured';
  }

  update(formValue: CaFolderStorageDTO): Observable<CaFolderStorageDTO> {
    return this.folderService.createFolderBuckets(this.dialogInput.folderId, formValue);
  }

  private differentBackupStorageValidator(): ValidatorFn {
    return (control: UntypedFormGroup): { [key: string]: any } => {
      const value: CaFolderStorageDTO = control.value;
      if (value.mainStorage == null || value.backupStorage == null) return null;

      if (value.mainStorage.bucketId === value.backupStorage.bucketId) {
        return { sameBackupStorage: true };
      }
      return null;
    };
  }
}
