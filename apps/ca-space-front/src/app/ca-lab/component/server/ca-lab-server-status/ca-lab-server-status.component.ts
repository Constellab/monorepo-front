import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { TranslatePipe } from '@ngx-translate/core';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { CaLabBusyStatusDTO, CaLabStatusDTO } from '../../../../ca-core/model/entities/lab/ca-lab.class';
import { CaLabDetailConfigPageState } from '../../../state/ca-lab-detail-config-page.state';
import { CaLabDetailPageState } from '../../../state/ca-lab-detail-page.state';
import { CaLabDetailServerState } from '../../../state/ca-lab-detail-server.state';

type CaServerStatus =
  | 'SERVER_NOT_CREATED'
  | 'DNS_NOT_CONFIGURED'
  | 'LAB_MANAGER_NOT_AVAILABLE'
  | 'LAB_NOT_AVAILABLE'
  | 'LAB_RUNNING';

@Component({
  selector: 'ca-lab-server-status',
  templateUrl: './ca-lab-server-status.component.html',
  styleUrls: ['./ca-lab-server-status.component.scss'],
  imports: [MatButton, AsyncPipe, TranslatePipe],
})
export class CaLabServerStatusComponent {
  private serverState = inject(CaLabDetailServerState);

  status$: Observable<CaServerStatus> = combineLatest([
    inject(CaLabDetailPageState).getBusyStatus$(),
    inject(CaLabDetailConfigPageState).getStatus$(),
  ]).pipe(map(([busyStatus, status]) => this.convertStatusMessage(busyStatus, status)));

  private convertStatusMessage(busyStatus: CaLabBusyStatusDTO, status: CaLabStatusDTO): CaServerStatus {
    // If the lab is busy, we don't want to show any status message
    if (busyStatus.isBusy) return null;
    if (!status.hasServerInstanceId || !status.hasServerVolumeId) {
      return 'SERVER_NOT_CREATED';
    } else if (!status.dnsConfigured) {
      return 'DNS_NOT_CONFIGURED';
    } else if (!status.labManagerIsRunning) {
      return 'LAB_MANAGER_NOT_AVAILABLE';
    } else if (!status.labIsRunning) {
      return 'LAB_NOT_AVAILABLE';
    } else {
      return null;
    }
  }

  initServer(): void {
    this.serverState.initServer();
  }

  configureServer(): void {
    this.serverState.configureServer();
  }

  moveToLabManager(): void {
    if (document) {
      const element = document.getElementById('lab-manager');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }
}
