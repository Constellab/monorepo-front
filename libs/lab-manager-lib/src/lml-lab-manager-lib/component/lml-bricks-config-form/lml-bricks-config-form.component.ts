import { Component, inject, input, output, signal, ViewContainerRef } from '@angular/core';
import { ClBrick } from '@monorepo/core-lib';
import {
  FlConfirmDialogInput,
  FlConfirmDialogResult,
  FlDialogService,
} from '@monorepo/front-core-lib/fl-dialog';
import { FlSnackBarService } from '@monorepo/front-core-lib/fl-snack-bar';

import { LmlBrickService } from '../../lml-brick.service';
import { LmlLabManagerService } from '../../lml-lab-manager.service';
import { LmlLabManagerState } from '../../lml-lab-manager.state';
import { LmlBrickVersion } from '../../model/lml-brick.class';
import {
  LmlBrickVersionDTODatasource,
  LmlLabManagerBrickVersionDTO,
  LmlLabManagerConfig,
} from '../../model/lml-lab-manager.class';
import {
  LmlBrickVersionDetailDialogComponent,
  LmlBrickVersionDetailDialogInput,
} from '../lml-brick-version-detail-dialog/lml-brick-version-detail-dialog.component';
import { LmlConfigureBrickComponent } from '../lml-configure-brick/lml-configure-brick.component';

/**
 * Form to update the lab config (bricks). Owns the whole edit/save cycle: it tracks
 * pending changes, persists them (updateConfig) and refreshes the lab-manager status,
 * so consumers only need to provide the brick datasource.
 */
@Component({
  selector: 'lml-bricks-config-form',
  templateUrl: './lml-bricks-config-form.component.html',
  styleUrls: ['./lml-bricks-config-form.component.scss'],
  standalone: false,
})
export class LmlBricksConfigFormComponent {
  brickVersions = input.required<LmlBrickVersionDTODatasource>();

  configChange = output<LmlLabManagerConfig>();

  showAdvanced = input<boolean>(true);

  warningOnRemoveBrick = input<boolean>(true);

  addGwsCoreIsLoading = signal<boolean>(false);

  configHasChanged = signal<boolean>(false);
  saveIsLoading = signal<boolean>(false);
  cancelIsLoading = signal<boolean>(false);

  private snackBarService = inject(FlSnackBarService);
  private dialogService = inject(FlDialogService);
  private brickService = inject(LmlBrickService);
  private managerApiService = inject(LmlLabManagerService);
  private managerState = inject(LmlLabManagerState);
  private viewContainerRef = inject(ViewContainerRef);

  openBrickVersionDetailDialog(brickVersionDTO: LmlLabManagerBrickVersionDTO): void {
    const data: LmlBrickVersionDetailDialogInput = {
      brickName: brickVersionDTO.name,
      brickVersion: brickVersionDTO.version,
    };

    this.dialogService.openSmallDialog(LmlBrickVersionDetailDialogComponent, {
      data: data,
      viewContainerRef: this.viewContainerRef,
    });
  }

  openBrickVersionForm(brickVersionDTO?: LmlLabManagerBrickVersionDTO): void {
    this.dialogService
      .openBigDialog(LmlConfigureBrickComponent, {
        data: { brickVersionDTO },
        viewContainerRef: this.viewContainerRef,
      })
      .afterClosed()
      .subscribe((brickVersion) =>
        this.onBrickDialogClosed(brickVersionDTO == null ? 'add' : 'update', brickVersion)
      );
  }

  private onBrickDialogClosed(mode: 'add' | 'update', brickVersionDTO?: LmlLabManagerBrickVersionDTO): void {
    if (!brickVersionDTO) return;

    const brickVersions = this.brickVersions();
    const existingVersion = brickVersions.findItem(brickVersionDTO);
    if (mode === 'add' && existingVersion) {
      this.snackBarService.openErrorMessage({
        text: 'lml.lab_brick_already_exists',
        translateText: true,
        translateParam: { param: { brickName: brickVersionDTO.name } },
      });
      return;
    }

    // if this is an update
    if (existingVersion) {
      brickVersions.updateItem(brickVersionDTO);
    } else {
      brickVersions.addItem(brickVersionDTO);
    }
    this.emitConfigChange();
  }

  openDeleteBrickConfirmDialog(brickVersionDTO: LmlLabManagerBrickVersionDTO): void {
    if (this.warningOnRemoveBrick()) {
      const data: FlConfirmDialogInput = {
        title: 'lml.lab_remove_brick',
        content: 'lml.lab_remove_brick_confirmation',
      };

      this.dialogService
        .openConfirmDialog(data)
        .afterClosed()
        .subscribe((result) => this.onDeleteBrickConfirmClosed(result, brickVersionDTO));
    } else {
      this.deleteBrickVersion(brickVersionDTO);
    }
  }

  private onDeleteBrickConfirmClosed(
    result: FlConfirmDialogResult,
    brickVersionDTO: LmlLabManagerBrickVersionDTO
  ): void {
    if (result.choice) {
      this.deleteBrickVersion(brickVersionDTO);
    }
  }

  private deleteBrickVersion(brickVersionDTO: LmlLabManagerBrickVersionDTO): void {
    const brickVersions = this.brickVersions();
    brickVersions.removeItem(brickVersionDTO);
    this.emitConfigChange();
  }

  /** Flags a pending change and notifies consumers of the new (unsaved) config. */
  private emitConfigChange(): void {
    this.configHasChanged.set(true);
    this.configChange.emit(this.brickVersions().toLabManagerConfig());
  }

  save(): void {
    this.saveIsLoading.set(true);
    this.managerApiService.updateConfig(this.brickVersions().toLabManagerConfig()).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.saveIsLoading.set(false),
    });
  }

  private onSaveSuccess(): void {
    this.saveIsLoading.set(false);
    this.configHasChanged.set(false);
    this.managerState.onConfigSavedNeedsRestart({
      text: 'lml.lab_cloud_config_updated',
      translateText: true,
    });
  }

  /** Discards pending changes by reloading the saved config. */
  cancel(): void {
    this.cancelIsLoading.set(true);
    this.managerApiService.getLabManagerConfig().subscribe({
      next: (config) => this.onCancelSuccess(config),
      error: () => this.cancelIsLoading.set(false),
    });
  }

  private onCancelSuccess(config: LmlLabManagerConfig): void {
    this.brickVersions().array = config.brickVersions;
    this.cancelIsLoading.set(false);
    this.configHasChanged.set(false);
  }

  isConfigured(): boolean {
    return this.brickVersions().findItem({ name: ClBrick.GWS_CORE, version: null }) != null;
  }

  addGwsCoreBrick(): void {
    this.addGwsCoreIsLoading.set(true);
    this.brickService.getBrickLatestVersion(ClBrick.GWS_CORE).subscribe({
      next: (brick) => this.getGwsCoreBrickSuccess(brick),
      error: () => this.addGwsCoreIsLoading.set(false),
    });
  }

  private getGwsCoreBrickSuccess(brick: LmlBrickVersion): void {
    this.onBrickDialogClosed('add', { name: brick.brickName, version: brick.brickVersion });
    this.addGwsCoreIsLoading.set(false);
  }
}
