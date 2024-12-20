import { Component, inject } from '@angular/core';
import { FlCardModule, FlLoaderModule, FlTextIconModule, FlTranslateModule } from '@monorepo/front-core-lib';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { LmsLabState } from '../../service/lms-lab.state';
import { LmlLabManagerState } from '@monorepo/lab-manager-lib';

@Component({
  selector: 'lms-global-info',
  standalone: true,
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

  stopLab(): void {
    this.labManagerState.stopContainers();
  }

  startLab(): void {
    this.labManagerState.initLab('lms.start_lab');
  }
}
