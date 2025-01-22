import { Component, Input, OnDestroy, OnInit, inject } from '@angular/core';
import {
  CaCloudProviderRegion,
  CaCloudProviderRegionDatasource,
} from '../../../../model/entities/ca-cloud-provider.class';
import { CaCloudProviderService } from '../../../../service-api/ca-cloud-provider.service';
import { FormBuilder, FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { CaServerCloud } from '../../../../model/entities/server/ca-server-cloud.class';
import { CaServerService } from '../../../../service-api/ca-server.service';
import { ClSubscriptionHandler } from '@monorepo/core-lib';
import { CaServerStandard } from '../../../../model/entities/server/ca-server-standard.class';
import { CaLabValidator } from '../../../../model/entities/lab/ca-lab.validator';
import { CaServerDecisionTreeComponent } from '../../../ca-server-core/component/ca-server-decision-tree/ca-server-decision-tree.component';
import { MatRadioGroup, MatRadioButton } from '@angular/material/radio';
import { FlRadioButtonBigModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-radio-button-big/fl-radio-button-big.module';
import { FlKeyValueModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-key-value/fl-key-value.module';
import { CaServerStandardPriceComponent } from '../../../ca-server-core/component/ca-server-standard-price/ca-server-standard-price.component';
import { CaCloudProviderInlineComponent } from '../../../ca-cloud-provider-core/component/ca-cloud-provider-inline/ca-cloud-provider-inline.component';
import { FlLoaderModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-loader/fl-loader.module';
import { CaCloudProviderRegionMultilinesComponent } from '../../../ca-cloud-provider-core/component/ca-cloud-provider-region-multilines/ca-cloud-provider-region-multilines.component';
import { FlTextIconModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-text-icon/fl-text-icon.module';
import { MatIcon } from '@angular/material/icon';
import { MatError } from '@angular/material/form-field';
import { AsyncPipe } from '@angular/common';
import { FlCorePipeModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-core-pipe/fl-core-pipe.module';
import { TranslatePipe } from '@ngx-translate/core';

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
  styleUrl: './ca-lab-select-server.component.scss',
  imports: [
    ReactiveFormsModule,
    CaServerDecisionTreeComponent,
    MatRadioGroup,
    MatRadioButton,
    FlRadioButtonBigModule,
    FlKeyValueModule,
    CaServerStandardPriceComponent,
    CaCloudProviderInlineComponent,
    FlLoaderModule,
    CaCloudProviderRegionMultilinesComponent,
    FlTextIconModule,
    MatIcon,
    MatError,
    AsyncPipe,
    FlCorePipeModule,
    TranslatePipe,
  ],
})
export class CaLabSelectServerComponent implements OnInit, OnDestroy {
  private cloudProviderService = inject(CaCloudProviderService);
  private serverService = inject(CaServerService);

  @Input({ required: true }) formGp: FormGroup<CaLabSelectServerForm>;

  serverStandards$: Observable<CaServerStandard[]>;
  serverClouds$: Observable<CaServerCloud[]>;
  regions$: Observable<CaCloudProviderRegion[]>;

  s3Regions: CaCloudProviderRegionDatasource = this.cloudProviderService.getRegionsByType('S3');

  formGroupOrders: Record<keyof CaLabSelectServerForm, number> = {
    standardServer: 1,
    serverCloud: 2,
    region: 3,
    dailyBackupRegion: 4,
    weeklyBackupRegion: 4,
  };

  private subscriptions = new ClSubscriptionHandler();

  ngOnInit(): void {
    for (const [name, groupOrder] of Object.entries(this.formGroupOrders)) {
      this.subscriptions.add(
        this.formGp
          .get(name)
          .valueChanges.subscribe((value) =>
            this.onChange(name as keyof CaLabSelectServerForm, groupOrder, value)
          )
      );
    }
  }

  public static createFormGp(): FormGroup<CaLabSelectServerForm> {
    return new FormBuilder().group(
      {
        standardServer: [null, Validators.required],
        serverCloud: [null, Validators.required],
        region: [null, Validators.required],
        dailyBackupRegion: [null, Validators.required],
        weeklyBackupRegion: [null, Validators.required],
      },
      { validators: CaLabValidator.differentBackupRegionValidator() }
    ) as FormGroup<CaLabSelectServerForm>;
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
