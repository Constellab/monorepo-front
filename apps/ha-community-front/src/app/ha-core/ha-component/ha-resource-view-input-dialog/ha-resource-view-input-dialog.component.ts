import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { FlDialogModule } from '@monorepo/front-core-lib/fl-dialog';
import { FlInputFileModule } from '@monorepo/front-core-lib/fl-input-file';
import { FlLoaderModule } from '@monorepo/front-core-lib/fl-loader';
import { FlSnackBarService } from '@monorepo/front-core-lib/fl-snack-bar';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable } from 'rxjs';

export interface HaResourceViewInputDialogData {
  entityId: string;
  headerTranslationKey: string;
  uploadFn: (entityId: string, file: FormData) => Observable<any>;
}

export interface HaViewFileData {
  type: string;
  title: string;
  technical_info: any[];
  data: Record<string, any>;
}

export interface HaResourceViewInputDialogOutputData {
  filename: string;
  view: HaViewFileData;
}

/**
 * Shared dialog for uploading a JSON resource view file.
 *
 * Used by brick docs, stories, and agents to attach chart/table views to EditorJS content.
 * The caller provides entityId, a translation key for the header, and an uploadFn via MAT_DIALOG_DATA.
 * On success, returns { filename, view } so the parent block can initialize the view component.
 *
 * Validates that the JSON file contains required fields (data, type, title) before uploading.
 */
@Component({
  selector: 'ha-resource-view-input-dialog',
  templateUrl: './ha-resource-view-input-dialog.component.html',
  styleUrls: ['./ha-resource-view-input-dialog.component.scss'],
  imports: [FlDialogModule, MatDialogContent, FlLoaderModule, FlInputFileModule, TranslatePipe],
})
export class HaResourceViewInputDialogComponent {
  private dialogRef = inject<MatDialogRef<HaResourceViewInputDialogComponent>>(MatDialogRef);
  private snackBarService = inject(FlSnackBarService);
  private data = inject<HaResourceViewInputDialogData>(MAT_DIALOG_DATA);

  headerTranslationKey = this.data.headerTranslationKey;
  isLoading: boolean = false;

  async parseJsonFile(file: File): Promise<HaViewFileData> {
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

  async uploadFile(file: File | File[]): Promise<void> {
    if (Array.isArray(file)) return;
    this.isLoading = true;
    const formData = new FormData();
    formData.append('file', file);
    const fileData: HaViewFileData = await this.parseJsonFile(file);
    if (!this.checkJsonFileData(fileData)) {
      this.isLoading = false;
      this.snackBarService.openErrorMessage({ text: 'error_invalid_file_format', translateText: true });
      return;
    }
    this.data.uploadFn(this.data.entityId, formData).subscribe({
      next: (res: any) => {
        this.dialogRef.close({
          filename: res.filename,
          view: fileData,
        } as HaResourceViewInputDialogOutputData);
      },
      error: () => {
        this.isLoading = false;
        this.snackBarService.openErrorMessage({ text: 'error_uploading_file', translateText: true });
      },
    });
  }

  checkJsonFileData(file: HaViewFileData): boolean {
    return file.data != null && file.type != null && file.title != null;
  }
}
