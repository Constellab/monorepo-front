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
import {HaLiveTaskDatasourcePaginated} from '../../../ha-core/ha-model/ha-entities/ha-live-task.class';
import {HaSpace} from '../../../ha-core/ha-model/ha-entities/ha-space.class';
import {Observable} from 'rxjs';
import {FormControl} from '@angular/forms';
import {ClStringHelper} from "@monorepo/core-lib";

@Component({
  selector: 'ha-live-task-list',
  templateUrl: './ha-live-task-list.component.html',
  styleUrls: ['./ha-live-task-list.component.scss']
})
export class HaLiveTaskListComponent implements OnInit {

  liveTasksPaginated: HaLiveTaskDatasourcePaginated;
  user: HaUser;
  spaceIdFilter: string[] = [];
  titleFormControl: FormControl<string> = new FormControl('');

  constructor(
    private liveTaskService: HaLiveTaskService,
    private dialogService: FlDialogService,
    private router: Router,
    private authenticatedUserService: HaAuthenticatedUserService) {
  }

  ngOnInit(): void {

    this.authenticatedUserService.getUser().subscribe((user: HaUser) => {
      this.user = user;
    });
    this.liveTasksPaginated = this.liveTaskService.getAllWithFiltersPaginated();
    this.updateLiveTask();
  }



  openCreateLiveTaskDialog(): void {
    const input: HaCreateLiveTaskInput = {
      mode: 'create'
    }

    this.dialogService.openSmallDialog(HaLiveTaskCreateDialogComponent, {data: input}).afterClosed()
      .subscribe((liveTaskVersion: HaLiveTaskVersion) => {
        if (liveTaskVersion && liveTaskVersion.liveTask) {
          this.router.navigate(['live-tasks/' + liveTaskVersion.liveTask.id +'/versions/' + liveTaskVersion.id]);
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
    this.updateLiveTask();
  }

  onSpace(spaceId: string): void{
    this.selectSpace(spaceId)
  }

  search(event): void {
    event.preventDefault();
    this.updateLiveTask();
  }

  updateLiveTask(): void {
    this.liveTasksPaginated.getFirstPage({
      spacesFilter: this.spaceIdFilter,
      titleFilter: this.titleFormControl.value
    });
  }

    protected readonly ClStringHelper = ClStringHelper;
}
