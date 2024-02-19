import {Component} from '@angular/core';
import {CaLabInstanceDetailPageState} from '../../../state/ca-lab-instance-detail-page.state';
import {Observable} from 'rxjs';
import {CaLabInstanceStatusDTO} from '../../../../ca-core/model/entities/lab/ca-lab-instance.class';
import {CaLabInstanceDetailServerState} from '../../../state/ca-lab-instance-detail-server.state';


@Component({
  selector: 'ca-lab-instance-server',
  templateUrl: './ca-lab-instance-server.component.html',
  styleUrls: ['./ca-lab-instance-server.component.scss']
})
export class CaLabInstanceServerComponent {

  status$: Observable<CaLabInstanceStatusDTO> = this.state.getStatus$();

  isCloud$: Observable<boolean> = this.state.isCloud$();


  constructor(private state: CaLabInstanceDetailPageState,
              private serverState: CaLabInstanceDetailServerState) {
  }

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

  updateDockerlabRepo(): void {
    this.serverState.updateDockerlabRepo();
  }

  deleteServer(): void {
    this.serverState.deleteServer();
  }

  stopCurrentServerTask(): void {
    this.serverState.stopCurrentServerTask();
  }
}
