import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, UntypedFormGroup, ValidatorFn, Validators } from '@angular/forms';
import { CaFolder, CnSaveFolderDTO } from '../../../../model/entities/folder/ca-folder.class';
import { CaFolderService } from '../../../../service-api/ca-folder.service';
import { Observable } from 'rxjs';
import { FlFormDialogAbstractDirective, FlFormMode } from '@monorepo/front-core-lib';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CaSpaceService } from '../../../../service-api/ca-space.service';

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
  styleUrls: ['./ca-folder-form-dialog.component.scss']
})
export class CaFolderFormDialogComponent extends FlFormDialogAbstractDirective<CnSaveFolderDTO, CaFolder> implements OnInit {

  dialogInput: CaFolderFormDialogInput = inject(MAT_DIALOG_DATA);

  constructor(private folderService: CaFolderService,
              private spaceService: CaSpaceService) {
    super();
  }

  async ngOnInit(): Promise<void> {
    this.init();

    if (this.showStorage) {
      this.spaceService.getCurrentSpaceSettings().subscribe(
        spaceSettings => {
          this.formGp.get('mainStorage').setValue(spaceSettings.defaultFolderStorageLocation);
          this.formGp.get('backupStorage').setValue(spaceSettings.defaultFolderBackupStorageLocation);
        }
      );
    }

    this.formGp.disable();
    if (this.isUpdateMode()) {
      this.folderService.getById(this.dialogInput.folderId).subscribe(
        folder => {
          this.formGp.patchValue(folder);
          this.formGp.enable();
        }
      );
    } else if (this.isCreateMode() && this.dialogInput.parentId) {
      // in create child mode, we copy the date from the parent folder
      this.folderService.getById(this.dialogInput.parentId).subscribe(
        parentFolder => {
          this.formGp.get('startingDate').setValue(parentFolder.startingDate);
          this.formGp.get('endingDate').setValue(parentFolder.endingDate);
          this.formGp.enable();
        }
      );
    } else {
      this.formGp.enable();
    }
  }

  buildForm(): UntypedFormGroup {
    return new FormBuilder().group({
      name: [null, Validators.required],
      code: [null],
      startingDate: [null],
      endingDate: [null],
      mainStorage: [null, this.showStorage ? Validators.required : null],
      backupStorage: [null]
    }, { validator: this.showStorage ? this.differentStorageValidator() : null });
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


  get title(): string {
    return this.isCreateMode() ? 'new_folder' : 'update_folder';
  }

  getCreateSuccessMessage(): string {
    return 'folder_created';
  }

  getUpdateSuccessMessage(): string {
    return 'folder_updated';
  }

  get showStorage(): boolean {
    return !this.dialogInput.parentId && this.isCreateMode();
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
