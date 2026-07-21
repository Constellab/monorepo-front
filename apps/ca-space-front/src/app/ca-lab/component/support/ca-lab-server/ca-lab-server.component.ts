import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy,Component, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatExpansionPanel, MatExpansionPanelHeader } from '@angular/material/expansion';
import { MatIcon } from '@angular/material/icon';
import { FlCardModule } from '@monorepo/front-core-lib/fl-card';
import { FlDateModule } from '@monorepo/front-core-lib/fl-date';
import { FlLoaderModule } from '@monorepo/front-core-lib/fl-loader';
import { FlStatusModule } from '@monorepo/front-core-lib/fl-status';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import { CaIsAdminDirective } from '../../../../ca-core/module/ca-core-directive/ca-is-admin/ca-is-admin.directive';
import { CaLabDetailPageState } from '../../../state/ca-lab-detail-page.state';
import { CaLabDetailServerState } from '../../../state/ca-lab-detail-server.state';

@Component({
  selector: 'ca-lab-server',
  templateUrl: './ca-lab-server.component.html',
  styleUrls: ['./ca-lab-server.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
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
  private serverState = inject(CaLabDetailServerState);

  isCloud$: Observable<boolean> = inject(CaLabDetailPageState).isCloud$();

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

  restartInstance(): void {
    this.serverState.restartInstance();
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

  migrateToDnsChallenge(): void {
    this.serverState.migrateToDnsChallenge();
  }

  migrateToLabManagerV2(): void {
    this.serverState.migrateToLabManagerV2();
  }

  deleteServer(): void {
    this.serverState.deleteServer();
  }

  stopCurrentServerTask(): void {
    this.serverState.stopCurrentServerTask();
  }
}
