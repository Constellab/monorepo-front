import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {HaLiveTaskService} from '../../../../ha-core/ha-service/ha-live-task.service';

export interface HaLiveTaskResourceViewInputDialogInputData {
  liveTaskId: string;
}

export interface HaLiveTaskViewFileData {
  type: string;
  title: string;
  technical_info: any[],
  data: Record<string, any>;
}

export interface HaLiveTaskResourceViewInputDialogOutputData {
  filename: string;
  view: HaLiveTaskViewFileData;
}

@Component({
  selector: 'ha-live-task-resource-view-input-dialog',
  templateUrl: './ha-live-task-resource-view-input-dialog.component.html',
  styleUrls: ['./ha-live-task-resource-view-input-dialog.component.scss']
})
export class HaLiveTaskResourceViewInputDialogComponent implements OnInit{

  liveTaskId: string;
  isLoading: boolean = false;

  constructor(@Inject(MAT_DIALOG_DATA) data: HaLiveTaskResourceViewInputDialogInputData,
              private dialogRef: MatDialogRef<HaLiveTaskResourceViewInputDialogComponent>,
              private liveTaskService: HaLiveTaskService) {
    this.liveTaskId = data.liveTaskId;
  }

  ngOnInit(): void{

  }

  async parseJsonFile(file: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader()
      fileReader.onload = event => resolve(JSON.parse(event.target.result as string))
      fileReader.onerror = error => reject(error)
      fileReader.readAsText(file)
    })
  }

  async uploadFile(file: any): Promise<void> {
    this.isLoading = true;
    const formData = new FormData();
    formData.append('file', file);
    const fileData: any = await this.parseJsonFile(file)
    if (!this.checkJsonFileData(fileData)){
      this.isLoading = false;
      console.log('ERROR FILE FORMAT')
      return;
    }
    this.liveTaskService.uploadResourceViewFile(this.liveTaskId, formData).subscribe((res: any) => {
      this.dialogRef.close({filename: res.filename, view: fileData} as  HaLiveTaskResourceViewInputDialogOutputData);
    });
  }

  checkJsonFileData(file: any): boolean {
    return file.data != null && file.type != null && file.title != null;
  }
}
