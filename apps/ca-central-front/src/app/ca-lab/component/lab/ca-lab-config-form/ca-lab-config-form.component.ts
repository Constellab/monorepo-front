import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  FlConfirmDialogInput,
  FlConfirmDialogResult,
  FlDialogService,
  FlSnackBarService,
} from '@monorepo/front-core-lib';
import {
  CaLabManagerBrickVersionDTO,
  CaLabManagerConfig,
} from '../../../../ca-core/model/entities/lab/ca-lab-manager.class';
import { CaLabConfigBrickComponent } from '../ca-lab-config-brick/ca-lab-config-brick.component';
import {
  CaBrickVersionDetailDialogComponent,
  CaBrickVersionDetailDialogInput,
} from '../../../../ca-core/entity-module/ca-brick-core/component/ca-brick-version-detail-dialog/ca-brick-version-detail-dialog.component';
import { TdBrick } from '@monorepo/technical-doc';

/**
 * Form to update the lab config
 */
@Component({
  selector: 'ca-lab-config-form',
  templateUrl: './ca-lab-config-form.component.html',
  styleUrls: ['./ca-lab-config-form.component.scss'],
})
export class CaLabConfigFormComponent {
  @Input({ required: true }) labConfig: CaLabManagerConfig;

  @Output() labConfigChange: EventEmitter<CaLabManagerConfig> = new EventEmitter<CaLabManagerConfig>();

  @Input() showAdvanced: boolean = true;

  @Input() warningOnRemoveBrick: boolean = true;

  constructor(
    private snackBarService: FlSnackBarService,
    private dialogService: FlDialogService
  ) {}

  openBrickVersionDetailDialog(brickVersionDTO: CaLabManagerBrickVersionDTO): void {
    const data: CaBrickVersionDetailDialogInput = {
      brickName: brickVersionDTO.name,
      brickVersion: brickVersionDTO.version,
    };

    this.dialogService.openSmallDialog(CaBrickVersionDetailDialogComponent, { data: data });
  }

  openBrickVersionForm(brickVersionDTO?: CaLabManagerBrickVersionDTO): void {
    this.dialogService
      .openBigDialog(CaLabConfigBrickComponent, { data: brickVersionDTO })
      .afterClosed()
      .subscribe((brickVersion) =>
        this.onBrickDialogClosed(brickVersionDTO == null ? 'add' : 'update', brickVersion)
      );
  }

  private onBrickDialogClosed(mode: 'add' | 'update', brickVersionDTO?: CaLabManagerBrickVersionDTO): void {
    if (!brickVersionDTO) return;

    const brick = this.labConfig.brickVersions.find(
      (brickVersion) => brickVersion.name === brickVersionDTO.name
    );
    if (mode === 'add' && brick) {
      this.snackBarService.openErrorMessage({
        text: 'lab_brick_already_exists',
        translateText: true,
        translateParam: { param: { brickName: brickVersionDTO.name } },
      });
      return;
    }

    // if this is an update
    if (brick) {
      brick.version = brickVersionDTO.version;
    } else {
      this.labConfig.brickVersions.push(brickVersionDTO);
    }
    this.resetGlabTagToDefault();
    this.labConfigChange.emit(this.labConfig);
  }

  openDeleteBrickConfirmDialog(brickVersionDTO: CaLabManagerBrickVersionDTO): void {
    if (this.warningOnRemoveBrick) {
      const data: FlConfirmDialogInput = {
        title: 'lab_remove_brick',
        content: 'lab_remove_brick_confirmation',
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
    brickVersionDTO: CaLabManagerBrickVersionDTO
  ): void {
    if (result.choice) {
      this.deleteBrickVersion(brickVersionDTO);
    }
  }

  private deleteBrickVersion(brickVersionDTO: CaLabManagerBrickVersionDTO): void {
    this.labConfig.brickVersions = this.labConfig.brickVersions.filter(
      (brick) => brick.name !== brickVersionDTO.name
    );
    this.resetGlabTagToDefault();
    this.labConfigChange.emit(this.labConfig);
  }

  resetGlabTagToDefault(): void {
    this.labConfig.glabTag = '';
  }

  isConfigured(): boolean {
    return (
      this.labConfig?.brickVersions?.length > 0 &&
      this.labConfig.brickVersions.find((brick) => brick.name === TdBrick.GWS_CORE) != null
    );
  }
}
