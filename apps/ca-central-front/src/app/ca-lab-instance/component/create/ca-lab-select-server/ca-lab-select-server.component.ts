import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {
  CaCloudProviderRegion,
  CaCloudProviderRegionDatasource
} from '../../../../ca-core/model/entities/ca-cloud-provider.class';
import {CaCloudProviderService} from '../../../../ca-core/service-api/ca-cloud-provider.service';
import {FormBuilder, FormControl, FormGroup, ValidatorFn, Validators} from '@angular/forms';
import {Observable} from 'rxjs';
import {CaServerCloud} from '../../../../ca-core/model/entities/server/ca-server-cloud.class';
import {CaServerService} from '../../../../ca-core/service-api/ca-server.service';
import {ClSubscriptionHandler} from '@monorepo/core-lib';
import {CaServerStandard} from '../../../../ca-core/model/entities/server/ca-server-standard.class';


export interface CaLabSelectServerForm {
  standardServer: FormControl<CaServerStandard>;
  serverCloud: FormControl<CaServerCloud>;
  region: FormControl<CaCloudProviderRegion>;
  dailyBackupRegion: FormControl<CaCloudProviderRegion>;
  weeklyBackupRegion: FormControl<CaCloudProviderRegion>;
}

@Component({
  selector: 'ca-lab-select-server',
  templateUrl: './ca-lab-select-server.component.html',
  styleUrl: './ca-lab-select-server.component.scss'
})
export class CaLabSelectServerComponent implements OnInit, OnDestroy {

  @Input({required: true}) formGp: FormGroup<CaLabSelectServerForm>;


  serverStandards$: Observable<CaServerStandard[]>;
  serverClouds$: Observable<CaServerCloud[]>;
  regions$: Observable<CaCloudProviderRegion[]>;

  s3Regions: CaCloudProviderRegionDatasource = this.cloudProviderService.getRegionsByType('S3');


  formGroupOrders: Record<keyof CaLabSelectServerForm, number> = {
    standardServer: 1,
    serverCloud: 2,
    region: 3,
    dailyBackupRegion: 4,
    weeklyBackupRegion: 4
  };

  private subscriptions = new ClSubscriptionHandler();

  constructor(private cloudProviderService: CaCloudProviderService,
              private serverService: CaServerService) {

  }

  ngOnInit(): void {
    for (const [name, groupOrder] of Object.entries(this.formGroupOrders)) {
      this.subscriptions.add(this.formGp.get(name).valueChanges.subscribe(
        (value) => this.onChange(name as keyof CaLabSelectServerForm, groupOrder, value)
      ));
    }
  }


  public static createFormGp(): FormGroup<CaLabSelectServerForm> {
    return new FormBuilder().group({
      standardServer: [null, Validators.required],
      serverCloud: [null, Validators.required],
      region: [null, Validators.required],
      dailyBackupRegion: [null, Validators.required],
      weeklyBackupRegion: [null, Validators.required]
    }, {validators: this.differentBackupRegionValidator()}) as FormGroup<CaLabSelectServerForm>;
  }

  // TODO REMOVE DUPLICATE CODE
  public static differentBackupRegionValidator(): ValidatorFn {
    return (control: FormGroup<CaLabSelectServerForm>): { [key: string]: any } => {
      if (!control.value) return null;

      const dailyBackupRegion = control.value.dailyBackupRegion;
      const weeklyBackupRegion = control.value.weeklyBackupRegion;

      if (dailyBackupRegion == null || weeklyBackupRegion == null) return null;

      if (dailyBackupRegion.id === weeklyBackupRegion.id) {
        return {sameBackupRegion: true};
      }
      return null;
    };
  }

  onDecisionTreeChange(serverStandardNames: string[]): void {
    if (this.serverStandards$) {
      this.formGp.reset(null);
    }

    if (serverStandardNames) {
      this.serverStandards$ = this.serverService.findServerStandardByNames(serverStandardNames);
    } else {
      this.serverStandards$ = null;
    }
  }

  onChange(formName: keyof CaLabSelectServerForm, order: number, value: any): void {
    // clear all next form groups
    for (const [name, groupOrder] of Object.entries(this.formGroupOrders)) {
      if (groupOrder > order) {
        this.formGp.get(name).reset(null);
      }
    }

    if (formName === 'standardServer') {
      const standardServer: CaServerStandard = value;
      if (standardServer == null) {
        this.serverClouds$ = null;
      } else {
        this.serverClouds$ = this.serverService.findServerCloudByStandardServer(standardServer.id);
      }
    }

    if (formName === 'serverCloud') {
      const serverCloud: CaServerCloud = value;
      if (serverCloud == null) {
        this.regions$ = null;
      } else {
        this.regions$ = this.serverService.findAvailableRegionsForServerCloud(serverCloud.id);
      }
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
