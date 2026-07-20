import { Component, inject, OnDestroy, OnInit, ViewContainerRef } from '@angular/core';
import {
  FlConfirmDialogInput,
  FlConfirmDialogResult,
  FlDialogService,
} from '@monorepo/front-core-lib/fl-dialog';
import { FlSnackBarService } from '@monorepo/front-core-lib/fl-snack-bar';

import { LmlLabManagerService } from '../../lml-lab-manager.service';
import {
  LmlCustomEnvVarDatasource,
  LmlCustomEnvVariableDTO,
  LmlCustomEnvVariablesDTO,
} from '../../model/lml-lab-manager.class';
import {
  LmlConfigureEnvVarDialogComponent,
  LmlConfigureEnvVarDialogInput,
} from '../lml-configure-env-var-dialog/lml-configure-env-var-dialog.component';

/**
 * Edit the lab's custom env variables as a list of key/value rows, saved as a whole
 * map. Mirrors the bricks-config editor (mat-table + add/edit/delete dialogs). The MCP
 * flag is excluded from this list (see LmlCustomEnvVarDatasource) -- it has its own
 * toggle. Changes take effect only after a lab restart.
 */
@Component({
  selector: 'lml-custom-env-config',
  templateUrl: './lml-custom-env-config.component.html',
  styleUrls: ['./lml-custom-env-config.component.scss'],
  standalone: false,
})
export class LmlCustomEnvConfigComponent implements OnInit, OnDestroy {
  variables: LmlCustomEnvVarDatasource;
  configHasChanged: boolean = false;

  getIsLoading: boolean = true;
  saveIsLoading: boolean = false;

  columns = ['key', 'value', 'actions'];

  private managerApiService = inject(LmlLabManagerService);
  private snackBarService = inject(FlSnackBarService);
  private dialogService = inject(FlDialogService);
  private viewContainerRef = inject(ViewContainerRef);

  ngOnInit(): void {
    this.managerApiService.getCustomEnvVariables().subscribe({
      next: (dto) => this.getSuccess(dto),
      error: () => (this.getIsLoading = false),
    });
  }

  private getSuccess(dto: LmlCustomEnvVariablesDTO): void {
    this.variables = new LmlCustomEnvVarDatasource(LmlCustomEnvVarDatasource.fromDto(dto), true);
    this.getIsLoading = false;
  }

  openEnvVarForm(envVar?: LmlCustomEnvVariableDTO): void {
    const data: LmlConfigureEnvVarDialogInput = { envVar };
    this.dialogService
      .openSmallDialog(LmlConfigureEnvVarDialogComponent, {
        data,
        viewContainerRef: this.viewContainerRef,
      })
      .afterClosed()
      .subscribe((result: LmlCustomEnvVariableDTO | undefined) =>
        this.onEnvVarDialogClosed(envVar == null ? 'add' : 'update', result)
      );
  }

  private onEnvVarDialogClosed(mode: 'add' | 'update', envVar?: LmlCustomEnvVariableDTO): void {
    if (!envVar) return;

    const existing = this.variables.findItem(envVar);
    if (mode === 'add' && existing) {
      this.snackBarService.openErrorMessage({
        text: 'lml.custom_env_already_exists',
        translateText: true,
        translateParam: { param: { key: envVar.key } },
      });
      return;
    }

    if (existing) {
      this.variables.updateItem(envVar);
    } else {
      this.variables.addItem(envVar);
    }
    this.configHasChanged = true;
  }

  openDeleteConfirmDialog(envVar: LmlCustomEnvVariableDTO): void {
    const data: FlConfirmDialogInput = {
      title: 'lml.custom_env_remove',
      content: 'lml.custom_env_remove_confirmation',
    };
    this.dialogService
      .openConfirmDialog(data)
      .afterClosed()
      .subscribe((result: FlConfirmDialogResult) => {
        if (result.choice) {
          this.variables.removeItem(envVar);
          this.configHasChanged = true;
        }
      });
  }

  saveConfig(): void {
    this.saveIsLoading = true;
    this.managerApiService.updateCustomEnvVariables(this.variables.toDto()).subscribe({
      next: () => this.saveSuccess(),
      error: () => (this.saveIsLoading = false),
    });
  }

  private saveSuccess(): void {
    this.saveIsLoading = false;
    this.snackBarService.openSuccessMessage(
      {
        text: 'lml.custom_env_updated',
        translateText: true,
      },
      10000
    );
    this.configHasChanged = false;
  }

  ngOnDestroy(): void {
    if (this.variables) {
      this.variables.manualDisconnect();
    }
  }
}
