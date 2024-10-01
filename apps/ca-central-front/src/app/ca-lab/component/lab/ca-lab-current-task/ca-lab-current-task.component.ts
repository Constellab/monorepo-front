import { Component, Input, OnInit } from '@angular/core';
import { combineLatest, Observable, startWith } from 'rxjs';
import { CaLabDetailPageState } from '../../../state/ca-lab-detail-page.state';
import { CaLabDetailManagerState } from '../../../state/ca-lab-detail-manager.state';
import { FlTranslateService } from '@monorepo/front-core-lib';
import { map } from 'rxjs/operators';
import { CaLabStatusDTO } from '../../../../ca-core/model/entities/lab/ca-lab.class';
import { CaLabManagerStatus } from '../../../../ca-core/model/entities/lab/ca-lab-manager.class';
import { ClDateHelper } from '@monorepo/core-lib';
import { CaRouterService } from '../../../../ca-core/service/ca-router.service';

/**
 * Component to show the current running task of the lab
 */
@Component({
  selector: 'ca-lab-current-task',
  templateUrl: './ca-lab-current-task.component.html',
  styleUrl: './ca-lab-current-task.component.scss'
})
export class CaLabCurrentTaskComponent implements OnInit {

  /**
   * If true the text is a link to open the lab configuration will be shown
   */
  @Input() showConfigRouteLink: boolean = false;

  currentTask$: Observable<string>;

  configRoute: string;

  constructor(private state: CaLabDetailPageState,
              private managerState: CaLabDetailManagerState,
              private translateService: FlTranslateService) {
  }

  ngOnInit(): void {
    const obs = combineLatest([
      this.state.getStatus$(),
      this.managerState.getStatus$().pipe(startWith(null))
    ]);

    this.currentTask$ = obs.pipe(
      map(([status, managerStatus]) => this.getRunningTaskMessage(status, managerStatus)),
    );

    this.configRoute = CaRouterService.getLabConfigRoute(this.state.getLabId());
  }

  getRunningTaskMessage(status: CaLabStatusDTO, managerStatus?: CaLabManagerStatus): string {
    if (status == null) return null;

    // if there is a server task, return it
    if (status.serverTaskStatus.value === 'RUNNING') {
      // eslint-disable-next-line max-len
      return `${this.translateService.translate(this.getStatusRunningMessage(status))} - ${status.serverTaskText} - ${ClDateHelper.fromNow(status.serverTaskDatetime)}`;
    }

    if (status.labStatus.value === 'SERVER_STARTING') {
      return this.translateService.translate('lab_is_starting');
    }

    if (status.labStatus.value === 'SERVER_STOPPING') {
      return this.translateService.translate('lab_is_stopping');
    }

    // if all the lab containers are running but the lab is not running, it means the lab is starting
    if (managerStatus == null) return null;
    if (status.labManagerIsRunning && !status.labIsRunning && managerStatus.containersStatus?.status.value === 'UP') {
      return this.translateService.translate('lab_is_starting');
    }

    return null;
  }

  private getStatusRunningMessage(status: CaLabStatusDTO): string {
    if (status.labStatus.value === 'SERVER_STARTING') {
      return 'lab_is_starting';
    } else if (status.labStatus.value === 'SERVER_STOPPING') {
      return 'lab_is_stopping';
    }
    return 'lab_task_is_running';
  }
}
