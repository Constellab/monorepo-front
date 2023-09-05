import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {
  CaLabInstanceStatusRunPeriod,
  CaLabInstanceStatusRunRequest,
  CaLabInstanceStatusRunResponse
} from '../../../../ca-core/model/entities/lab/ca-lab-instance.class';
import {FormBuilder, Validators} from '@angular/forms';
import {CaLabInstanceService} from '../../../../ca-core/service-api/ca-lab-instance.service';
import {DateTime} from 'luxon';
import {debounceTime, Observable, startWith, Subscription} from 'rxjs';

@Component({
  selector: 'ca-lab-instance-usage',
  templateUrl: './ca-lab-instance-usage.component.html',
  styleUrls: ['./ca-lab-instance-usage.component.scss'],
})
export class CaLabInstanceUsageComponent implements OnInit, OnDestroy {

  @Input() labInstanceId: string;

  periods: any = CaLabInstanceStatusRunPeriod;
  customPeriod: CaLabInstanceStatusRunPeriod = CaLabInstanceStatusRunPeriod.CUSTOM;

  formGroup = new FormBuilder().group({
    period: [CaLabInstanceStatusRunPeriod.LAST_WEEK as CaLabInstanceStatusRunPeriod, Validators.required],
    customStartDate: [null as DateTime],
    customEndDate: [null as DateTime],
  });


  runResponse$: Observable<CaLabInstanceStatusRunResponse>;

  private subscription: Subscription;

  constructor(private labService: CaLabInstanceService) {

  }

  ngOnInit(): void {
    this.subscription = this.formGroup.valueChanges.pipe(debounceTime(500), startWith(null)).subscribe(
      () => this.callKpi(this.formGroup.getRawValue())
    );
  }

  private callKpi(request: CaLabInstanceStatusRunRequest): void {
    if (this.formGroup.valid) {
      this.runResponse$ = this.labService.getRunningKpi(this.labInstanceId, request);
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
