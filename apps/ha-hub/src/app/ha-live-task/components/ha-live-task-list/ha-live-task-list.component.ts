import {Component, OnInit} from '@angular/core';
import {HaLiveTaskService} from '../../../ha-core/ha-service/ha-live-task.service';
import {HaSpaceService} from '../../../ha-core/ha-service/ha-space.service';
import {FlDialogService} from '@monorepo/front-core-lib';
import {Router} from '@angular/router';
import {
  HaCreateLiveTaskInput,
  HaLiveTaskCreateDialogComponent
} from '../ha-live-task-create-dialog/ha-live-task-create-dialog.component';
import {HaLiveTaskVersion} from '../../../ha-core/ha-model/ha-entities/ha-live-task-version.class';
import {HaUser} from '../../../ha-core/ha-model/ha-entities/ha-user';
import {HaAuthenticatedUserService} from '../../../ha-core/ha-service/ha-authenticated-user.service';
import {HaLiveTask, HaLiveTaskDatasourcePaginated} from '../../../ha-core/ha-model/ha-entities/ha-live-task.class';
import {HaSpace} from '../../../ha-core/ha-model/ha-entities/ha-space.class';
import {HaTopicDto} from '../../../ha-core/ha-model/ha-entities/ha-topic.class';

@Component({
  selector: 'ha-live-task-list',
  templateUrl: './ha-live-task-list.component.html',
  styleUrls: ['./ha-live-task-list.component.scss']
})
export class HaLiveTaskListComponent implements OnInit {

  user: HaUser;
  liveTasks: HaLiveTask[];
  liveTasksPaginated: HaLiveTaskDatasourcePaginated;
  listSpaces: HaSpace[] = [];
  spaceIdFilter: string[] = [];
  constructor(
    private liveTaskService: HaLiveTaskService,
    private dialogService: FlDialogService,
    private router: Router,
    private authenticatedUserService: HaAuthenticatedUserService,
    private spaceService: HaSpaceService
  ) {
  }

  ngOnInit(): void {
    this.liveTasksPaginated = this.liveTaskService.getAllPaginated();

    this.authenticatedUserService.getUser().subscribe((user: HaUser) => {
      this.user = user;
      if(user) {
        this.spaceService.getSpacesOfCurrentUser().subscribe((spaces: HaSpace[]) => {
          this.listSpaces = spaces;
        });
      }
    });
  }



  openCreateLiveTaskDialog(): void {

    const input: HaCreateLiveTaskInput = {
      mode: 'create'
    }

    this.dialogService.openSmallDialog(HaLiveTaskCreateDialogComponent, {data: input}).afterClosed().subscribe((liveTaskVersion: HaLiveTaskVersion) => {
      if (liveTaskVersion && liveTaskVersion.liveTask) {
        this.router.navigate(['live-tasks/' + liveTaskVersion.liveTask.id +'/detail/' + liveTaskVersion.id]);
      }
    });
  }

  isSelected(spaceId: string): boolean {
    return this.spaceIdFilter.find((id) => id == spaceId) != null;
  }

  selectSpace(spaceId: string): void {
    if(this.isSelected(spaceId)){
      this.spaceIdFilter = this.spaceIdFilter.filter((id) => id != spaceId);
    } else {
      this.spaceIdFilter.push(spaceId);
    }

    if (this.spaceIdFilter.length == 0) {
      this.liveTasksPaginated = this.liveTaskService.getAllPaginated();
      return;
    }
    this.liveTasksPaginated = this.liveTaskService.getAllWithSpacesFilterPaginated(this.spaceIdFilter);
  }
}
