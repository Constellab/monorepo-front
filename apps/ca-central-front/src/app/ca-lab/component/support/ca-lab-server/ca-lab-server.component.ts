import { Component } from '@angular/core';
import { CaLabDetailPageState } from '../../../state/ca-lab-detail-page.state';
import { Observable } from 'rxjs';
import { CaLabStatusDTO } from '../../../../ca-core/model/entities/lab/ca-lab.class';
import { CaLabDetailServerState } from '../../../state/ca-lab-detail-server.state';

@Component({
  selector: 'ca-lab-server',
  templateUrl: './ca-lab-server.component.html',
  styleUrls: ['./ca-lab-server.component.scss'],
})
export class CaLabServerComponent {
  status$: Observable<CaLabStatusDTO> = this.state.getStatus$();

  isCloud$: Observable<boolean> = this.state.isCloud$();

  constructor(
    private state: CaLabDetailPageState,
    private serverState: CaLabDetailServerState
  ) {}

  openServerInfoDialog(): void {
    this.serverState.openServerInfoDialog();
  }

  initServer(): void {
    this.serverState.initServer();
  }

  createServer(): void {
    this.serverState.createServer();
  }

  configureServer(): void {
    this.serverState.configureServer();
  }

  updateLabConfigurerRepo(): void {
    this.serverState.updateLabConfigurerRepo();
  }

  destroyLabConfigurerContainers(): void {
    this.serverState.destroyLabConfigurerContainers();
  }

  migrateToGithub(): void {
    this.serverState.migrateToGithub();
  }

  deleteServer(): void {
    this.serverState.deleteServer();
  }

  stopCurrentServerTask(): void {
    this.serverState.stopCurrentServerTask();
  }
}
