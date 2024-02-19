import {Component, Input, OnInit} from '@angular/core';
import {combineLatest, Observable, startWith} from 'rxjs';
import {CaLabInstanceDetailPageState} from '../../state/ca-lab-instance-detail-page.state';
import {CaLabInstanceDetailManagerState} from '../../state/ca-lab-instance-detail-manager.state';
import {FlTranslateService} from '@monorepo/front-core-lib';
import {map} from 'rxjs/operators';
import {CaLabInstanceStatusDTO} from '../../../ca-core/model/entities/lab/ca-lab-instance.class';
import {CaLabManagerStatus} from '../../../ca-core/model/entities/lab/ca-lab-manager.class';
import {ClDateHelper} from '@monorepo/core-lib';
import {CaRouterService} from '../../../ca-core/service/ca-router.service';

/**
 * Component to show the current running task of the lab instance
 */
@Component({
  selector: 'ca-lab-instance-current-task',
  templateUrl: './ca-lab-instance-current-task.component.html',
  styleUrl: './ca-lab-instance-current-task.component.scss'
})
export class CaLabInstanceCurrentTaskComponent implements OnInit {

  /**
   * If true the text is a link to open the lab configuration will be shown
   */
  @Input() showConfigRouteLink: boolean = false;

  currentTask$: Observable<string>;

  configRoute: string;

  constructor(private state: CaLabInstanceDetailPageState,
              private managerState: CaLabInstanceDetailManagerState,
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

    this.configRoute = CaRouterService.getLabInstanceConfigRoute(this.state.getLabInstanceId());
  }

  getRunningTaskMessage(status: CaLabInstanceStatusDTO, managerStatus?: CaLabManagerStatus): string {
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

  private getStatusRunningMessage(status: CaLabInstanceStatusDTO): string {
    if (status.labStatus.value === 'SERVER_STARTING') {
      return 'lab_is_starting';
    } else if (status.labStatus.value === 'SERVER_STOPPING') {
      return 'lab_is_stopping';
    }
    return 'lab_task_is_running';
  }
}
