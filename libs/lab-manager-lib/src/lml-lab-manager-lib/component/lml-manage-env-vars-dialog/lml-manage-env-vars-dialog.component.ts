import { Component, inject, OnDestroy, OnInit, signal, ViewContainerRef } from '@angular/core';
import { FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import { FlSnackBarService } from '@monorepo/front-core-lib/fl-snack-bar';

import { LmlLabManagerService } from '../../lml-lab-manager.service';
import { LmlLabManagerState } from '../../lml-lab-manager.state';
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
 * Dialog for managing all custom env variables (add / edit / delete / save).
 * Opened from the env-var row inside the Advanced configuration section.
 */
@Component({
  selector: 'lml-manage-env-vars-dialog',
  templateUrl: './lml-manage-env-vars-dialog.component.html',
  styleUrls: ['./lml-manage-env-vars-dialog.component.scss'],
  standalone: false,
})
export class LmlManageEnvVarsDialogComponent implements OnInit, OnDestroy {
  variables: LmlCustomEnvVarDatasource;
  readonly configHasChanged = signal(false);
  readonly getIsLoading = signal(true);
  readonly saveIsLoading = signal(false);

  columns = ['key', 'value', 'actions'];

  private managerApiService = inject(LmlLabManagerService);
  private managerState = inject(LmlLabManagerState);
  private snackBarService = inject(FlSnackBarService);
  private dialogService = inject(FlDialogService);
  private viewContainerRef = inject(ViewContainerRef);

  ngOnInit(): void {
    this.managerApiService.getCustomEnvVariables().subscribe({
      next: (dto) => this.getSuccess(dto),
      error: () => this.getIsLoading.set(false),
    });
  }

  private getSuccess(dto: LmlCustomEnvVariablesDTO): void {
    this.variables = new LmlCustomEnvVarDatasource(LmlCustomEnvVarDatasource.fromDto(dto), true);
    this.getIsLoading.set(false);
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
    this.configHasChanged.set(true);
  }

  deleteEnvVar(envVar: LmlCustomEnvVariableDTO): void {
    // Deletion only affects the local list; it is persisted on save, so no confirmation.
    this.variables.removeItem(envVar);
    this.configHasChanged.set(true);
  }

  saveConfig(): void {
    this.saveIsLoading.set(true);
    this.managerApiService.updateCustomEnvVariables(this.variables.toDto()).subscribe({
      next: () => this.saveSuccess(),
      error: () => this.saveIsLoading.set(false),
    });
  }

  private saveSuccess(): void {
    this.saveIsLoading.set(false);
    this.configHasChanged.set(false);
    // Env-var changes only take effect after a restart, like the other config sub-forms, so use
    // the shared handler (success snackbar with a restart action + status refresh).
    this.managerState.onConfigSavedNeedsRestart({ text: 'lml.custom_env_updated', translateText: true });
  }

  ngOnDestroy(): void {
    this.variables?.manualDisconnect();
  }
}
