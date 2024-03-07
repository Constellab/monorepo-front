import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {LabLiveTask, LabLiveTaskDatasourcePaginated} from '../../../../model/entities/lab-live-task.entity';
import {LabProtocolService} from '../../../../entity-service/lab-protocol.service';
import {DateTime} from 'luxon';
import {FormControl} from '@angular/forms';
import {LabCommunitySpace} from '../../../../model/entities/lab-community-space.entity';
import {LtLiveTask} from '@monorepo/live-task';

/**
 * Dialog containing the community live task search to select one
 */
@Component({
  selector: 'lab-select-community-live-task',
  templateUrl: './lab-select-community-live-task.component.html',
  styleUrls: ['./lab-select-community-live-task.component.scss']
})
export class LabSelectCommunityLiveTaskComponent implements OnInit {

  @Input() personalOnly: boolean = false;

  //Output event on live task click
  @Output() liveTaskSelected: EventEmitter<LabLiveTask> = new EventEmitter<LabLiveTask>();


  liveTasksDatasource: LabLiveTaskDatasourcePaginated;
  titleFormControl: FormControl<string> = new FormControl('');
  spaceIdFilter: string[] = [];
  spaces: LabCommunitySpace[];

  constructor(private protocolService: LabProtocolService) {
  }

  ngOnInit(): void {
    this.search();
    this.protocolService.getCommunitySpaces().subscribe(spaces => {
      this.spaces = spaces
    });
  }

  onLiveTaskClick(liveTask: LabLiveTask): void {
    this.liveTaskSelected.emit(liveTask);
  }


  pythonLabLiveTaskToLtLiveTask(liveTask: LabLiveTask): LtLiveTask {
    return liveTask.toLtLiveTask();
  }

  search(): void {
    this.liveTasksDatasource =
      this.protocolService.getCommunityAvailableLiveTasksWithFiltersPaginated(
        this.spaceIdFilter, this.titleFormControl.value, this.personalOnly);
  }

  isSelected(spaceId: string): boolean {
    return this.spaceIdFilter.find((id) => id == spaceId) != null;
  }

  selectSpace(spaceId: string): void {
    if (this.isSelected(spaceId)) {
      this.spaceIdFilter = this.spaceIdFilter.filter((id) => id != spaceId);
    } else {
      this.spaceIdFilter.push(spaceId);
    }

    this.search();
  }
}
