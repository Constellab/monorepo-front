import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {LabProtocolService} from '../../../../entity-service/lab-protocol.service';
import {FormBuilder, FormGroup} from '@ngneat/reactive-forms';
import {Validators} from '@angular/forms';
import {Observable} from 'rxjs';
import {LtCreateLiveTaskFormData, LtSpace} from '@monorepo/live-task';
import {LabCreateCommunityLiveTaskVersionResDto} from '../../../../model/entities/lab-live-task.entity';

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
  spaces$: Observable<LtSpace[]>;
  formGp: FormGroup<LtCreateLiveTaskFormData>;
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

    this.formGp = new FormBuilder().group({
      title: [null, Validators.required],
      type: [null, Validators.required],
      space: [null]
    })
  }

  submit(formData: LtCreateLiveTaskFormData): void {
    this.formGp.patchValue(formData);
    if (this.formGp.valid) {
      if (this.mode === LabCreateCommunityLiveTaskDialogMode.FORK) {
        if(!this.liveTaskVersionId) return;
        this.protocolService.forkIntoNewCommunityLiveTask(this.processId, this.formGp.value, this.liveTaskVersionId)
          .subscribe((res: LabCreateCommunityLiveTaskVersionResDto) => {
            this.dialogRef.close(res);
          });

      } else {
        this.protocolService.createCommunityLiveTask(this.processId, this.formGp.value)
          .subscribe((res: LabCreateCommunityLiveTaskVersionResDto) => {
            this.dialogRef.close(res);
          });
      }
    }
  }
}
