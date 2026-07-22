import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';

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
  standalone: false,
})
export class LmlManagerConfigComponent implements OnInit, OnDestroy {
  brickVersions = signal<LmlBrickVersionDTODatasource>(undefined);

  getIsLoading = signal<boolean>(false);

  private managerApiService = inject(LmlLabManagerService);

  ngOnInit(): void {
    this.managerApiService.getLabManagerConfig().subscribe({
      next: (config) => this.getSuccess(config),
      error: () => this.getIsLoading.set(false),
    });
  }

  getSuccess(config: LmlLabManagerConfig): void {
    const datasource = new LmlBrickVersionDTODatasource(config.brickVersions, true);
    this.brickVersions.set(datasource);
    this.getIsLoading.set(false);
    this.loadBricksInfo(datasource, config);
  }

  /**
   * Enrich the loaded bricks with their detailed info (description, image, latest version).
   * Best effort: on error the rows keep their basic (icon/name/version) display.
   */
  private loadBricksInfo(datasource: LmlBrickVersionDTODatasource, config: LmlLabManagerConfig): void {
    if (!config.brickVersions?.length) return;

    this.managerApiService.getMultipleBrickInfo().subscribe({
      next: (infos) => datasource.mergeBricksInfo(infos),
      error: () => {
        /* keep the basic display on error */
      },
    });
  }

  ngOnDestroy(): void {
    this.brickVersions()?.manualDisconnect();
  }
}
