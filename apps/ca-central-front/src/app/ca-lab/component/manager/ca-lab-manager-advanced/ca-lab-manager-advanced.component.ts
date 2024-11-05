import { Component, OnInit } from '@angular/core';
import { CaLabDetailManagerState } from '../../../state/ca-lab-detail-manager.state';
import { Observable } from 'rxjs';
import { CaLabManagerStatus } from '../../../../ca-core/model/entities/lab/ca-lab-manager.class';

/**
 * Advanced configuration for the lab manager
 */
@Component({
  selector: 'ca-lab-manager-advanced',
  templateUrl: './ca-lab-manager-advanced.component.html',
  styleUrls: ['./ca-lab-manager-advanced.component.scss'],
})
export class CaLabManagerAdvancedComponent implements OnInit {
  labStatus$: Observable<CaLabManagerStatus> = this.managerState.getStatus$();

  constructor(private managerState: CaLabDetailManagerState) {}

  ngOnInit(): void {}

  initAll(): void {
    this.managerState.initAll({ text: 'lab_manager_initialize', translateText: true });
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
