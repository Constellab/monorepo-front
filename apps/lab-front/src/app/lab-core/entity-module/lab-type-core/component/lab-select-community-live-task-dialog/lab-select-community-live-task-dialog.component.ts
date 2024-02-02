import {Component, OnInit} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {LabCommunityApiService} from '../../../../service/lab-community-api.service';
import {LabLiveTask} from '../../../../model/entities/lab-live-task.entity';
import {LabProtocolService} from '../../../../entity-service/lab-protocol.service';
import {LtLiveTask} from '../../../../../../../../../libs/live-task/src';
import {DateTime} from 'luxon';

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
              private protocolService: LabProtocolService) {
  }

  ngOnInit(): void {
    this.protocolService.getCommunityAvailableLiveTask().subscribe(liveTasks => {
      this.liveTasks = liveTasks;
    });
  }

  loadLiveTask(liveTask: LabLiveTask): void{
    this.dialogRef.close(liveTask);
  }


  pythonLabLiveTaskToLtLiveTask(liveTask: LabLiveTask): LtLiveTask{
    const ltLiveTask = new LtLiveTask();
    ltLiveTask.id = liveTask.id;
    ltLiveTask.title = liveTask.title;
    ltLiveTask.description = liveTask.description;
    ltLiveTask.latestPublishVersion = liveTask.latest_publish_version;
    ltLiveTask.createdAt = DateTime.fromISO(liveTask.created_at)
    ltLiveTask.lastModifiedAt = DateTime.fromISO(liveTask.last_modified_at);
    ltLiveTask.createdBy = liveTask.created_by;
    ltLiveTask.space = liveTask.space;
    return ltLiveTask;
  }

}
