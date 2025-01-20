import { Component, inject, Input, OnInit } from '@angular/core';
import { CaLabSelectVolumeForm } from '../ca-lab-select-storage/ca-lab-select-storage.component';
import { CaLabSelectServerForm } from '../ca-lab-select-server/ca-lab-select-server.component';
import { LmlLabManagerConfig } from '@monorepo/lab-manager-lib';
import { FormGroup } from '@angular/forms';
import { combineLatest, Observable, of, share, switchMap } from 'rxjs';
import { CaServerService } from '../../../../service-api/ca-server.service';
import { map } from 'rxjs/operators';
import { CaStoragePrice } from '../../../../model/entities/server/ca-storage-price.class';

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
    standalone: false
})
export class CaLabCreateSummaryComponent implements OnInit {
  @Input() name: string;

  @Input({ required: true }) server: FormGroup<CaLabSelectServerForm>;

  @Input({ required: true }) storage: FormGroup<CaLabSelectVolumeForm>;

  @Input() labConfig: LmlLabManagerConfig;

  private serverService = inject(CaServerService);

  serverPrice$: Observable<number>;

  serverRunningSimulation$: Observable<CaLabServerPriceEstimation[]>;

  backupApproximateRatio = CaStoragePrice.backupApproximateRatio * 100;

  ngOnInit(): void {
    this.serverPrice$ = this.server.get('standardServer').valueChanges.pipe(
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
        if (!serverPrice || !volume.storagePrice) {
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
            pricePerMonth: serverPrice * simulation.nbOfHours + volume.storagePrice * volume.storageSize,
            title: simulation.title,
          };
        });
      })
    );
  }
}
