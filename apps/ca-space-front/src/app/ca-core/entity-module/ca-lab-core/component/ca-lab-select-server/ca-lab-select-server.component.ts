import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatError } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatRadioButton, MatRadioGroup } from '@angular/material/radio';
import { ClSubscriptionHandler } from '@monorepo/core-lib';
import { FlCorePipeModule } from '@monorepo/front-core-lib/fl-core-pipe';
import { FlKeyValueModule } from '@monorepo/front-core-lib/fl-key-value';
import { FlLoaderModule } from '@monorepo/front-core-lib/fl-loader';
import { FlRadioButtonBigModule } from '@monorepo/front-core-lib/fl-radio-button-big';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import {
  CaCloudProviderRegion,
  CaCloudProviderRegionDatasource,
} from '../../../../model/entities/ca-cloud-provider.class';
import { CaLabValidator } from '../../../../model/entities/lab/ca-lab.validator';
import { CaServerCloud } from '../../../../model/entities/server/ca-server-cloud.class';
import { CaServerStandard } from '../../../../model/entities/server/ca-server-standard.class';
import { CaCloudProviderService } from '../../../../service-api/ca-cloud-provider.service';
import { CaServerService } from '../../../../service-api/ca-server.service';
import { CaCloudProviderInlineComponent } from '../../../ca-cloud-provider-core/component/ca-cloud-provider-inline/ca-cloud-provider-inline.component';
import { CaCloudProviderRegionMultilinesComponent } from '../../../ca-cloud-provider-core/component/ca-cloud-provider-region-multilines/ca-cloud-provider-region-multilines.component';
import { CaServerDecisionTreeComponent } from '../../../ca-server-core/component/ca-server-decision-tree/ca-server-decision-tree.component';
import { CaServerStandardPriceComponent } from '../../../ca-server-core/component/ca-server-standard-price/ca-server-standard-price.component';

export interface CaLabSelectServerForm {
  standardServer: FormControl<CaServerStandard | null>;
  serverCloud: FormControl<CaServerCloud | null>;
  region: FormControl<CaCloudProviderRegion | null>;
  dailyBackupRegion: FormControl<CaCloudProviderRegion | null>;
  weeklyBackupRegion: FormControl<CaCloudProviderRegion | null>;
}

@Component({
  selector: 'ca-lab-select-server',
  templateUrl: './ca-lab-select-server.component.html',
  styleUrl: './ca-lab-select-server.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
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

  serverStandards$: Observable<CaServerStandard[]> | null;
  serverClouds$: Observable<CaServerCloud[]> | null;
  regions$: Observable<CaCloudProviderRegion[]> | null;

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
      const control = this.formGp.get(name);
      if (control == null) continue;
      this.subscriptions.add(
        control.valueChanges.subscribe((value) =>
          this.onChange(name as keyof CaLabSelectServerForm, groupOrder, value)
        )
      );
    }
  }

  public static createFormGp(): FormGroup<CaLabSelectServerForm> {
    return new FormBuilder().group(
      {
        standardServer: [null as CaServerStandard | null, Validators.required],
        serverCloud: [null as CaServerCloud | null, Validators.required],
        region: [null as CaCloudProviderRegion | null, Validators.required],
        dailyBackupRegion: [null as CaCloudProviderRegion | null, Validators.required],
        weeklyBackupRegion: [null as CaCloudProviderRegion | null, Validators.required],
      },
      { validators: CaLabValidator.differentBackupRegionValidator() }
    );
  }

  onDecisionTreeChange(serverStandardNames: string[]): void {
    if (this.serverStandards$) {
      this.formGp.reset();
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
        this.formGp.get(name)?.reset();
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
