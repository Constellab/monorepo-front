import { Component, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { LabCurrentMonitorDTO } from '../../../../lab-core/model/entities/lab-monitor.entity';
import { LabMonitorService } from '../../../../lab-core/entity-service/lab-monitor.service';
import { FlCorePipeModule } from '@monorepo/front-core-lib/fl-core-pipe';
import { FlKeyValueModule } from '@monorepo/front-core-lib/fl-key-value';
import { TranslatePipe } from '@ngx-translate/core';
import { FlCardModule } from '@monorepo/front-core-lib/fl-card';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { FlSectionModule } from '@monorepo/front-core-lib/fl-section';

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
  ],
  templateUrl: './lab-monitoring-current-info.component.html',
  styleUrl: './lab-monitoring-current-info.component.scss',
})
export class LabMonitoringCurrentInfoComponent {
  currentMonitor$: Observable<LabCurrentMonitorDTO> = inject(LabMonitorService).getCurrentMonitor();
}
