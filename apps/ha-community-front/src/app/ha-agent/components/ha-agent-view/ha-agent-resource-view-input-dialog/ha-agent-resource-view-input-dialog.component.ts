import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { FlDialogModule } from '@monorepo/front-core-lib/fl-dialog';
import { FlInputFileModule } from '@monorepo/front-core-lib/fl-input-file';
import { FlLoaderModule } from '@monorepo/front-core-lib/fl-loader';
import { FlSnackBarService } from '@monorepo/front-core-lib/fl-snack-bar';
import { TranslatePipe } from '@ngx-translate/core';

import { HaAgentService } from '../../../../ha-core/ha-service/ha-agent.service';

export interface HaAgentResourceViewInputDialogInputData {
  agentId: string;
}

export interface HaAgentViewFileData {
  type: string;
  title: string;
  technical_info: any[];
  data: Record<string, any>;
}

export interface HaAgentResourceViewInputDialogOutputData {
  filename: string;
  view: HaAgentViewFileData;
}

@Component({
  selector: 'ha-agent-resource-view-input-dialog',
  templateUrl: './ha-agent-resource-view-input-dialog.component.html',
  styleUrls: ['./ha-agent-resource-view-input-dialog.component.scss'],
  imports: [FlDialogModule, MatDialogContent, FlLoaderModule, FlInputFileModule, TranslatePipe],
})
export class HaAgentResourceViewInputDialogComponent {
  private dialogRef = inject<MatDialogRef<HaAgentResourceViewInputDialogComponent>>(MatDialogRef);
  private agentService = inject(HaAgentService);
  private snackBarService = inject(FlSnackBarService);

  agentId: string;
  isLoading: boolean = false;

  constructor() {
    const data = inject<HaAgentResourceViewInputDialogInputData>(MAT_DIALOG_DATA);

    this.agentId = data.agentId;
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
    this.agentService.uploadResourceViewFile(this.agentId, formData).subscribe({
      next: (res: any) => {
        this.dialogRef.close({
          filename: res.filename,
          view: fileData,
        } as HaAgentResourceViewInputDialogOutputData);
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
