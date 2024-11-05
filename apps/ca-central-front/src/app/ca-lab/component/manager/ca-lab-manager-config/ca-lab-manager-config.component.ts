import { Component, Input, OnInit } from '@angular/core';
import { CaLabService } from '../../../../ca-core/service-api/ca-lab.service';
import { CaLabManagerConfig } from '../../../../ca-core/model/entities/lab/ca-lab-manager.class';
import { CaLabDetailManagerState } from '../../../state/ca-lab-detail-manager.state';
import { FlSnackBarService } from '@monorepo/front-core-lib';

/**
 * Component to configure the lab (bricks)
 */
@Component({
  selector: 'ca-lab-manager-config',
  templateUrl: './ca-lab-manager-config.component.html',
  styleUrls: ['./ca-lab-manager-config.component.scss'],
})
export class CaLabManagerConfigComponent implements OnInit {
  @Input() labId: string;

  labConfig: CaLabManagerConfig;
  configHasChanged: boolean = false;

  getIsLoading: boolean = false;
  saveIsLoading: boolean = false;

  constructor(
    private labService: CaLabService,
    private managerState: CaLabDetailManagerState,
    private snackBarService: FlSnackBarService
  ) {}

  ngOnInit(): void {
    this.labService.getLabManagerConfig(this.labId).subscribe({
      next: (config) => this.getSuccess(config),
      error: () => (this.getIsLoading = false),
    });
  }

  getSuccess(config: CaLabManagerConfig): void {
    this.labConfig = config;
    this.getIsLoading = false;
  }

  onNewConfig(): void {
    this.configHasChanged = true;
  }

  saveConfig(): void {
    this.saveIsLoading = true;
    this.labService.updateConfig(this.labId, this.labConfig).subscribe({
      next: () => this.saveSuccess(),
      error: () => (this.saveIsLoading = false),
    });
  }

  private saveSuccess(): void {
    this.saveIsLoading = false;
    this.snackBarService.openSuccessMessage(
      {
        text: 'lab_cloud_config_updated',
        translateText: true,
      },
      10000
    );
    this.configHasChanged = false;
    this.managerState.refreshStatus();
  }
}
