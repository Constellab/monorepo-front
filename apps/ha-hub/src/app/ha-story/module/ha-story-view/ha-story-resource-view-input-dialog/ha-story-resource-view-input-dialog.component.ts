import { Component, OnInit, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HaStoryService } from '../../../../ha-core/ha-service/ha-story.service';

export interface HaStoryResourceViewInputDialogInputData {
  storyId: string;
}

export interface HaStoryViewFileData {
  type: string;
  title: string;
  technical_info: any[];
  data: Record<string, any>;
}

export interface HaStoryResourceViewInputDialogOutputData {
  filename: string;
  view: HaStoryViewFileData;
}

@Component({
  selector: 'ha-story-resource-view-input-dialog',
  templateUrl: './ha-story-resource-view-input-dialog.component.html',
  styleUrls: ['./ha-story-resource-view-input-dialog.component.scss'],
  standalone: false,
})
export class HaStoryResourceViewInputDialogComponent implements OnInit {
  private dialogRef = inject<MatDialogRef<HaStoryResourceViewInputDialogComponent>>(MatDialogRef);
  private storyService = inject(HaStoryService);

  storyId: string;
  isLoading: boolean = false;

  constructor() {
    const data = inject<HaStoryResourceViewInputDialogInputData>(MAT_DIALOG_DATA);

    this.storyId = data.storyId;
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
    this.storyService.uploadStoryResourceViewFile(this.storyId, formData).subscribe((res: any) => {
      this.dialogRef.close({
        filename: res.filename,
        view: fileData,
      } as HaStoryResourceViewInputDialogOutputData);
    });
  }

  checkJsonFileData(file: any): boolean {
    return file.data != null && file.type != null && file.title != null;
  }
}
