import { Component } from '@angular/core';
import { LabInfoComponent } from '../lab-info/lab-info.component';
import { LabBrickListStatusComponent } from '../lab-brick-list-status/lab-brick-list-status.component';

@Component({
  selector: 'lab-lab-monitoring-dashboard-page',
  templateUrl: './lab-monitoring-dashboard-page.component.html',
  styleUrls: ['./lab-monitoring-dashboard-page.component.scss'],
  imports: [LabInfoComponent, LabBrickListStatusComponent],
})
export class LabMonitoringDashboardPageComponent {}
