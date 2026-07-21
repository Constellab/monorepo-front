import { ChangeDetectionStrategy,Component } from '@angular/core';

import { LabBrickListStatusComponent } from '../lab-brick-list-status/lab-brick-list-status.component';
import { LabInfoComponent } from '../lab-info/lab-info.component';

@Component({
  selector: 'lab-monitoring-dashboard-page',
  templateUrl: './lab-monitoring-dashboard-page.component.html',
  styleUrls: ['./lab-monitoring-dashboard-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [LabInfoComponent, LabBrickListStatusComponent],
})
export class LabMonitoringDashboardPageComponent {}
