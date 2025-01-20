import { Component, inject, OnInit } from '@angular/core';
import { CaLabDetailPageState } from '../../../state/ca-lab-detail-page.state';
import { Observable } from 'rxjs';
import { CaLabStatusDTO } from '../../../../ca-core/model/entities/lab/ca-lab.class';
import { FlTranslateService } from '@monorepo/front-core-lib';
import { ClDateHelper } from '@monorepo/core-lib';
import { map } from 'rxjs/operators';
import { LmlLabManagerStatus } from '@monorepo/lab-manager-lib';

/**
 * Component to show global information about the lab status
 */
@Component({
    selector: 'ca-lab-global-status',
    templateUrl: './ca-lab-global-status.component.html',
    styleUrls: ['./ca-lab-global-status.component.scss'],
    standalone: false
})
export class CaLabGlobalStatusComponent implements OnInit {
  private state = inject(CaLabDetailPageState);
  private translateService = inject(FlTranslateService);

  status$: Observable<CaLabStatusDTO> = this.state.getStatus$();

  isCloud$: Observable<boolean> = this.state.isCloud$();

  errors$: Observable<string[]>;

  labId: string = this.state.getLabId();

  ngOnInit(): void {
    this.errors$ = this.state
      .getFullStatus$()
      .pipe(map(([status, managerStatus]) => this.getErrorStatusMessages(status, managerStatus)));
  }

  forceStatusRefresh(): void {
    this.state.forceStatusRefresh();
  }

  getErrorStatusMessages(status: CaLabStatusDTO, managerStatus?: LmlLabManagerStatus): string[] {
    if (status == null) return [];

    const errors: string[] = [];

    if (managerStatus) {
      if (managerStatus.containersStatus?.status.value === 'PARTIALLY_UP') {
        errors.push(this.translateService.translate('lab_containers_partially_up_warning'));
      }

      if (
        managerStatus.containersStatus?.status.value === 'DOWN' ||
        managerStatus.containersStatus?.status.value === 'STOP'
      ) {
        errors.push(this.translateService.translate('lab_containers_down_warning'));
      }
    }

    if (status.serverTaskStatus.value === 'ERROR') {
      // eslint-disable-next-line max-len
      errors.push(
        `${this.translateService.translate('lab_server_last_task_error')} - ${status.serverTaskText}` +
          ` - ${ClDateHelper.fromNow(status.serverTaskDatetime)}`
      );
    }
    return errors;
  }
}
