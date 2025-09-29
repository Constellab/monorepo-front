import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FlCardModule } from '@monorepo/front-core-lib/fl-card';
import { FlLoaderModule } from '@monorepo/front-core-lib/fl-loader';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { FlTranslateModule } from '@monorepo/front-core-lib/fl-translate';
import { LmlLabManagerState } from '@monorepo/lab-manager-lib';

import { LmsLabState } from '../../service/lms-lab.state';

@Component({
  selector: 'lms-global-info',
  imports: [
    FlCardModule,
    FlTextIconModule,
    FlTranslateModule,
    MatIconModule,
    MatButtonModule,
    FlLoaderModule,
  ],
  templateUrl: './lms-global-info.component.html',
  styleUrl: './lms-global-info.component.scss',
})
export class LmsGlobalInfoComponent {
  private state = inject(LmsLabState);
  private labManagerState = inject(LmlLabManagerState);

  labStatus = this.state.labManagerStatus;
  labIsRunning = this.state.labIsRunning;
  labManagerIsRunning = this.state.labManagerIsRunning;

  labIsStarting = this.state.labIsStarting;

  refresh(): void {
    this.state.refreshStatus();
  }

  configureLabManager(): void {
    this.labManagerState.configureLabManager();
  }

  startLab(): void {
    this.labManagerState.initLab('lms.start_lab');
  }
}
