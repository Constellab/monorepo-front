import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {
  CaCloudProviderRegion,
  CaCloudProviderRegionDatasource
} from '../../../../ca-core/model/entities/ca-cloud-provider.class';
import {CaCloudProviderService} from '../../../../ca-core/service-api/ca-cloud-provider.service';
import {FormBuilder, FormControl, FormGroup, ValidatorFn, Validators} from '@angular/forms';
import {Observable} from 'rxjs';
import {CaServerInfo} from '../../../../ca-core/model/entities/ca-server-info.class';
import {CaServerInfoService} from '../../../../ca-core/service-api/ca-server-info.service';
import {ClSubscriptionHandler} from '@monorepo/core-lib';


interface CaRadioButton {
  name: string;
  description: string;
}

interface CaServerUsage extends CaRadioButton {
  standardServers: CaRadioButton[];
}

const smallCompute: CaRadioButton = {
  name: 'Small compute',
  description: '2 CPU, 4 GB RAM'
};

const mediumCompute: CaRadioButton = {
  name: 'Medium compute',
  description: '4 CPU, 8 GB RAM'
};

const largeCompute: CaRadioButton = {
  name: 'Large compute',
  description: '8 CPU, 16 GB RAM'
};

const serverUsages: CaServerUsage[] = [
  {
    name: 'General purpose',
    description: 'Standard servers',
    standardServers: [smallCompute, mediumCompute, largeCompute]
  },
  {
    name: 'Metagenomics',
    description: 'Servers for metagenomics',
    standardServers: [mediumCompute, largeCompute]
  },
  {
    name: 'Statistics',
    description: 'Servers for statistics',
    standardServers: [smallCompute, mediumCompute]
  }
];

export interface CaLabSelectServerForm {
  usage: FormControl<CaServerUsage>;
  standardServer: FormControl<CaRadioButton>;
  serverInfo: FormControl<CaServerInfo>;
  region: FormControl<CaCloudProviderRegion>;
  dailyBackupRegion: FormControl<CaCloudProviderRegion>;
  weeklyBackupRegion: FormControl<CaCloudProviderRegion>;
}


@Component({
  selector: 'ca-lab-select-server',
  templateUrl: './ca-lab-select-server.component.html',
  styleUrl: './ca-lab-select-server.component.scss'
})
export class CaLabSelectServerComponent implements OnInit, OnDestroy{

  @Input({required: true}) formGp: FormGroup<CaLabSelectServerForm>;

  serverInfo$: Observable<CaServerInfo[]>;
  regions$: Observable<CaCloudProviderRegion[]>;

  s3Regions: CaCloudProviderRegionDatasource = this.cloudProviderService.getRegionsByType('S3');


  serverUsages: CaServerUsage[] = serverUsages;

  formGroupOrders: Record<keyof CaLabSelectServerForm, number> = {
    usage: 0,
    standardServer: 1,
    serverInfo: 2,
    region: 3,
    dailyBackupRegion: 4,
    weeklyBackupRegion: 4
  };

  private subscriptions = new ClSubscriptionHandler();

  constructor(private cloudProviderService: CaCloudProviderService,
              private serverInfoService: CaServerInfoService) {

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
      usage: [null, Validators.required],
      standardServer: [null, Validators.required],
      serverInfo: [null, Validators.required],
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

  onChange(formName: keyof CaLabSelectServerForm, order: number, value: any): void {
    // clear all next form groups
    for (const [name, groupOrder] of Object.entries(this.formGroupOrders)) {
      if (groupOrder > order) {
        this.formGp.get(name).reset(null);
      }
    }

    if(formName === 'standardServer'){
      const standardServer: CaRadioButton = value;
      if (standardServer == null) {
        this.serverInfo$ = null;
      } else {
        this.serverInfo$ = this.serverInfoService.findByStandardName(standardServer.name);
      }
    }

    if(formName === 'serverInfo'){
      const serverInfo: CaServerInfo = value;
      if (serverInfo == null) {
        this.regions$ = null;
      } else {
        this.regions$ = this.serverInfoService.findAvailableRegionsForServerInfo(serverInfo.id);
      }
    }
  }

  get selectedUsage(): CaServerUsage {
    return this.formGp.get('usage').value;
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }



}
