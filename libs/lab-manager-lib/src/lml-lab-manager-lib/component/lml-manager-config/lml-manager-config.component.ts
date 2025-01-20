import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FlSnackBarService } from '@monorepo/front-core-lib';
import { LmlLabManagerService } from '../../lml-lab-manager.service';
import { LmlBrickVersionDTODatasource, LmlLabManagerConfig } from '../../model/lml-lab-manager.class';
import { LmlLabManagerState } from '../../lml-lab-manager.state';

/**
 * Component to configure the lab (bricks)
 */
@Component({
    selector: 'lml-manager-config',
    templateUrl: './lml-manager-config.component.html',
    styleUrls: ['./lml-manager-config.component.scss'],
    standalone: false
})
export class LmlManagerConfigComponent implements OnInit, OnDestroy {
  brickVersions: LmlBrickVersionDTODatasource;
  configHasChanged: boolean = false;

  getIsLoading: boolean = false;
  saveIsLoading: boolean = false;

  private managerApiService = inject(LmlLabManagerService);
  private managerState = inject(LmlLabManagerState);
  private snackBarService = inject(FlSnackBarService);

  ngOnInit(): void {
    this.managerApiService.getLabManagerConfig().subscribe({
      next: (config) => this.getSuccess(config),
      error: () => (this.getIsLoading = false),
    });
  }

  getSuccess(config: LmlLabManagerConfig): void {
    this.brickVersions = new LmlBrickVersionDTODatasource(config.brickVersions, true);
    this.getIsLoading = false;
  }

  onNewConfig(): void {
    this.configHasChanged = true;
  }

  saveConfig(): void {
    this.saveIsLoading = true;
    this.managerApiService.updateConfig(this.brickVersions.toLabManagerConfig()).subscribe({
      next: () => this.saveSuccess(),
      error: () => (this.saveIsLoading = false),
    });
  }

  private saveSuccess(): void {
    this.saveIsLoading = false;
    this.snackBarService.openSuccessMessage(
      {
        text: 'lml.lab_cloud_config_updated',
        translateText: true,
      },
      10000
    );
    this.configHasChanged = false;
    this.managerState.refreshStatus(true);
  }

  ngOnDestroy(): void {
    if (this.brickVersions) {
      this.brickVersions.manualDisconnect();
    }
  }
}
