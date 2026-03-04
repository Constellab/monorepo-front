import { Component, inject, input, output } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { FlCardModule } from '@monorepo/front-core-lib/fl-card';
import {
  FlConfirmDialogInput,
  FlConfirmDialogResult,
  FlDialogService,
} from '@monorepo/front-core-lib/fl-dialog';
import { FlKeyValueModule } from '@monorepo/front-core-lib/fl-key-value';
import { FlUserModule } from '@monorepo/front-core-lib/fl-user';
import { LiAppProcessStatus, LiAppService } from '@monorepo/lab-lib/li-core';
import { TranslatePipe } from '@ngx-translate/core';

import { LabMonitoringAppDetailComponent } from '../lab-monitoring-app-detail/lab-monitoring-app-detail.component';

@Component({
  selector: 'lab-app-detail',
  templateUrl: './lab-app-detail.component.html',
  styleUrl: './lab-app-detail.component.scss',
  imports: [
    FlCardModule,
    FlKeyValueModule,
    FlUserModule,
    MatButton,
    TranslatePipe,
    LabMonitoringAppDetailComponent,
  ],
})
export class LabAppDetailComponent {
  private appService = inject(LiAppService);
  private dialogService = inject(FlDialogService);

  process = input.required<LiAppProcessStatus>();
  stopped = output<void>();

  stopProcess(): void {
    const input: FlConfirmDialogInput = {
      title: 'monitoring.app_stop_process',
      content: 'monitoring.app_stop_process_confirmation',
      observable: this.appService.stopProcess(this.process().id),
      successMessage: 'monitoring.app_stopped',
    };

    this.dialogService
      .openConfirmDialog(input)
      .afterClosed()
      .subscribe((result: FlConfirmDialogResult) => {
        if (result.choice) {
          this.stopped.emit();
        }
      });
  }
}
