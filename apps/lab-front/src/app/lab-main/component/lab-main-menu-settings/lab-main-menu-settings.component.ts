import { Component, inject, OnInit } from '@angular/core';
import { FlConfirmDialogInput, FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import { FlExpansionMenuModule } from '@monorepo/front-core-lib/fl-expansion-menu';
import { FlIconModule } from '@monorepo/front-core-lib/fl-svg-icon';
import { LabEnvDevDirective } from '../../../lab-core/directive/lab-env-dev.directive';
import { LabEnvironmentToggleComponent } from '../lab-environment-toggle/lab-environment-toggle.component';
import { LabQueueJobsDialogComponent } from '../lab-queue-jobs-dialog/lab-queue-jobs-dialog.component';
import {
  labConstLoginRoute,
  LiAuthService,
  LiRouterService,
  LiSystemInfo,
  LiSystemService,
} from '@monorepo/lab-lib/li-core';
import { MatButton } from '@angular/material/button';
import { MatDivider } from '@angular/material/divider';
import { MatIcon } from '@angular/material/icon';
import { MatMenu, MatMenuContent, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { Router, RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { LabEnvironmentHelper } from '../../../lab-core/lab-environment.helper';
import { LabEnvStore } from '../../../lab-core/lab-env.store';

/**
 * Component for the settings button on top right of the screen
 */
@Component({
  selector: 'lab-main-menu-settings',
  templateUrl: './lab-main-menu-settings.component.html',
  styleUrls: ['./lab-main-menu-settings.component.scss'],
  imports: [
    MatButton,
    FlExpansionMenuModule,
    MatMenuTrigger,
    MatIcon,
    MatMenu,
    MatMenuContent,
    MatMenuItem,
    FlIconModule,
    LabEnvironmentToggleComponent,
    LabEnvDevDirective,
    MatDivider,
    RouterLink,
    TranslatePipe,
  ],
})
export class LabMainMenuSettingsComponent implements OnInit {
  private authenticationService = inject(LiAuthService);
  private router = inject(Router);
  private dialogService = inject(FlDialogService);
  private systemService = inject(LiSystemService);
  private labEnvStore = inject(LabEnvStore);

  codeServerUrl: string;

  monitoringRoute = LiRouterService.getMonitoringRoute();

  labConfigRoute: string;

  ngOnInit(): void {
    this.codeServerUrl = LabEnvironmentHelper.getCodelabFullUrl();

    this.systemService.getSystemInfo().subscribe((systemInfo) => this.getSystemInfoSuccess(systemInfo));
  }

  private getSystemInfoSuccess(systemInfo: LiSystemInfo): void {
    this.labConfigRoute = LabEnvironmentHelper.getSpaceConfigLabUrl(systemInfo.id);
  }

  logout(): void {
    this.authenticationService.logout().subscribe(() => this.router.navigate([labConstLoginRoute]));
  }

  resetDevEnvironment(): void {
    const data: FlConfirmDialogInput = {
      title: 'reset_dev_env',
      content: 'reset_dev_env_confirmation',
      observable: this.systemService.resetDevEnvironment(),
      successMessage: 'dev_env_reset_success',
      confirmWithText: 'reset-dev-env',
    };

    this.dialogService.openConfirmDialog(data);
  }

  stopDevServer(): void {
    const data: FlConfirmDialogInput = {
      title: 'stop_dev_api',
      content: 'stop_dev_api_confirmation',
      observable: this.systemService.killApi(),
      successMessage: 'dev_api_stooped',
    };

    this.dialogService.openConfirmDialog(data).afterClosed().subscribe(
      () => this.labEnvStore.setLabEnvironment('prod')
    );
  }

  openQueueJobsDialog(): void {
    this.dialogService.openMediumDialog(LabQueueJobsDialogComponent);
  }
}
