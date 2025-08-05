import { inject, Injectable, OnDestroy } from '@angular/core';
import { ClSubscriptionHandler } from '@monorepo/core-lib';
import { BehaviorSubject, filter, Observable } from 'rxjs';

import { CaLabBusyStatusDTO, CaLabStatusDTO } from '../../ca-core/model/entities/lab/ca-lab.class';
import { CaLabService } from '../../ca-core/service-api/ca-lab.service';
import { CaLabDetailPageState } from './ca-lab-detail-page.state';

/**
 * State for the lab detail configuration page.
 * It contains a more detail status of the lab.
 */
@Injectable()
export class CaLabDetailConfigPageState implements OnDestroy {
  private state = inject(CaLabDetailPageState);
  private labService = inject(CaLabService);

  private status$: BehaviorSubject<CaLabStatusDTO>;

  private subscriptions = new ClSubscriptionHandler();

  public init(): void {
    if (this.status$ != null) return; // already initialized
    this.status$ = new BehaviorSubject<CaLabStatusDTO>(null);
    // refresh status when the busy status changes
    this.subscriptions.add(
      this.state.getBusyStatus$().subscribe((busyStatus) => this.refreshStatus(busyStatus))
    );
  }

  private refreshStatus(busyStatus: CaLabBusyStatusDTO): void {
    this.labService.getStatus(busyStatus.id).subscribe({
      next: (status) => this.status$.next(status),
      error: (error) => this.status$.error(error),
    });
  }

  public getStatus$(): Observable<CaLabStatusDTO> {
    return this.status$.asObservable().pipe(filter((status) => status != null));
  }

  ngOnDestroy(): void {
    this.status$?.complete();
    this.subscriptions?.unsubscribe();
  }
}
