import { Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { CaLabService } from '../../../../ca-core/service-api/ca-lab.service';
import { DateTime } from 'luxon';
import { combineLatest, debounceTime, Observable, share, startWith, Subscription } from 'rxjs';
import {
  CaLabRunningStatus,
  CaLabRunningStatusArrayObs,
  CaLabStatusRunPeriod,
  CaLabStatusRunRequest,
  CaLabStatusRunResponse,
  CaLabStorageResponse,
} from '../../../../ca-core/model/entities/lab/ca-lab-stats.dto';
import { FlArrayObs, FlDialogService, FlEntityPaginatedDatasource } from '@monorepo/front-core-lib';
import { map } from 'rxjs/operators';
import { ClDateHelper } from '@monorepo/core-lib';
import {
  CaLabStoragePriceDialogComponent,
  CaLabStoragePriceDialogInput,
} from '../ca-lab-storage-price-dialog/ca-lab-storage-price-dialog.component';
import { CaUserDatasourcePaginated } from '../../../../ca-core/model/entities/ca-user.class';

@Component({
    selector: 'ca-lab-usage',
    templateUrl: './ca-lab-usage.component.html',
    styleUrls: ['./ca-lab-usage.component.scss'],
    standalone: false
})
export class CaLabUsageComponent implements OnInit, OnDestroy {
  @Input({ required: true }) labId: string;

  @Input({ required: true }) isCloud$: Observable<boolean>;

  private labService = inject(CaLabService);
  private dialogService = inject(FlDialogService);

  periods: any = CaLabStatusRunPeriod;
  customPeriod: CaLabStatusRunPeriod = CaLabStatusRunPeriod.CUSTOM;

  formGroup = new FormBuilder().group({
    period: [CaLabStatusRunPeriod.CURRENT_MONTH, Validators.required],
    customStartDate: [null as DateTime],
    customEndDate: [null as DateTime],
    users: [null],
  });

  runResponse$: Observable<CaLabStatusRunResponse>;
  runStatuses$: FlArrayObs<CaLabRunningStatus>;

  storageKpi$: Observable<CaLabStorageResponse>;

  totalPrice$: Observable<number>;

  currentDate = ClDateHelper.getDate();

  usersStatus: CaUserDatasourcePaginated;

  private subscription: Subscription;

  ngOnInit(): void {
    this.subscription = this.formGroup.valueChanges
      .pipe(debounceTime(500), startWith(null))
      .subscribe(() => this.callKpi(this.formGroup.getRawValue()));

    this.usersStatus = new FlEntityPaginatedDatasource(
      (page, size) => this.labService.getUsersStatus(this.labId, page, size),
      20
    );
  }

  private callKpi(request: CaLabStatusRunRequest): void {
    if (this.formGroup.valid) {
      const obs = this.labService.getLabRunningStats(this.labId, request).pipe(share());
      this.runResponse$ = obs;
      this.runStatuses$ = new CaLabRunningStatusArrayObs(obs.pipe(map((response) => response.statuses)));

      // the observable is not subscribed for non cloud lab
      this.storageKpi$ = this.labService.getLabStorageStats(this.labId, request).pipe(share());

      this.totalPrice$ = combineLatest([obs, this.storageKpi$]).pipe(
        map(([runResponse, storageKpi]) =>
          runResponse.billInfo != null ? runResponse.billInfo.totalPrice + storageKpi.totalStoragePrice : null
        )
      );
    }
  }

  openStorageDetail(storage: CaLabStorageResponse): void {
    const input: CaLabStoragePriceDialogInput = {
      volumes: storage.volumes,
      backups: storage.backupStorages,
    };

    this.dialogService.openMediumDialog(CaLabStoragePriceDialogComponent, { data: input });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
