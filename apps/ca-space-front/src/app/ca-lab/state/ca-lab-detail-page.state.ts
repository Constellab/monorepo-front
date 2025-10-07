import { inject, Injectable, OnDestroy } from '@angular/core';
import { ClSubscriptionHandler } from '@monorepo/core-lib';
import { FlPortalActionsService } from '@monorepo/front-core-lib/fl-portal-actions';
import { FlStatus } from '@monorepo/front-core-lib/fl-status';
import { LmlLabManagerStatus } from '@monorepo/lab-manager-lib';
import { BehaviorSubject, filter, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import {
  CaLab,
  CaLabBusyStatusDTO,
  CaLabFindOneDto,
  CaLabSimpleStatusDTO,
  CaLabStatus,
} from '../../ca-core/model/entities/lab/ca-lab.class';
import { CaLabUserRole } from '../../ca-core/model/entities/lab/ca-lab-user.class';
import { CaAuthenticatedUserService } from '../../ca-core/service-api/ca-authenticated-user.service';
import { CaLabService } from '../../ca-core/service-api/ca-lab.service';

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
  private status$: BehaviorSubject<CaLabSimpleStatusDTO>;
  private busyStatus$: BehaviorSubject<CaLabBusyStatusDTO>;

  private id: string;

  private timeout: any;
  private statusRefreshFrequency = 10000;

  private subscriptions = new ClSubscriptionHandler();

  public init(id: string, labManagerStatus$: Observable<LmlLabManagerStatus>): void {
    this.id = id;
    this.lab$ = new BehaviorSubject(null);
    this.userRole$ = new BehaviorSubject(null);
    this.labService.findById(id).subscribe({
      next: (lab) => this.getLabSuccess(lab),
      error: (error) => this.getLabError(error),
    });

    this.status$ = new BehaviorSubject(null);
    this.busyStatus$ = new BehaviorSubject(null);
    this.refreshStatus();

    this.subscriptions.add(
      this.portalService.getResult$(CaLabDetailPageState.actionType).subscribe(() => this.refreshStatus())
    );

    this.subscriptions.add(labManagerStatus$.subscribe((status) => this.onNewLabManagerStatus(status)));
  }

  private getLabSuccess(lab: CaLabFindOneDto): void {
    this.lab$.next(lab.lab);
    this.userRole$.next(lab.userRole);
    this.setSimpleStatus(lab.lab.currentStatus.status);
  }

  private getLabError(error: any): void {
    this.lab$.error(error);
    this.userRole$.error(error);
  }

  /**
   * Refreshes the lab status.
   * @param ignoreNotBusyCount When true, ignores the not busy count
   * and stops refreshing immediately if not busy.
   */
  private refreshStatus(): void {
    // clear the timeout if exist to avoid duplicates
    this.clearTimeout();

    // otherwise, request the status
    this.labService.getBusyStatus(this.id).subscribe({
      next: (status) => this.onNewBusyStatus(status),
      error: (error) => this.status$.error(error),
    });
  }

  /**
   * Methode called when a new status is received to trigger the next status refresh if needed
   * @param status
   * @private
   */
  private onNewBusyStatus(status: CaLabBusyStatusDTO): void {
    this.busyStatus$.next(status);
    this.setSimpleStatus(status.labStatus);
    // clear the timeout if exist to avoid duplicates
    this.clearTimeout();

    if (status.isBusy) {
      // Reset counter when busy
      this.timeout = setTimeout(() => this.refreshStatus(), this.statusRefreshFrequency);
    }
  }

  private setSimpleStatus(labStatus: FlStatus<CaLabStatus>): void {
    const simpleStatus = new CaLabSimpleStatusDTO(labStatus);
    this.status$.next(simpleStatus);
  }

  public getLab$(): Observable<CaLab> {
    return this.lab$.asObservable().pipe(filter((lab) => lab != null));
  }

  public getCurrentUserRole$(): Observable<CaLabUserRole> {
    return this.userRole$.asObservable().pipe(filter((userRole) => userRole != null));
  }

  public getSimpleStatus$(): Observable<CaLabSimpleStatusDTO> {
    return this.status$.asObservable().pipe(filter((status) => status != null));
  }

  public getBusyStatus$(): Observable<CaLabBusyStatusDTO> {
    return this.busyStatus$.asObservable().pipe(filter((busyStatus) => busyStatus != null));
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
    return this.getLab$().pipe(map((lab) => lab.typeObj.isCloud));
  }

  public isFreeLab$(): Observable<boolean> {
    return this.getLab$().pipe(map((lab) => lab.isFreeLab));
  }

  /**
   * return true if the lab is on desktop
   */
  public isDesktop$(): Observable<boolean> {
    return this.getLab$().pipe(map((lab) => lab.typeObj.isDesktop));
  }

  /**
   * return true if the lab is accessible through http (for cloud and public on premise)
   */
  public isHttpAccessible$(): Observable<boolean> {
    return this.getLab$().pipe(map((lab) => lab.typeObj.isHttpAccessible));
  }

  public labIsRunning$(): Observable<boolean> {
    return this.getSimpleStatus$().pipe(map((status) => status.labIsRunning()));
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
   * Methode called when a new lab manager status is received to trigger the next status refresh if
   * the lab running status is different from the lab manager status
   * @param labManagerStatus
   * @private
   */
  private onNewLabManagerStatus(labManagerStatus: LmlLabManagerStatus): void {
    const busyStatus = this.busyStatus$.getValue();

    // if the lab running status is different from the lab manager status, refresh the status immediately
    if (labManagerStatus.actionInProgress !== busyStatus.isBusy) {
      this.refreshStatus();
    }
  }

  ngOnDestroy(): void {
    this.lab$?.complete();
    this.userRole$?.complete();
    this.status$?.complete();
    this.busyStatus$?.complete();
    this.subscriptions?.unsubscribe();
    this.clearTimeout();
  }
}
