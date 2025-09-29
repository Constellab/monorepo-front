import { Component, inject, OnInit, ViewContainerRef } from '@angular/core';
import { FlStatusEvent } from '@monorepo/front-core-lib/fl-core';
import { FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import { Observable } from 'rxjs';

import { LmlLabManagerService } from '../../lml-lab-manager.service';
import { LmlLabManagerState } from '../../lml-lab-manager.state';
import { LmlComposeInfo, LmlComposeList, LmlLabManagerStatus } from '../../model/lml-lab-manager.class';
import {
  LmlComposeDetailDialogComponent,
  LmlComposeDetailDialogData,
} from '../lml-compose-detail-dialog/lml-compose-detail-dialog.component';

/**
 * Advanced configuration for the lab manager
 */
@Component({
  selector: 'lml-manager-advanced',
  templateUrl: './lml-manager-advanced.component.html',
  styleUrls: ['./lml-manager-advanced.component.scss'],
  standalone: false,
})
export class LmlManagerAdvancedComponent implements OnInit {
  private managerState = inject(LmlLabManagerState);
  private labManagerService = inject(LmlLabManagerService);
  private dialogService = inject(FlDialogService);
  private viewContainer = inject(ViewContainerRef);

  labStatus$: Observable<LmlLabManagerStatus> = this.managerState.getStatus$();
  composes$: Observable<FlStatusEvent<LmlComposeList>> = new Observable();

  ngOnInit(): void {
    this.loadComposes();
  }

  private loadComposes(): void {
    this.composes$ = new Observable((subscriber) => {
      subscriber.next({ status: 'loading' });
      this.labManagerService.listComposes().subscribe({
        next: (composes) => subscriber.next({ status: 'success', object: composes }),
        error: (error) => subscriber.next({ status: 'error', error }),
      });
    });
  }

  refreshComposes(): void {
    this.loadComposes();
  }

  openComposeDetail(compose: LmlComposeInfo): void {
    this.dialogService.openHugeDialog(LmlComposeDetailDialogComponent, {
      data: { compose } as LmlComposeDetailDialogData,
      viewContainerRef: this.viewContainer,
    });
  }

  initAll(): void {
    this.managerState.initLab({ text: 'lml.lab_manager_initialize', translateText: true });
  }

  configureLabManager(): void {
    this.managerState.configureLabManager();
  }

  updateLabManager(): void {
    this.managerState.updateLabManager();
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
