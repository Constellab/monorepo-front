import { AsyncPipe, DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDivider } from '@angular/material/divider';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { FlKeyValueModule } from '@monorepo/front-core-lib/fl-key-value';
import { LmlLabManagerConfig } from '@monorepo/lab-manager-lib';
import { TranslatePipe } from '@ngx-translate/core';
import { combineLatest, Observable, of, share, switchMap } from 'rxjs';
import { map } from 'rxjs/operators';

import { CaStoragePrice } from '../../../../model/entities/server/ca-storage-price.class';
import { CaServerService } from '../../../../service-api/ca-server.service';
import { CaCloudProviderRegionInlineComponent } from '../../../ca-cloud-provider-core/component/ca-cloud-provider-region-inline/ca-cloud-provider-region-inline.component';
import { CaLabSelectServerForm } from '../ca-lab-select-server/ca-lab-select-server.component';
import { CaLabSelectVolumeForm } from '../ca-lab-select-storage/ca-lab-select-storage.component';

interface CaLabServerPriceEstimation {
  hourPerMonth: number;
  pricePerMonth: number;
  title: string;
}

/**
 * Step in the lab creation to summarize the lab creation
 */
@Component({
  selector: 'ca-lab-create-summary',
  templateUrl: './ca-lab-create-summary.component.html',
  styleUrl: './ca-lab-create-summary.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    FlKeyValueModule,
    CaCloudProviderRegionInlineComponent,
    MatIcon,
    MatTooltip,
    AsyncPipe,
    DecimalPipe,
    TranslatePipe,
    MatDivider,
  ],
})
export class CaLabCreateSummaryComponent implements OnInit {
  @Input() name: string | null | undefined;

  @Input({ required: true }) server: FormGroup<CaLabSelectServerForm>;

  @Input({ required: true }) storage: FormGroup<CaLabSelectVolumeForm>;

  @Input() labConfig: LmlLabManagerConfig;

  private serverService = inject(CaServerService);

  serverPrice$: Observable<number | null>;

  serverRunningSimulation$: Observable<CaLabServerPriceEstimation[]>;

  backupApproximateRatio = CaStoragePrice.backupApproximateRatio * 100;

  ngOnInit(): void {
    this.serverPrice$ = (this.server.get('standardServer')?.valueChanges ?? of(null)).pipe(
      switchMap((serverStandard) => {
        if (!serverStandard) {
          return of(null);
        }
        return this.serverService.getServerPrice(serverStandard.id);
      }),
      share()
    );

    this.serverRunningSimulation$ = combineLatest([this.serverPrice$, this.storage.valueChanges]).pipe(
      map(([serverPrice, volume]) => {
        const storagePrice = volume.storagePrice;
        const storageSize = volume.storageSize;
        if (!serverPrice || !storagePrice || storageSize == null) {
          return [];
        }

        // simulations for 10, 30 and 75 hours
        const simulations = [
          {
            nbOfHours: 10,
            title: 'lab_server_low_usage',
          },
          {
            nbOfHours: 30,
            title: 'lab_server_medium_usage',
          },
          {
            nbOfHours: 75,
            title: 'lab_server_high_usage',
          },
        ];

        return simulations.map((simulation) => {
          return {
            hourPerMonth: simulation.nbOfHours,
            pricePerMonth: serverPrice * simulation.nbOfHours + storagePrice * storageSize,
            title: simulation.title,
          };
        });
      })
    );
  }
}
