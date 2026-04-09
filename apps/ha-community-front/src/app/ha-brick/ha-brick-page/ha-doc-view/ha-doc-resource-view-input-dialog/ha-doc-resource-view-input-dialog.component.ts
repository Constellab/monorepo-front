import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { FlDialogModule } from '@monorepo/front-core-lib/fl-dialog';
import { FlInputFileModule } from '@monorepo/front-core-lib/fl-input-file';
import { FlLoaderModule } from '@monorepo/front-core-lib/fl-loader';
import { FlSnackBarService } from '@monorepo/front-core-lib/fl-snack-bar';
import { TranslatePipe } from '@ngx-translate/core';

import { HaDocumentationService } from '../../../../ha-core/ha-service/ha-documentation.service';

export interface HaDocResourceViewInputDialogInputData {
  docId: string;
}

export interface HaDocViewFileData {
  type: string;
  title: string;
  technical_info: any[];
  data: Record<string, any>;
}

export interface HaDocResourceViewInputDialogOutputData {
  filename: string;
  view: HaDocViewFileData;
}

@Component({
  selector: 'ha-doc-resource-view-input-dialog',
  templateUrl: './ha-doc-resource-view-input-dialog.component.html',
  styleUrls: ['./ha-doc-resource-view-input-dialog.component.scss'],
  imports: [FlDialogModule, MatDialogContent, FlLoaderModule, FlInputFileModule, TranslatePipe],
})
export class HaDocResourceViewInputDialogComponent {
  private dialogRef = inject<MatDialogRef<HaDocResourceViewInputDialogComponent>>(MatDialogRef);
  private docService = inject(HaDocumentationService);
  private snackBarService = inject(FlSnackBarService);

  docId: string;
  isLoading: boolean = false;

  constructor() {
    const data = inject<HaDocResourceViewInputDialogInputData>(MAT_DIALOG_DATA);

    this.docId = data.docId;
  }

  async parseJsonFile(file: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.onload = (event) => {
        try {
          resolve(JSON.parse(event.target.result as string));
        } catch (e) {
          reject(e);
        }
      };
      fileReader.onerror = (error) => reject(error);
      fileReader.readAsText(file);
    });
  }

  async uploadFile(file: any): Promise<void> {
    this.isLoading = true;
    const formData = new FormData();
    formData.append('file', file);
    const fileData: any = await this.parseJsonFile(file);
    if (!this.checkJsonFileData(fileData)) {
      this.isLoading = false;
      this.snackBarService.openErrorMessage({ text: 'error_invalid_file_format', translateText: true });
      return;
    }
    this.docService.uploadDocResourceViewFile(this.docId, formData).subscribe({
      next: (res: any) => {
        this.dialogRef.close({
          filename: res.filename,
          view: fileData,
        } as HaDocResourceViewInputDialogOutputData);
      },
      error: () => {
        this.isLoading = false;
        this.snackBarService.openErrorMessage({ text: 'error_uploading_file', translateText: true });
      },
    });
  }

  checkJsonFileData(file: any): boolean {
    return file.data != null && file.type != null && file.title != null;
  }
}
