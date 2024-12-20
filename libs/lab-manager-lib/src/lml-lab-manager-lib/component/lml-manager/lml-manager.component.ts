import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { FlStatusEvent } from '@monorepo/front-core-lib';
import { LmlLabManagerState } from '../../lml-lab-manager.state';
import { ClSubscriptionHandler } from '@monorepo/core-lib';
import { LmlNewVersionAvailable } from '../../model/lml-lab-manager.class';
import { LmlLabManagerService } from '../../lml-lab-manager.service';

/**
 * Component only accessible by the admin
 * LmlLabManagerService must be provided
 */
@Component({
  selector: 'lml-manager',
  templateUrl: './lml-manager.component.html',
  styleUrls: ['./lml-manager.component.scss'],
})
export class LmlManagerComponent implements OnInit, OnDestroy {
  private managerState = inject(LmlLabManagerState);
  private managerService = inject(LmlLabManagerService);
  labManagerStatus$: Observable<FlStatusEvent>;

  newLabManagerVersion$: Observable<LmlNewVersionAvailable>;

  refreshIsLoading: boolean = false;

  private subscriptions = new ClSubscriptionHandler();

  ngOnInit(): void {
    this.managerState.init();

    this.labManagerStatus$ = this.managerState.getStatusEvent$();
    this.newLabManagerVersion$ = this.managerState.getNewLabManagerVersion$();

    this.subscriptions.add(
      this.managerState.getStatusEvent$().subscribe((statusEvent) => {
        if (statusEvent.status === 'success' || statusEvent.status === 'error') {
          this.refreshIsLoading = false;
        }
      })
    );
  }

  refresh(): void {
    this.refreshIsLoading = true;
    this.managerState.refreshStatus();
  }

  updateLabManager(version: LmlNewVersionAvailable): void {
    this.managerService.updateLabManager(version);
  }

  ngOnDestroy(): void {
    this.subscriptions?.unsubscribe();
  }
}
