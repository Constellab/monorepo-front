import { Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { FlStatusEvent } from '@monorepo/front-core-lib/fl-core';
import { LmlLabManagerState } from '../../lml-lab-manager.state';
import { ClSubscriptionHandler } from '@monorepo/core-lib';

/**
 * Component only accessible by the admin
 * LmlLabManagerService must be provided
 */
@Component({
    selector: 'lml-manager',
    templateUrl: './lml-manager.component.html',
    styleUrls: ['./lml-manager.component.scss'],
    standalone: false
})
export class LmlManagerComponent implements OnInit, OnDestroy {


  @Input() autoRefreshStatusFrequency: number;

  private managerState = inject(LmlLabManagerState);
  labManagerStatus$: Observable<FlStatusEvent>;

  newLabManagerVersionAvailable$: Observable<boolean>;

  refreshIsLoading: boolean = false;

  private subscriptions = new ClSubscriptionHandler();

  ngOnInit(): void {
    this.managerState.init(this.autoRefreshStatusFrequency);

    this.labManagerStatus$ = this.managerState.getStatusEvent$();
    this.newLabManagerVersionAvailable$ = this.managerState.newLabManagerVersionAvailable$();

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

  updateLabManager(): void {
    this.managerState.updateLabManager();
  }

  ngOnDestroy(): void {
    this.subscriptions?.unsubscribe();
  }
}
