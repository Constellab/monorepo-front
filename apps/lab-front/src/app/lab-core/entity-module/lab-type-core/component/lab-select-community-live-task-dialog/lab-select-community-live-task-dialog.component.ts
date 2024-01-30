import {Component, OnInit} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {LabCommunityApiService} from '../../../../service/lab-community-api.service';
import {LabLiveTask} from '../../../../model/entities/lab-live-task.entity';

export interface LabSelectCommunityLiveTaskDialogInput {
  title?: string;
}

/**
 * Dialog containing the community live task search to select one
 */
@Component({
  selector: 'lab-select-community-live-task-dialog',
  templateUrl: './lab-select-community-live-task-dialog.component.html',
  styleUrls: ['./lab-select-community-live-task-dialog.component.scss']
})
export class LabSelectCommunityLiveTaskDialogComponent implements OnInit {

  title: string = 'biox.select_community_live_task';
  liveTasks: LabLiveTask[];

  constructor(private dialogRef: MatDialogRef<LabSelectCommunityLiveTaskDialogComponent>,
              private communityApiService: LabCommunityApiService) {
  }

  ngOnInit(): void {
    this.communityApiService.getPublicLiveTask().subscribe((liveTasks: LabLiveTask[]) => {
      this.liveTasks = liveTasks;
    });
  }

  loadLiveTask(liveTaskId: string): void{
    this.communityApiService.getLiveTaskVersion(liveTaskId).subscribe((liveTaskVersion: any) => {
      this.dialogRef.close(liveTaskVersion);
    });
  }

}
