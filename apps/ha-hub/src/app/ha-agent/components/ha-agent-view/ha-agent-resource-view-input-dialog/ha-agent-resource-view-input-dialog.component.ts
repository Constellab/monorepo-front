import { Component, OnInit, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogContent } from '@angular/material/dialog';
import { HaAgentService } from '../../../../ha-core/ha-service/ha-agent.service';
import { FlDialogModule } from '../../../../../../../../libs/front-core-lib/src/lib/module/fl-dialog/fl-dialog.module';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { FlLoaderModule } from '../../../../../../../../libs/front-core-lib/src/lib/module/fl-loader/fl-loader.module';
import { FlInputFileModule } from '../../../../../../../../libs/front-core-lib/src/lib/module/fl-input-file/fl-input-file.module';
import { TranslatePipe } from '@ngx-translate/core';

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
  imports: [
    FlDialogModule,
    CdkScrollable,
    MatDialogContent,
    FlLoaderModule,
    FlInputFileModule,
    TranslatePipe,
  ],
})
export class HaAgentResourceViewInputDialogComponent implements OnInit {
  private dialogRef = inject<MatDialogRef<HaAgentResourceViewInputDialogComponent>>(MatDialogRef);
  private agentService = inject(HaAgentService);

  agentId: string;
  isLoading: boolean = false;

  constructor() {
    const data = inject<HaAgentResourceViewInputDialogInputData>(MAT_DIALOG_DATA);

    this.agentId = data.agentId;
  }

  ngOnInit(): void {}

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
      this.isLoading = false;
      console.log('ERROR FILE FORMAT');
      return;
    }
    this.agentService.uploadResourceViewFile(this.agentId, formData).subscribe((res: any) => {
      this.dialogRef.close({
        filename: res.filename,
        view: fileData,
      } as HaAgentResourceViewInputDialogOutputData);
    });
  }

  checkJsonFileData(file: any): boolean {
    return file.data != null && file.type != null && file.title != null;
  }
}
