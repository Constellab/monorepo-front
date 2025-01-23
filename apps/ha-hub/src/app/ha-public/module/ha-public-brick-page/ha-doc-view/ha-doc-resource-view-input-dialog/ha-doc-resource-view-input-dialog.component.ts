import { Component, inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { HaDocumentationService } from '../../../../../ha-core/ha-service/ha-documentation.service';
import { FlDialogModule } from '@monorepo/front-core-lib/fl-dialog';
import { FlLoaderModule } from '@monorepo/front-core-lib/fl-loader';
import { FlInputFileModule } from '@monorepo/front-core-lib/fl-input-file';
import { TranslatePipe } from '@ngx-translate/core';

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

  docId: string;
  isLoading: boolean = false;

  constructor() {
    const data = inject<HaDocResourceViewInputDialogInputData>(MAT_DIALOG_DATA);

    this.docId = data.docId;
  }

  async parseJsonFile(file: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.onload = (event) => resolve(JSON.parse(event.target.result as string));
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
      console.log('ERROR FILE FORMAT');
      this.isLoading = false;
      return;
    }
    this.docService.uploadDocResourceViewFile(this.docId, formData).subscribe((res: any) => {
      this.dialogRef.close({
        filename: res.filename,
        view: fileData,
      } as HaDocResourceViewInputDialogOutputData);
    });
  }

  checkJsonFileData(file: any): boolean {
    return file.data != null && file.type != null && file.title != null;
  }
}
