import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { LabProtocolService } from '../../../../entity-service/lab-protocol.service';
import { FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { LabCreateCommunityLiveTaskVersionResDto } from '../../../../model/entities/lab-live-task.entity';
import { CoCreateLiveTaskFormData, CoLiveTaskType, CoSpace } from '@monorepo/community-lib';

export enum LabCreateCommunityLiveTaskDialogMode {
  CREATE = 'CREATE',
  FORK = 'FORK'
}

export interface LabShareLiveTaskCommunityDialogData {
  processId: string;
  mode: LabCreateCommunityLiveTaskDialogMode;
  liveTaskVersionId?: string;
}

@Component({
  selector: 'lab-create-community-live-task-dialog',
  templateUrl: './lab-create-community-live-task-dialog.component.html',
  styleUrls: ['./lab-create-community-live-task-dialog.component.scss']
})
export class LabCreateCommunityLiveTaskDialogComponent implements OnInit {
  title: string = 'biox.create_community_live_task';
  processId: string;
  spaces$: Observable<CoSpace[]>;
  formGp = new FormBuilder().group({
    title: [null as string, Validators.required],
    type: [null as CoLiveTaskType, Validators.required],
    space: [null as CoSpace]
  });
  mode: LabCreateCommunityLiveTaskDialogMode;
  liveTaskVersionId: string;

  constructor(@Inject(MAT_DIALOG_DATA) public data: LabShareLiveTaskCommunityDialogData,
              private protocolService: LabProtocolService,
              private dialogRef: MatDialogRef<LabCreateCommunityLiveTaskDialogComponent>) {
    this.processId = data.processId;
    this.mode = data.mode;
    this.liveTaskVersionId = data.liveTaskVersionId;
  }

  ngOnInit(): void {
    this.spaces$ = this.protocolService.getCommunitySpaces();
  }

  submit(formData: CoCreateLiveTaskFormData): void {
    this.formGp.patchValue(formData);
    if (this.formGp.valid) {
      if (this.mode === LabCreateCommunityLiveTaskDialogMode.FORK) {
        if (!this.liveTaskVersionId) return;
        this.protocolService.forkIntoNewCommunityLiveTask(this.processId, this.formGp.getRawValue(), this.liveTaskVersionId)
          .subscribe((res: LabCreateCommunityLiveTaskVersionResDto) => {
            this.dialogRef.close(res);
          });

      } else {
        this.protocolService.createCommunityLiveTask(this.processId, this.formGp.getRawValue())
          .subscribe((res: LabCreateCommunityLiveTaskVersionResDto) => {
            this.dialogRef.close(res);
          });
      }
    }
  }
}
