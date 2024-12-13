import { Component, inject, OnDestroy } from '@angular/core';
import { firstValueFrom, of, Subscription } from 'rxjs';
import { FlDialogService } from '@monorepo/front-core-lib';
import {
  CaLabStatusDialogComponent,
} from '../../../../ca-core/entity-module/ca-lab-core/component/ca-lab-status-dialog/ca-lab-status-dialog.component';
import { CaLabDetailPageState } from '../../../state/ca-lab-detail-page.state';
import { CaLabDetailServerState } from '../../../state/ca-lab-detail-server.state';
import { catchError, map } from 'rxjs/operators';
import {
  CaLabConfigDialogComponent,
  CaLabConfigDialogInput,
} from '../../../../ca-core/entity-module/ca-lab-core/component/ca-lab-config-dialog/ca-lab-config-dialog.component';
import { CaLabService } from '../../../../ca-core/service-api/ca-lab.service';
import { CaLabManagerApiService } from '../../../state/ca-lab-manager-api.service';
import { LmlLabManagerApiService } from '@monorepo/lab-manager-lib';

/**
 * Component only accessible by the admin
 */
@Component({
  selector: 'ca-lab-manager',
  templateUrl: './ca-lab-manager.component.html',
  styleUrls: ['./ca-lab-manager.component.scss'],
})
export class CaLabManagerComponent implements OnDestroy {
  private labManagerApiService: CaLabManagerApiService = inject(LmlLabManagerApiService) as any;

  private dialogService = inject(FlDialogService);
  private state = inject(CaLabDetailPageState);
  private serverState = inject(CaLabDetailServerState);
  private labService = inject(CaLabService);

  private subscription: Subscription;

  openStatusDialog(): void {
    this.dialogService.openMediumDialog(CaLabStatusDialogComponent, { data: this.state.getLabId() });
  }

  async updateLabManager(): Promise<void> {
    const recommendedVersion = await firstValueFrom(
      this.labManagerApiService.getLabManagerRecommendedVersion().pipe(catchError(() => of(null)))
    );

    const managerVersion = await firstValueFrom(
      this.labManagerApiService.getStatus().pipe(
        map((status) => status.version),
        catchError(() => of(null))
      )
    );

    this.serverState.updateLabManager(managerVersion, recommendedVersion);
  }

  openLabConfig(): void {
    const input: CaLabConfigDialogInput = {
      labConfig: this.labService.getConfig(this.state.getLabId()),
      title: { text: 'lab_installed_brick', translateText: true },
      helpText: { text: 'lab_installed_brick_help', translateText: true },
    };

    this.dialogService.openSmallDialog(CaLabConfigDialogComponent, { data: input });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
