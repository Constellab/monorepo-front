import { Component, inject, OnInit } from '@angular/core';
import { FlFormDialogAbstractDirective, FlFormDialogInput } from '@monorepo/front-core-lib';
import { CaFolderService } from '../../../../../ca-core/service-api/ca-folder.service';
import { Observable } from 'rxjs';
import { FormBuilder, UntypedFormGroup, ValidatorFn, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { CaFolderStorageDTO } from '../../../../../ca-core/model/entities/folder/ca-folder.class';
import { FlDialogModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-dialog/fl-dialog.module';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { MatFormField, MatLabel, MatError } from '@angular/material/form-field';
import { MatSelect, MatSelectTrigger } from '@angular/material/select';
import { CaBucketLocationInlineComponent } from '../../../../../ca-core/entity-module/ca-object-storage-core/component/ca-bucket-location-inline/ca-bucket-location-inline.component';
import { CaBucketLocationSelectOptionsComponent } from '../../../../../ca-core/entity-module/ca-object-storage-core/component/ca-bucket-location-select-options/ca-bucket-location-select-options.component';
import { MatButton } from '@angular/material/button';
import { FlLoaderModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-loader/fl-loader.module';
import { FlCorePipeModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-core-pipe/fl-core-pipe.module';
import { TranslatePipe } from '@ngx-translate/core';

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
  imports: [
    FlDialogModule,
    CdkScrollable,
    MatDialogContent,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatSelect,
    MatSelectTrigger,
    CaBucketLocationInlineComponent,
    CaBucketLocationSelectOptionsComponent,
    MatError,
    MatDialogActions,
    MatButton,
    FlLoaderModule,
    FlCorePipeModule,
    TranslatePipe,
  ],
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
