import {Component, Input, OnInit} from '@angular/core';
import {CaLabInstanceService} from '../../../../ca-core/service-api/ca-lab-instance.service';
import {CaLabManagerConfig} from '../../../../ca-core/model/entities/lab/ca-lab-manager.class';
import {CaLabInstanceDetailManagerState} from '../../../state/ca-lab-instance-detail-manager.state';
import {FlSnackBarService} from '@monorepo/front-core-lib';

/**
 * Component to configure the lab instance (bricks)
 */
@Component({
  selector: 'ca-lab-instance-manager-config',
  templateUrl: './ca-lab-instance-manager-config.component.html',
  styleUrls: ['./ca-lab-instance-manager-config.component.scss']
})
export class CaLabInstanceManagerConfigComponent implements OnInit {

  @Input() labInstanceId: string;

  labConfig: CaLabManagerConfig;
  configHasChanged: boolean = false;

  getIsLoading: boolean = false;
  saveIsLoading: boolean = false;

  constructor(private labInstanceService: CaLabInstanceService,
              private managerState: CaLabInstanceDetailManagerState,
              private snackBarService: FlSnackBarService) {
  }

  ngOnInit(): void {
    this.labInstanceService.getLabManagerConfig(this.labInstanceId).subscribe({
      next: config => this.getSuccess(config),
      error: () => this.getIsLoading = false,
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
    this.labInstanceService.updateConfig(this.labInstanceId, this.labConfig).subscribe({
      next: () => this.saveSuccess(),
      error: () => this.saveIsLoading = false,
    });
  }

  private saveSuccess(): void {
    this.saveIsLoading = false;
    this.snackBarService.openSuccessMessage({
      text: 'lab_instance_cloud_config_updated',
      translateText: true
    }, 10000);
    this.configHasChanged = false;
    this.managerState.refreshStatus();
  }

}
