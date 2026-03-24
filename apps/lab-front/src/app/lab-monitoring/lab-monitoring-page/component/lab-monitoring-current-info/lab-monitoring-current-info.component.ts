import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FlCardModule } from '@monorepo/front-core-lib/fl-card';
import { FlCorePipeModule } from '@monorepo/front-core-lib/fl-core-pipe';
import { FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import { FlKeyValueModule } from '@monorepo/front-core-lib/fl-key-value';
import { FlSectionModule } from '@monorepo/front-core-lib/fl-section';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { LiCurrentMonitorDTO, LiMonitorService } from '@monorepo/lab-lib/li-core';
import { LiFolderSizesDialogComponent, LiMonitorDiskComponent } from '@monorepo/lab-lib/li-monitor';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable } from 'rxjs';

/**
 * Show the current monitoring information.
 */
@Component({
  selector: 'lab-monitoring-current-info',
  imports: [
    FlCorePipeModule,
    FlKeyValueModule,
    TranslatePipe,
    FlCardModule,
    FlTextIconModule,
    FlSectionModule,
    LiMonitorDiskComponent,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './lab-monitoring-current-info.component.html',
  styleUrl: './lab-monitoring-current-info.component.scss',
})
export class LabMonitoringCurrentInfoComponent {
  private dialogService = inject(FlDialogService);

  currentMonitor$: Observable<LiCurrentMonitorDTO> = inject(LiMonitorService).getCurrentMonitor();

  openFolderSizesDialog(): void {
    this.dialogService.openMediumDialog(LiFolderSizesDialogComponent);
  }
}
