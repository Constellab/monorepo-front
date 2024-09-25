import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {LabProtocolService} from '../../../../entity-service/lab-protocol.service';
import {LabCreateCommunityLiveTaskVersionResDto, LabLiveTask} from '../../../../model/entities/lab-live-task.entity';
import {
  LabCreateCommunityLiveTaskDialogComponent,
  LabCreateCommunityLiveTaskDialogMode
} from '../lab-create-community-live-task-dialog/lab-create-community-live-task-dialog.component';
import {FlConfirmDialogInput, FlDialogService, FlTranslateService} from '@monorepo/front-core-lib';
import {LabAuthenticatedUserService} from '../../../../service/lab-authenticated-user.service';
import {LabUser} from '../../../../model/entities/lab-user.entity';

export interface LabShareLiveTaskCommunityDialogData {
  processId: string;
  liveTaskVersionId: string;
}

@Component({
  selector: 'lab-share-live-task-community-dialog',
  templateUrl: './lab-share-live-task-community-dialog.component.html',
  styleUrls: ['./lab-share-live-task-community-dialog.component.scss']
})
export class LabShareLiveTaskCommunityDialogComponent implements OnInit {
  title: string = 'biox.share_live_task_to_community';
  processId: string;
  liveTaskVersionId: string;
  currentLiveTask: LabLiveTask;
  currentUser: LabUser;
  isLoading: boolean = false;
  protected readonly LabCreateCommunityLiveTaskDialogMode = LabCreateCommunityLiveTaskDialogMode;

  constructor(@Inject(MAT_DIALOG_DATA) public data: LabShareLiveTaskCommunityDialogData,
              private protocolService: LabProtocolService,
              private dialogRef: MatDialogRef<LabShareLiveTaskCommunityDialogComponent>,
              private authUserService: LabAuthenticatedUserService,
              private dialogService: FlDialogService,
              private translateService: FlTranslateService) {
    this.processId = data.processId;
    this.liveTaskVersionId = data.liveTaskVersionId;
  }

  ngOnInit(): void {
    if (this.liveTaskVersionId) {
      this.isLoading = true;
      this.protocolService.getCurrentLiveTask(this.liveTaskVersionId).subscribe(liveTask => {
        this.currentLiveTask = liveTask;
        this.isLoading = false;
      });
    }
    this.currentUser = this.authUserService.getCurrentUser();
  }

  onSelectLiveTask(liveTask: LabLiveTask): void {
    this.openAddVersionConfirmDialog(liveTask);
  }

  openAddVersionConfirmDialog(liveTask?: LabLiveTask): void {
    if (!this.currentLiveTask && !liveTask) return;
    const content = this.translateService.translate('biox.add_version_to_community_live_task_content',
      {param: {liveTaskTitle: liveTask != null ? liveTask.title : this.currentLiveTask.title}})
    const input: FlConfirmDialogInput = {
      title: this.translateService.translate('biox.add_version_to_community_live_task'),
      content: content,
      successMessage: 'biox.add_version_to_community_live_task_success',
      observable: this.protocolService.addVersionToCommunityLiveTask(this.processId,
        liveTask != null ? liveTask.id : this.currentLiveTask.id)
    }
    this.dialogService.openConfirmDialog(input).afterClosed().subscribe(res => {
      if (res && res.result) {
        this.dialogRef.close(res.result);
      }
    });
  }

  openCreateCommunityLiveTaskDialog(mode: LabCreateCommunityLiveTaskDialogMode): void {
    this.dialogService.openSmallDialog(LabCreateCommunityLiveTaskDialogComponent, {
      data: {
        processId: this.processId,
        mode: mode,
        liveTaskVersionId: this.liveTaskVersionId
      }
    }).afterClosed().subscribe((res: LabCreateCommunityLiveTaskVersionResDto) => {
      if (res){
        this.dialogRef.close(res);
      }
    });
  }
}
