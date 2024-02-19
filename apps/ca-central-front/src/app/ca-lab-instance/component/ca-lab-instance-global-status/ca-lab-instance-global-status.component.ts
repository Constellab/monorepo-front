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

    this.errors$ = obs.pipe(
      map(([status, managerStatus]) => this.getErrorStatusMessages(status, managerStatus))
    );
  }

  forceStatusRefresh(): void {
    this.state.forceStatusRefresh();
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
