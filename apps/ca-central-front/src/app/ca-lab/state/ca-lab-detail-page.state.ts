import { inject, Injectable, OnDestroy } from '@angular/core';
import { CaLabService } from '../../ca-core/service-api/ca-lab.service';
import { BehaviorSubject, combineLatest, filter, Observable, startWith } from 'rxjs';
import {
  CaLab,
  CaLabFindOneDto,
  CaLabStatusDTO,
  caLabStatusTemp,
} from '../../ca-core/model/entities/lab/ca-lab.class';
import { map } from 'rxjs/operators';
import { CaAuthenticatedUserService } from '../../ca-core/service-api/ca-authenticated-user.service';
import { CaLabUserRole } from '../../ca-core/model/entities/lab/ca-lab-user.class';
import { FlPortalActionsService } from '@monorepo/front-core-lib';
import { LmlLabManagerStatus } from '@monorepo/lab-manager-lib';
import { ClSubscriptionHandler } from '@monorepo/core-lib';

/**
 * State for the lab detail page.
 */
@Injectable()
export class CaLabDetailPageState implements OnDestroy {
  public static readonly actionType = 'CaLabDetailPageState';

  private labService = inject(CaLabService);
  private authenticatedUserService = inject(CaAuthenticatedUserService);
  private portalService = inject(FlPortalActionsService);
  private lab$: BehaviorSubject<CaLab>;
  private userRole$: BehaviorSubject<CaLabUserRole>;
  private status$: BehaviorSubject<CaLabStatusDTO>;

  private id: string;

  private timeout: any;
  private statusRefreshFrequency = 15000;

  private subscriptions = new ClSubscriptionHandler();

  private labManagerStatus$: Observable<LmlLabManagerStatus>;

  public init(id: string, labManagerStatus$: Observable<LmlLabManagerStatus>): void {
    this.id = id;
    this.lab$ = new BehaviorSubject(null);
    this.userRole$ = new BehaviorSubject(null);
    this.labService.findById(id).subscribe({
      next: (lab) => this.getLabSuccess(lab),
      error: (error) => this.getLabError(error),
    });

    this.status$ = new BehaviorSubject(null);
    this.refreshStatus();

    this.subscriptions.add(
      this.portalService
        .getResult$(CaLabDetailPageState.actionType)
        .subscribe((result) => this.refreshStatus(result.result))
    );

    this.labManagerStatus$ = labManagerStatus$;
    this.subscriptions.add(this.getStatus$().subscribe((status) => this.onNewStatus(status)));
    this.subscriptions.add(this.labManagerStatus$.subscribe((status) => this.onNewLabManagerStatus(status)));
  }

  private getLabSuccess(lab: CaLabFindOneDto): void {
    this.lab$.next(lab.lab);
    this.userRole$.next(lab.userRole);
  }

  private getLabError(error: any): void {
    this.lab$.error(error);
    this.userRole$.error(error);
  }

  public refreshStatus(object?: CaLabStatusDTO): void {
    // clear the timeout if exist to avoid duplicates
    this.clearTimeout();

    if (object && object instanceof CaLabStatusDTO) {
      this.status$.next(object);
    } else {
      // otherwise, request the status
      this.labService.getStatus(this.id).subscribe({
        next: (status) => this.status$.next(status),
        error: (error) => this.status$.error(error),
      });
    }
  }

  public getFullStatus$(): Observable<[CaLabStatusDTO, LmlLabManagerStatus]> {
    return combineLatest([this.getStatus$(), this.labManagerStatus$.pipe(startWith(null))]);
  }

  public getLab$(): Observable<CaLab> {
    return this.lab$.asObservable().pipe(filter((lab) => lab != null));
  }

  public getCurrentUserRole$(): Observable<CaLabUserRole> {
    return this.userRole$.asObservable().pipe(filter((userRole) => userRole != null));
  }

  public getStatus$(): Observable<CaLabStatusDTO> {
    return this.status$.asObservable().pipe(filter((status) => status != null));
  }

  ngOnDestroy(): void {
    this.lab$?.complete();
    this.userRole$?.complete();
    this.status$?.complete();
    this.subscriptions?.unsubscribe();
    this.clearTimeout();
  }

  /**
   * return true if the user is an owner of the lab or an admin
   */
  public isLabOwner$(): Observable<boolean> {
    return this.getCurrentUserRole$().pipe(
      map((role) => role === 'OWNER' || this.authenticatedUserService.isCurrentSpaceAdmin())
    );
  }

  /**
   * return true if the lab is on cloud
   */
  public isCloud$(): Observable<boolean> {
    return this.getLab$().pipe(map((lab) => lab.isCloud));
  }

  /**
   * return true if the lab is on desktop
   */
  public isDesktop$(): Observable<boolean> {
    return this.getLab$().pipe(map((lab) => lab.isDesktop));
  }

  /**
   * return true if the lab is accessible through http (for cloud and public on premise)
   */
  public isHttpAccessible$(): Observable<boolean> {
    return this.getLab$().pipe(map((lab) => lab.isHttpAccessible));
  }

  public labIsRunning$(): Observable<boolean> {
    return this.getStatus$().pipe(map((status) => status.labIsRunning));
  }

  public updateLab(lab: CaLab): void {
    this.lab$.next(lab);
    this.refreshStatus();
  }

  public getLabId(): string {
    return this.id;
  }

  refreshLab(): void {
    this.labService.findById(this.getLabId()).subscribe({
      next: (lab) => this.updateLab(lab.lab),
      error: (error) => this.lab$.error(error),
    });
  }

  forceStatusRefresh(): void {
    this.portalService.addAction({
      type: CaLabDetailPageState.actionType,
      text: { text: 'refresh_status', translateText: true },
      action: this.labService.refreshStatus(this.getLabId()),
    });
  }

  private clearTimeout(): void {
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }
  }

  /**
   * Methode called when a new status is received to trigger the next status refresh if needed
   * @param status
   * @private
   */
  private onNewStatus(status: CaLabStatusDTO): void {
    // clear the timeout if exist to avoid duplicates
    this.clearTimeout();

    // if the lab is busy, refresh the status every 10 seconds
    if (caLabStatusTemp.includes(status.labStatus.value) || status.serverTaskStatus.value === 'RUNNING') {
      this.timeout = setTimeout(() => this.refreshStatus(), this.statusRefreshFrequency);
    }
  }

  /**
   * Methode called when a new lab manager status is received to trigger the next status refresh if
   * the lab running status is different from the lab manager status
   * @param labManagerStatus
   * @private
   */
  private onNewLabManagerStatus(labManagerStatus: LmlLabManagerStatus): void {
    const labManagerLabIsRunning = labManagerStatus?.labStatus === 'RUNNING';

    const currentStatus = this.status$.getValue();
    if (!currentStatus) return;

    // if the lab running status is different from the lab manager status, refresh the status immediately
    if (currentStatus.labIsRunning !== labManagerLabIsRunning) {
      this.refreshStatus();
    }
  }
}
