import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit } from '@angular/core';

import { LmlLabManagerService } from '../../lml-lab-manager.service';
import { LmlBrickVersionDTODatasource, LmlLabManagerConfig } from '../../model/lml-lab-manager.class';

/**
 * Component to configure the lab (bricks). Loads the brick config; editing and saving is
 * handled by the embedded lml-bricks-config-form.
 */
@Component({
  selector: 'lml-manager-config',
  templateUrl: './lml-manager-config.component.html',
  styleUrls: ['./lml-manager-config.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class LmlManagerConfigComponent implements OnInit, OnDestroy {
  brickVersions: LmlBrickVersionDTODatasource;

  getIsLoading: boolean = false;

  private managerApiService = inject(LmlLabManagerService);

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

  ngOnDestroy(): void {
    if (this.brickVersions) {
      this.brickVersions.manualDisconnect();
    }
  }
}
