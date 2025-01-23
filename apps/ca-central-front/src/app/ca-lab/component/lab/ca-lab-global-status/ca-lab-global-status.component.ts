import { Component, inject, OnInit } from '@angular/core';
import { CaLabDetailPageState } from '../../../state/ca-lab-detail-page.state';
import { Observable } from 'rxjs';
import { CaLabStatusDTO } from '../../../../ca-core/model/entities/lab/ca-lab.class';
import { FlTranslateService } from '@monorepo/front-core-lib/fl-translate';
import { ClDateHelper } from '@monorepo/core-lib';
import { map } from 'rxjs/operators';
import { LmlLabManagerStatus } from '@monorepo/lab-manager-lib';
import { FlCardModule } from '@monorepo/front-core-lib/fl-card';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import { CaLabCurrentTaskComponent } from '../ca-lab-current-task/ca-lab-current-task.component';
import { CaLabServerStatusComponent } from '../../server/ca-lab-server-status/ca-lab-server-status.component';
import {
  CaLabLoginButtonComponent,
} from '../../../../ca-core/entity-module/ca-lab-core/component/ca-lab-login-button/ca-lab-login-button.component';
import { CaLabStartStopComponent } from '../ca-lab-start-stop/ca-lab-start-stop.component';
import { AsyncPipe } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';

/**
 * Component to show global information about the lab status
 */
@Component({
  selector: 'ca-lab-global-status',
  templateUrl: './ca-lab-global-status.component.html',
  styleUrls: ['./ca-lab-global-status.component.scss'],
  imports: [
    FlCardModule,
    FlTextIconModule,
    MatIcon,
    MatButton,
    CaLabCurrentTaskComponent,
    CaLabServerStatusComponent,
    CaLabLoginButtonComponent,
    CaLabStartStopComponent,
    AsyncPipe,
    TranslatePipe,
  ],
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
