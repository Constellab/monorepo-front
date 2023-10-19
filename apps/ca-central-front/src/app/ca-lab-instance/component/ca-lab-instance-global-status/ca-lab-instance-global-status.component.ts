import {Component, OnInit} from '@angular/core';
import {CaLabInstanceDetailPageState} from '../../state/ca-lab-instance-detail-page.state';
import {combineLatest, Observable, startWith} from 'rxjs';
import {CaLabInstanceStatusDTO} from '../../../ca-core/model/entities/lab/ca-lab-instance.class';
import {CaLabManagerStatus} from '../../../ca-core/model/entities/lab/ca-lab-manager.class';
import {FlTranslateService} from '@monorepo/front-core-lib';
import {ClDateHelper} from '@monorepo/core-lib';
import {CaLabInstanceDetailManagerState} from '../../state/ca-lab-instance-detail-manager.state';
import {map} from 'rxjs/operators';

/**
 * Component to show global information about the lab instance status
 */
@Component({
  selector: 'ca-lab-instance-global-status',
  templateUrl: './ca-lab-instance-global-status.component.html',
  styleUrls: ['./ca-lab-instance-global-status.component.scss']
})
export class CaLabInstanceGlobalStatusComponent implements OnInit {

  status$: Observable<CaLabInstanceStatusDTO> = this.state.getStatus$();

  isCloud$: Observable<boolean> = this.state.isCloud$();

  currentTask$: Observable<string>;
  errors$: Observable<string[]>;


  labInstanceId: string = this.state.getLabInstanceId();

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
      map(([status, managerStatus]) => this.getRunningTaskMessage(status, managerStatus))
    );

    this.errors$ = obs.pipe(
      map(([status, managerStatus]) => this.getErrorStatusMessages(status, managerStatus))
    );
  }

  forceStatusRefresh(): void {
    this.state.forceStatusRefresh();
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

  getErrorStatusMessages(status: CaLabInstanceStatusDTO, managerStatus?: CaLabManagerStatus): string[] {
    if (status == null) return [];

    const errors: string[] = [];

    if (managerStatus) {
      if (managerStatus.containersStatus?.status.value === 'PARTIALLY_UP') {
        errors.push(this.translateService.translate('lab_containers_partially_up_warning'));
      }

      if (managerStatus.containersStatus?.status.value === 'DOWN' || managerStatus.containersStatus?.status.value === 'STOP') {
        errors.push(this.translateService.translate('lab_containers_down_warning'));
      }
    }

    if (status.serverTaskStatus.value === 'ERROR') {
      // eslint-disable-next-line max-len
      errors.push(`${this.translateService.translate('lab_server_last_task_error')} - ${status.serverTaskText} - ${ClDateHelper.fromNow(status.serverTaskDatetime)}`);
    }
    return errors;
  }

}
