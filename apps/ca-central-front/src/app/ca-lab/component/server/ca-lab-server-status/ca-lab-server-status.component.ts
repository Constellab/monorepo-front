import { Component, OnInit } from '@angular/core';
import { CaLabDetailPageState } from '../../../state/ca-lab-detail-page.state';
import { Observable } from 'rxjs';
import { CaLabStatusDTO } from '../../../../ca-core/model/entities/lab/ca-lab.class';
import { map } from 'rxjs/operators';
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
})
export class CaLabServerStatusComponent implements OnInit {
  status$: Observable<CaServerStatus>;

  labId: string = this.state.getLabId();

  constructor(
    private state: CaLabDetailPageState,
    private serverState: CaLabDetailServerState
  ) {}

  ngOnInit(): void {
    this.status$ = this.state.getStatus$().pipe(map((status) => this.convertStatusMessage(status)));
  }

  private convertStatusMessage(status: CaLabStatusDTO): CaServerStatus {
    if (!status.hasServerInstanceId || !status.hasServerVolumeId) {
      return 'SERVER_NOT_CREATED';
    } else if (!status.dnsConfigured) {
      return 'DNS_NOT_CONFIGURED';
    } else if (!status.labManagerIsRunning) {
      return 'LAB_MANAGER_NOT_AVAILABLE';
    } else if (!status.labIsRunning) {
      return 'LAB_NOT_AVAILABLE';
    } else {
      return 'LAB_RUNNING';
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
