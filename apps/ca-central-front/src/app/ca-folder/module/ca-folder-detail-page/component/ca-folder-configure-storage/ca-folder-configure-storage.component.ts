import {Component, inject, OnInit} from '@angular/core';
import {FlFormDialogAbstractDirective, FlFormDialogInput} from '@monorepo/front-core-lib';
import {CaFolderService} from '../../../../../ca-core/service-api/ca-folder.service';
import {Observable} from 'rxjs';
import {FormBuilder, FormGroup} from '@ngneat/reactive-forms';
import {ValidatorFn, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {CaFolderStorageDTO} from '../../../../../ca-core/model/entities/folder/ca-folder.class';


export interface CaFolderConfigureStorageInput extends FlFormDialogInput<CaFolderStorageDTO> {
  folderId: string;
}

/**
 * Dialog to configure the storage for a folder
 */
@Component({
  selector: 'ca-folder-configure-storage',
  templateUrl: './ca-folder-configure-storage.component.html',
  styleUrls: ['./ca-folder-configure-storage.component.scss']
})
export class CaFolderConfigureStorageComponent
  extends FlFormDialogAbstractDirective<CaFolderStorageDTO>
  implements OnInit {

  dialogInput: CaFolderConfigureStorageInput = inject(MAT_DIALOG_DATA);


  constructor(private folderService: CaFolderService) {
    super();
  }

  ngOnInit(): void {
    this.init();
  }

  buildForm(): FormGroup<CaFolderStorageDTO> {
    return new FormBuilder().group({
      mainStorage: [{value: null, disabled: this.dialogInput.object.mainStorage != null}, Validators.required],
      backupStorage: [{value: null, disabled: this.dialogInput.object.backupStorage != null}],
    }, {validator: this.differentBackupStorageValidator()});
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
    return (control: FormGroup<CaFolderStorageDTO>): { [key: string]: any } => {
      if (control.value.mainStorage == null || control.value.backupStorage == null) return null;

      if (control.value.mainStorage.bucketId === control.value.backupStorage.bucketId) {
        return {sameBackupStorage: true};
      }
      return null;
    };
  }


}
