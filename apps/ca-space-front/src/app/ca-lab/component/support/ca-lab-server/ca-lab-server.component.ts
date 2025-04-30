import { Component, inject } from '@angular/core';
import { CaLabDetailPageState } from '../../../state/ca-lab-detail-page.state';
import { Observable } from 'rxjs';
import { CaLabStatusDTO } from '../../../../ca-core/model/entities/lab/ca-lab.class';
import { CaLabDetailServerState } from '../../../state/ca-lab-detail-server.state';
import { FlCardModule } from '@monorepo/front-core-lib/fl-card';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import { FlLoaderModule } from '@monorepo/front-core-lib/fl-loader';
import { FlStatusModule } from '@monorepo/front-core-lib/fl-status';
import { FlDateModule } from '@monorepo/front-core-lib/fl-date';
import { MatExpansionPanel, MatExpansionPanelHeader } from '@angular/material/expansion';
import { CaIsAdminDirective } from '../../../../ca-core/module/ca-core-directive/ca-is-admin/ca-is-admin.directive';
import { AsyncPipe } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'ca-lab-server',
  templateUrl: './ca-lab-server.component.html',
  styleUrls: ['./ca-lab-server.component.scss'],
  imports: [
    FlCardModule,
    FlTextIconModule,
    MatIcon,
    MatButton,
    FlLoaderModule,
    FlStatusModule,
    FlDateModule,
    MatExpansionPanel,
    MatExpansionPanelHeader,
    CaIsAdminDirective,
    AsyncPipe,
    TranslatePipe,
  ],
})
export class CaLabServerComponent {
  private state = inject(CaLabDetailPageState);
  private serverState = inject(CaLabDetailServerState);

  status$: Observable<CaLabStatusDTO> = this.state.getStatus$();

  isCloud$: Observable<boolean> = this.state.isCloud$();

  openServerInfoDialog(): void {
    this.serverState.openServerInfoDialog();
  }

  initServer(): void {
    this.serverState.initServer();
  }

  createServer(): void {
    this.serverState.createServer();
  }

  configureServer(): void {
    this.serverState.configureServer();
  }

  updateLabConfigurerRepo(): void {
    this.serverState.updateLabConfigurerRepo();
  }

  destroyLabConfigurerContainers(): void {
    this.serverState.destroyLabConfigurerContainers();
  }

  migrateToGithub(): void {
    this.serverState.migrateToGithub();
  }

  deleteServer(): void {
    this.serverState.deleteServer();
  }

  stopCurrentServerTask(): void {
    this.serverState.stopCurrentServerTask();
  }
}
