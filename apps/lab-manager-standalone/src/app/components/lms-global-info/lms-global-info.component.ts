import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FlCardModule } from '@monorepo/front-core-lib/fl-card';
import { FlPortalActionsService } from '@monorepo/front-core-lib/fl-portal-actions';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { FlTranslateModule } from '@monorepo/front-core-lib/fl-translate';
import { LmlLabManagerLibModule, LmlLabManagerState } from '@monorepo/lab-manager-lib';

import { LmsLabService } from '../../service/lms-lab.service';
import { LmsLabState } from '../../service/lms-lab.state';

@Component({
  selector: 'lms-global-info',
  imports: [
    FlCardModule,
    FlTextIconModule,
    FlTranslateModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    LmlLabManagerLibModule,
  ],
  templateUrl: './lms-global-info.component.html',
  styleUrl: './lms-global-info.component.scss',
})
export class LmsGlobalInfoComponent {
  private state = inject(LmsLabState);
  private labManagerState = inject(LmlLabManagerState);
  private actionService = inject(FlPortalActionsService);
  private labService = inject(LmsLabService);

  labStatus = this.state.labManagerStatus;
  labIsRunning = this.state.labIsRunning;
  labManagerIsRunning = this.state.labManagerIsRunning;

  refresh(): void {
    this.state.refreshStatus();
  }

  configureLabManager(): void {
    this.labManagerState.configureLabManager();
  }

  startLab(): void {
    this.labManagerState.initLab('lms.start_lab');
  }

  stopLab(): void {
    this.actionService
      .addAction({
        action: this.labService.stopLab(),
        text: { text: 'lms.stop_lab', translateText: true },
        type: 'stop-lab',
      })
      ?.subscribe(() => this.labManagerState.refreshStatus());
  }
}
