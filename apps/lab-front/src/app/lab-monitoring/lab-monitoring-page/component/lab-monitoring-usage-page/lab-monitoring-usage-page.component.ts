import { ChangeDetectionStrategy,Component } from '@angular/core';

import { LabMonitoringCurrentInfoComponent } from '../lab-monitoring-current-info/lab-monitoring-current-info.component';
import { LabMonitoringDetailComponent } from '../lab-monitoring-detail/lab-monitoring-detail.component';

/**
 * Sub monitoring page to display the CPU, RAM, Disk and Swap usage.
 */
@Component({
  selector: 'lab-monitoring-usage-page',
  templateUrl: './lab-monitoring-usage-page.component.html',
  styleUrls: ['./lab-monitoring-usage-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [LabMonitoringCurrentInfoComponent, LabMonitoringDetailComponent],
})
export class LabMonitoringUsagePageComponent {}
