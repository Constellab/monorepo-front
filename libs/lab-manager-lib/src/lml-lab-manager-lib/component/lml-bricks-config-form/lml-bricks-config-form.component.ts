import { ChangeDetectionStrategy,Component, EventEmitter, inject, Input, Output, ViewContainerRef } from '@angular/core';
import { ClBrick } from '@monorepo/core-lib';
import {
  FlConfirmDialogInput,
  FlConfirmDialogResult,
  FlDialogService,
} from '@monorepo/front-core-lib/fl-dialog';
import { FlSnackBarService } from '@monorepo/front-core-lib/fl-snack-bar';

import { LmlBrickService } from '../../lml-brick.service';
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
 * Form to update the lab config
 */
@Component({
  selector: 'lml-bricks-config-form',
  templateUrl: './lml-bricks-config-form.component.html',
  styleUrls: ['./lml-bricks-config-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class LmlBricksConfigFormComponent {
  @Input({ required: true }) brickVersions: LmlBrickVersionDTODatasource;

  @Output() configChange: EventEmitter<LmlLabManagerConfig> = new EventEmitter<LmlLabManagerConfig>();

  @Input() showAdvanced: boolean = true;

  @Input() warningOnRemoveBrick: boolean = true;

  columns = ['name', 'version', 'actions'];

  addGwsCoreIsLoading: boolean = false;

  private snackBarService = inject(FlSnackBarService);
  private dialogService = inject(FlDialogService);
  private brickService = inject(LmlBrickService);
  private viewContainerRef = inject(ViewContainerRef);

  openBrickVersionDetailDialog(brickVersionDTO: LmlLabManagerBrickVersionDTO): void {
    const data: LmlBrickVersionDetailDialogInput = {
      brickName: brickVersionDTO.name,
      brickVersion: brickVersionDTO.version,
    };

    this.dialogService.openSmallDialog(LmlBrickVersionDetailDialogComponent, {
      data: data,
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

    const existingVersion = this.brickVersions.findItem(brickVersionDTO);
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
      this.brickVersions.updateItem(brickVersionDTO);
    } else {
      this.brickVersions.addItem(brickVersionDTO);
    }
    this.configChange.emit(this.brickVersions.toLabManagerConfig());
  }

  openDeleteBrickConfirmDialog(brickVersionDTO: LmlLabManagerBrickVersionDTO): void {
    if (this.warningOnRemoveBrick) {
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
    this.brickVersions.removeItem(brickVersionDTO);
    this.configChange.emit(this.brickVersions.toLabManagerConfig());
  }

  isConfigured(): boolean {
    return this.brickVersions.findItem({ name: ClBrick.GWS_CORE, version: null }) != null;
  }

  addGwsCoreBrick(): void {
    this.addGwsCoreIsLoading = true;
    this.brickService.getBrickLatestVersion(ClBrick.GWS_CORE).subscribe({
      next: (brick) => this.getGwsCoreBrickSuccess(brick),
      error: () => (this.addGwsCoreIsLoading = false),
    });
  }

  private getGwsCoreBrickSuccess(brick: LmlBrickVersion): void {
    this.onBrickDialogClosed('add', { name: brick.brickName, version: brick.brickVersion });
    this.addGwsCoreIsLoading = false;
  }
}
