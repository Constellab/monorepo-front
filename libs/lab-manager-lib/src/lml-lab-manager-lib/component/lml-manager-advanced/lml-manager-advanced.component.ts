import { Component, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { LmlLabManagerStatus } from '../../model/lml-lab-manager.class';
import { LmlLabManagerState } from '../../lml-lab-manager.state';

/**
 * Advanced configuration for the lab manager
 */
@Component({
  selector: 'lml-manager-advanced',
  templateUrl: './lml-manager-advanced.component.html',
  styleUrls: ['./lml-manager-advanced.component.scss'],
  standalone: false,
})
export class LmlManagerAdvancedComponent {
  private managerState = inject(LmlLabManagerState);

  labStatus$: Observable<LmlLabManagerStatus> = this.managerState.getStatus$();

  initAll(): void {
    this.managerState.initLab({ text: 'lml.lab_manager_initialize', translateText: true });
  }

  configureLabManager(): void {
    this.managerState.configureLabManager();
  }

  updateLabManager(): void {
    this.managerState.updateLabManager();
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
