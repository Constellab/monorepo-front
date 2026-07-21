import { ChangeDetectionStrategy,Component, inject, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatRadioModule } from '@angular/material/radio';
import { FlDialogModule } from '@monorepo/front-core-lib/fl-dialog';
import { FlTranslateModule, FlTranslateService } from '@monorepo/front-core-lib/fl-translate';

import { CaDocumentUploadOverrideMode } from '../../../../model/entities/folder/ca-document.class';

export interface CaFolderUploadFileErrorDialogInput {
  fileNames: string[];
}

export type CaFolderUploadFileErrorDialogOutput = CaDocumentUploadOverrideMode | null;

/**
 * Dialog opened when the document already exists error occurs during upload
 */
@Component({
  selector: 'ca-folder-upload-file-override-dialog',
  imports: [
    FlDialogModule,
    FlTranslateModule,
    MatRadioModule,
    ReactiveFormsModule,
    MatButtonModule,
    FormsModule,
  ],
  templateUrl: './ca-folder-upload-file-override-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './ca-folder-upload-file-override-dialog.component.scss',
})
export class CaFolderUploadFileOverrideDialogComponent implements OnInit {
  private dialogRef = inject(MatDialogRef);
  private input: CaFolderUploadFileErrorDialogInput = inject(MAT_DIALOG_DATA);
  private translateService = inject(FlTranslateService);

  formCtrl = new FormControl(CaDocumentUploadOverrideMode.REPLACE, Validators.required);

  text: string;
  replaceText: string;
  renameText: string;

  modes = CaDocumentUploadOverrideMode;

  ngOnInit(): void {
    if (this.input.fileNames.length > 1) {
      this.text = this.translateService.translate('files_already_exist');
      this.replaceText = this.translateService.translate('files_import_replace');
      this.renameText = this.translateService.translate('files_import_rename');
    } else {
      this.text = this.translateService.translate('file_already_exists', {
        param: { name: this.input.fileNames[0] },
      });
      this.replaceText = this.translateService.translate('file_import_replace');
      this.renameText = this.translateService.translate('file_import_rename');
    }
  }

  submit(): void {
    if (this.formCtrl.valid) {
      this.dialogRef.close(this.formCtrl.value);
    }
  }

  cancel(): void {
    this.dialogRef.close(null);
  }
}
