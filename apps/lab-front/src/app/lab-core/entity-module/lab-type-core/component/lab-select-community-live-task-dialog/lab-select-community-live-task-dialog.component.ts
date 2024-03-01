import {Component, OnInit} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {LabLiveTask} from '../../../../model/entities/lab-live-task.entity';

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

  constructor(private dialogRef: MatDialogRef<LabSelectCommunityLiveTaskDialogComponent>,) {
  }

  ngOnInit(): void {
  }

  onLiveTaskClick(liveTask: LabLiveTask): void {
    this.dialogRef.close(liveTask);
  }
}
