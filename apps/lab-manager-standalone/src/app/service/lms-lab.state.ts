import { computed, inject, Injectable, OnDestroy, Signal,signal } from '@angular/core';
import { LmlLabManagerState, LmlLabManagerStatus } from '@monorepo/lab-manager-lib';
import { catchError, of, Subscription } from 'rxjs';

import { LmsLabService } from './lms-lab.service';

export interface LmsLabStatus {
  labManagerIsConfigured: boolean;
  brickAreConfigured: boolean;
  labManagerStatus?: LmlLabManagerStatus;
}

@Injectable()
export class LmsLabState implements OnDestroy {
  private _labIsRunning = signal<boolean>(false);
  private _labManagerIsRunning = signal<boolean>(false);
  private _labManagerStatus = signal<LmsLabStatus>({
    labManagerIsConfigured: false,
    brickAreConfigured: false,
  });

  private _labIsStarting = computed(
    (): boolean => this._labManagerStatus().labManagerStatus?.labStatus === 'STARTING'
  );

  private labService = inject(LmsLabService);
  private managerState = inject(LmlLabManagerState);

  private subscription: Subscription;

  constructor() {
    this.refreshStatus();
    this.subscription = this.managerState.getStatus$().subscribe((status) => this.onNewStatus(status));
  }

  public refreshStatus(): void {
    this.managerState.refreshStatus();
  }

  private onNewStatus(labManagerStatus: LmlLabManagerStatus): void {
    this.getLabIsRunning();
    this.getLabManagerIsRunning();
    this._labManagerStatus.set({
      labManagerStatus,
      labManagerIsConfigured: labManagerStatus?.isInitialized ?? false,
      brickAreConfigured: labManagerStatus?.isConfigured ?? false,
    });
  }

  private getLabIsRunning(): void {
    this.labService
      .labIsRunning()
      .pipe(catchError(() => of(false)))
      .subscribe((isRunning) => this._labIsRunning.set(isRunning));
  }

  private getLabManagerIsRunning(): void {
    this.labService
      .labManagerIsRunning()
      .pipe(catchError(() => of(false)))
      .subscribe((isRunning) => this._labManagerIsRunning.set(isRunning));
  }

  public get labManagerStatus(): Signal<LmsLabStatus> {
    return this._labManagerStatus;
  }

  public get labIsRunning(): Signal<boolean> {
    return this._labIsRunning;
  }

  public get labManagerIsRunning(): Signal<boolean> {
    return this._labManagerIsRunning;
  }

  public get labIsStarting(): Signal<boolean> {
    return this._labIsStarting;
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
