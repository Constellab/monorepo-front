import { AsyncPipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { ClDateHelper } from '@monorepo/core-lib';
import { FlCardModule } from '@monorepo/front-core-lib/fl-card';
import { FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import { FlIconModule } from '@monorepo/front-core-lib/fl-svg-icon';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { FlTranslateService } from '@monorepo/front-core-lib/fl-translate';
import { LmlLabManagerState, LmlLabManagerStatus } from '@monorepo/lab-manager-lib';
import { TranslatePipe } from '@ngx-translate/core';
import { combineLatest, Observable, startWith } from 'rxjs';
import { map } from 'rxjs/operators';

import { CaLabLoginButtonComponent } from '../../../../ca-core/entity-module/ca-lab-core/component/ca-lab-login-button/ca-lab-login-button.component';
import { CaLabStatusDTO } from '../../../../ca-core/model/entities/lab/ca-lab.class';
import { CaLabDetailConfigPageState } from '../../../state/ca-lab-detail-config-page.state';
import { CaLabDetailPageState } from '../../../state/ca-lab-detail-page.state';
import { CaLabServerStatusComponent } from '../../server/ca-lab-server-status/ca-lab-server-status.component';
import { CaLabCodelabInfoComponent } from '../ca-lab-codelab-info/ca-lab-codelab-info.component';
import { CaLabCurrentTaskComponent } from '../ca-lab-current-task/ca-lab-current-task.component';
import { CaLabStartStopComponent } from '../ca-lab-start-stop/ca-lab-start-stop.component';

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
    FlIconModule,
  ],
})
export class CaLabGlobalStatusComponent implements OnInit {
  private state = inject(CaLabDetailPageState);
  private configState = inject(CaLabDetailConfigPageState);
  private labManagerState = inject(LmlLabManagerState);

  private translateService = inject(FlTranslateService);
  private dialogService = inject(FlDialogService);

  status$: Observable<CaLabStatusDTO> = this.configState.getStatus$();

  isCloud$: Observable<boolean> = this.state.isCloud$();

  errors$: Observable<string[]>;

  labId: string = this.state.getLabId();

  ngOnInit(): void {
    this.errors$ = combineLatest([
      this.configState.getStatus$(),
      this.labManagerState.getStatus$().pipe(startWith(null)),
    ]).pipe(map(([status, managerStatus]) => this.getErrorStatusMessages(status, managerStatus)));
  }

  openCodelabInfo(): void {
    this.dialogService.openMediumDialog(CaLabCodelabInfoComponent, { data: this.state.getLabId() });
  }

  forceStatusRefresh(): void {
    this.state.forceStatusRefresh();
  }

  getErrorStatusMessages(status: CaLabStatusDTO, managerStatus?: LmlLabManagerStatus): string[] {
    if (status == null) return [];

    const errors: string[] = [];

    if (managerStatus) {
      // if there is no action in progress and the containers are partially up, show a warning
      if (
        !managerStatus.actionInProgress &&
        managerStatus.containersStatus?.status.value === 'PARTIALLY_UP'
      ) {
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
      errors.push(
        `${this.translateService.translate('lab_server_last_task_error')} - ${status.serverTaskText}` +
          ` - ${ClDateHelper.fromNow(status.serverTaskDatetime)}`
      );
    }
    return errors;
  }
}
