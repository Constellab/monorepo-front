import { computed, effect, inject, Injectable, OnDestroy, signal, Signal } from '@angular/core';
import { LmsLabService } from './lms-lab.service';
import { LmlLabManagerState, LmlLabManagerStatus } from '@monorepo/lab-manager-lib';
import { catchError, of, Subscription } from 'rxjs';

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

  private _labIsStarting = computed((): boolean => {
    return (
      !this._labIsRunning() &&
      this._labManagerIsRunning() &&
      this.labManagerStatus().labManagerStatus?.containersStatus?.status.value === 'UP'
    );
  });

  private labService = inject(LmsLabService);
  private managerState = inject(LmlLabManagerState);

  private subscription: Subscription;

  private interval: any;

  private readonly AUTO_REFRESH_INTERVAL = 5000;

  constructor() {
    this.refreshStatus();
    this.subscription = this.managerState.getStatus$().subscribe((status) => this.onNewStatus(status));

    effect(() => {
      // while the lab is starting, we refresh the status every 5 seconds
      if (this.labIsStarting()) {
        this.interval = setInterval(() => this.refreshStatus(true), this.AUTO_REFRESH_INTERVAL);
      } else {
        clearInterval(this.interval);
      }
    });
  }

  public refreshStatus(skipLoading: boolean = false): void {
    this.managerState.refreshStatus(skipLoading);
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
