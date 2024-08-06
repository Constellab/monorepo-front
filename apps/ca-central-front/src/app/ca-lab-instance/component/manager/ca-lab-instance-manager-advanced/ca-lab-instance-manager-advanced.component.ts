import { Component, OnInit } from '@angular/core';
import { CaLabInstanceDetailManagerState } from '../../../state/ca-lab-instance-detail-manager.state';
import { Observable } from 'rxjs';
import { CaLabManagerStatus } from '../../../../ca-core/model/entities/lab/ca-lab-manager.class';


/**
 * Advanced configuration for the lab manager
 */
@Component({
  selector: 'ca-lab-instance-manager-advanced',
  templateUrl: './ca-lab-instance-manager-advanced.component.html',
  styleUrls: ['./ca-lab-instance-manager-advanced.component.scss']
})
export class CaLabInstanceManagerAdvancedComponent implements OnInit {

  labStatus$: Observable<CaLabManagerStatus> = this.managerState.getStatus$();

  constructor(private managerState: CaLabInstanceDetailManagerState) {
  }

  ngOnInit(): void {
  }

  initAll(): void {
    this.managerState.initAll({text: 'lab_manager_initialize', translateText: true});
  }

  configureLabManager(): void {
    this.managerState.configureLabManager();
  }

  upContainers(): void {
    this.managerState.upContainers();
  }

  restartContainers(): void {
    this.managerState.restartContainers();
  }

  stopContainers(): void {
    this.managerState.stopContainers();
  }

  deleteContainers(): void {
    this.managerState.deleteContainers();
  }

  pullContainers(): void {
    this.managerState.pullContainers();
  }

  pullBiotaDb(): void {
    this.managerState.pullBiotaDb();
  }

  stopCurrentTask(): void {
    this.managerState.stopCurrentTask();
  }

  systemPrune(): void {
    this.managerState.systemPrune();
  }

  startAdminer(): void {
    this.managerState.startAdminer();
  }

  stopAdminer(): void {
    this.managerState.stopAdminer();
  }

}
