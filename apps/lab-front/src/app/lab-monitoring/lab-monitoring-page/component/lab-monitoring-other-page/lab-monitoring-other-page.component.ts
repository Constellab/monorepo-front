import { Component } from '@angular/core';
import { LabMonitoringShareLinksComponent } from '../lab-monitoring-share-links/lab-monitoring-share-links.component';
import { LabMonitoringBrickDataComponent } from '../lab-monitoring-brick-data/lab-monitoring-brick-data.component';
import { LabMonitoringAppsStatusComponent } from '../lab-monitoring-apps-status/lab-monitoring-apps-status.component';

@Component({
  selector: 'lab-monitoring-other-page',
  templateUrl: './lab-monitoring-other-page.component.html',
  styleUrl: './lab-monitoring-other-page.component.scss',
  imports: [
    LabMonitoringShareLinksComponent,
    LabMonitoringBrickDataComponent,
    LabMonitoringAppsStatusComponent,
  ],
})
export class LabMonitoringOtherPageComponent {}
