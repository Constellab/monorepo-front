import {Component, OnInit} from '@angular/core';
import {CaLabInstanceService} from '../../../../ca-core/service-api/ca-lab-instance.service';
import {CaLabManagerConfig} from '../../../../ca-core/model/entities/lab/ca-lab-manager.class';
import {CaLabConfig} from '../../../../ca-core/model/entities/lab/ca-lab-config.class';
import {CaLabInstanceDetailPageState} from '../../../state/ca-lab-instance-detail-page.state';
import {FlServerError, FlSnackBarService} from '@monorepo/front-core-lib';

@Component({
  selector: 'ca-lab-desktop-config',
  templateUrl: './ca-lab-desktop-config.component.html',
  styleUrls: ['./ca-lab-desktop-config.component.scss']
})
export class CaLabDesktopConfigComponent implements OnInit {

  labConfig: CaLabManagerConfig;
  configHasChanged: boolean = false;

  getIsLoading: boolean = false;
  saveIsLoading: boolean = false;

  constructor(private state: CaLabInstanceDetailPageState,
              private labInstanceService: CaLabInstanceService,
              private snackBarService: FlSnackBarService) {
  }

  ngOnInit(): void {
    this.getConfig();
  }

  private getConfig(): void {
    this.getIsLoading = true;
    this.labInstanceService.getConfig( this.state.getLabInstanceId(), true).subscribe({
      next: config => this.getSuccess(config),
      error: (error: FlServerError) => this.getError(error),
    });
  }

  private getSuccess(labConfig: CaLabConfig): void {
    this.labConfig = this.convertToLabManagerConfig(labConfig);
    this.getIsLoading = false;
  }

  private getError(error: FlServerError): void {
    // if the configuration is not found, we return an empty config
    if (error.nestedError?.code === 'error.lab_config_not_found') {
      const labConfig = new CaLabManagerConfig();
      labConfig.brickVersions = [];
      labConfig.glabTag = null;
      this.labConfig = labConfig;
    } else {
      this.snackBarService.openErrorMessage({ text: error.message, translateText: false });
    }
    this.getIsLoading = false;
  }

  private convertToLabManagerConfig(config: CaLabConfig): CaLabManagerConfig {
    const labManagerConfig = new CaLabManagerConfig();
    labManagerConfig.brickVersions = config.brickVersions.map(brickVersion => ({
      version: brickVersion.version,
      name: brickVersion.brick.name,
    }));
    labManagerConfig.glabTag = null;
    return labManagerConfig;
  }

  onNewConfig(): void {
    this.configHasChanged = true;
  }

  saveConfig(): void {
    this.saveIsLoading = true;
    this.labInstanceService.updateConfig( this.state.getLabInstanceId(), this.labConfig).subscribe({
      next: () => this.saveSuccess(),
      error: () => this.saveIsLoading = false,
    });
  }

  private saveSuccess(): void {
    this.saveIsLoading = false;
    this.snackBarService.openSuccessMessage({
      text: 'lab_instance_desktop_config_updated',
      translateText: true
    }, 10000);
    this.configHasChanged = false;
  }

}
