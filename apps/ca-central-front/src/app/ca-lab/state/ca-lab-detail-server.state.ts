import { inject, Injectable } from '@angular/core';
import { CaLabService } from '../../ca-core/service-api/ca-lab.service';
import {
  CaLabServerCompleteInfoDialogComponent,
} from '../component/server/ca-lab-server-complete-info-dialog/ca-lab-server-complete-info-dialog.component';
import { CaLabDetailPageState } from './ca-lab-detail-page.state';
import {
  FlConfirmDialogInput,
  FlConfirmDialogResult,
  FlDialogService,
} from '@monorepo/front-core-lib/fl-dialog';
import { FlPortalActionsService } from '@monorepo/front-core-lib/fl-portal-actions';
import { FlTranslatableText } from '@monorepo/front-core-lib/fl-translate';

import { Observable } from 'rxjs';
import {
  CaLabManagerUpdateDialogComponent,
  CaLabManagerUpdateDialogInput,
} from '../component/manager/ca-lab-manager-update-dialog/ca-lab-manager-update-dialog.component';

/**
 * State in the lab detail page to manage the server status.
 */
@Injectable()
export class CaLabDetailServerState {
  private state = inject(CaLabDetailPageState);
  private labService = inject(CaLabService);
  private dialogService = inject(FlDialogService);
  private portalService = inject(FlPortalActionsService);

  openServerInfoDialog(): void {
    this.dialogService.openMediumDialog(CaLabServerCompleteInfoDialogComponent, {
      data: this.state.getLabId(),
    });
  }

  initServer(): void {
    const input: FlConfirmDialogInput = {
      title: 'lab_init_server',
      content: 'lab_init_server_confirmation',
    };

    this.openDialog(input, this.labService.initServer(this.state.getLabId()));
  }

  createServer(): void {
    const input: FlConfirmDialogInput = {
      title: 'lab_create_server',
      content: 'lab_create_server_confirmation',
    };

    this.openDialog(input, this.labService.createServer(this.state.getLabId()));
  }

  configureServer(): void {
    const input: FlConfirmDialogInput = {
      title: 'lab_configure_server',
      content: 'lab_configure_server_confirmation',
    };

    this.openDialog(input, this.labService.configureServer(this.state.getLabId()));
  }

  updateLabManager(currentVersion: string, recommendedVersion: string): void {
    const input: CaLabManagerUpdateDialogInput = {
      labId: this.state.getLabId(),
      labManagerCurrentVersion: currentVersion,
      labManagerRecommendedVersion: recommendedVersion,
    };

    this.dialogService
      .openSmallDialog(CaLabManagerUpdateDialogComponent, { data: input })
      .afterClosed()
      .subscribe((result: Observable<any>) => {
        if (result) {
          this.addPortalAction('lab_update_lab_manager', result);
        }
      });
  }

  updateLabConfigurerRepo(): void {
    const input: FlConfirmDialogInput = {
      title: 'lab_update_lab_configurer_repo',
      content: 'lab_update_lab_configurer_repo_confirmation',
    };

    this.openDialog(input, this.labService.updateLabConfigurerRepository(this.state.getLabId()));
  }

  destroyLabConfigurerContainers(): void {
    const input: FlConfirmDialogInput = {
      title: 'lab_configurer_destroy_containers',
      content: 'lab_configurer_destroy_containers_confirmation',
    };

    this.openDialog(input, this.labService.destroyLabConfigurerContainers(this.state.getLabId()));
  }

  migrateToGithub(): void {
    const input: FlConfirmDialogInput = {
      title: 'lab_configurer_migrate',
      content: 'lab_configurer_migrate_confirmation',
    };

    this.openDialog(input, this.labService.migrateToGithub(this.state.getLabId()));
  }

  deleteServer(): void {
    const input: FlConfirmDialogInput = {
      title: 'lab_delete_server',
      content: 'lab_delete_server_confirmation',
    };

    this.openDialog(input, this.labService.deleteServer(this.state.getLabId()));
  }

  stopCurrentServerTask(): void {
    const input: FlConfirmDialogInput = {
      title: 'lab_stop_current_task',
      content: 'lab_stop_current_task_confirmation',
    };

    this.openDialog(input, this.labService.stopCurrentServerTask(this.state.getLabId()));
  }

  private openDialog(input: FlConfirmDialogInput, action: Observable<any>): void {
    this.dialogService
      .openConfirmDialog(input)
      .afterClosed()
      .subscribe((result: FlConfirmDialogResult) => this.onDialogClosed(result, input.title, action));
  }

  private onDialogClosed(
    result: FlConfirmDialogResult,
    text: FlTranslatableText,
    action: Observable<any>
  ): void {
    if (result.choice) {
      this.addPortalAction(text, action);
    }
  }

  private addPortalAction(text: FlTranslatableText, action: Observable<any>): void {
    this.portalService.addAction({
      type: CaLabDetailPageState.actionType,
      text: text,
      action: action,
    });
  }
}
