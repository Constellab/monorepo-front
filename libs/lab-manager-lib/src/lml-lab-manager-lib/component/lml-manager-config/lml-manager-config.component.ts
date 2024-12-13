import { Component, inject, OnInit } from '@angular/core';
import { FlSnackBarService } from '@monorepo/front-core-lib';
import { LmlLabManagerApiService } from '../../lml-lab-manager-api.service';
import { LmlLabManagerConfig } from '../../model/lml-lab-manager.class';
import { LmlLabManagerState } from '../../lml-lab-manager.state';

/**
 * Component to configure the lab (bricks)
 */
@Component({
  selector: 'lml-manager-config',
  templateUrl: './lml-manager-config.component.html',
  styleUrls: ['./lml-manager-config.component.scss'],
})
export class LmlManagerConfigComponent implements OnInit {
  labConfig: LmlLabManagerConfig;
  configHasChanged: boolean = false;

  getIsLoading: boolean = false;
  saveIsLoading: boolean = false;

  private managerApiService = inject(LmlLabManagerApiService);
  private managerState = inject(LmlLabManagerState);
  private snackBarService = inject(FlSnackBarService);

  ngOnInit(): void {
    this.managerApiService.getLabManagerConfig().subscribe({
      next: (config) => this.getSuccess(config),
      error: () => (this.getIsLoading = false),
    });
  }

  getSuccess(config: LmlLabManagerConfig): void {
    this.labConfig = config;
    this.getIsLoading = false;
  }

  onNewConfig(): void {
    this.configHasChanged = true;
  }

  saveConfig(): void {
    this.saveIsLoading = true;
    this.managerApiService.updateConfig(this.labConfig).subscribe({
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
    this.managerState.refreshStatus();
  }
}
