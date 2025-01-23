import { Component } from '@angular/core';
import { FlCardModule } from '@monorepo/front-core-lib/fl-card';
import { LabActivitySearchComponent } from '../../../../lab-core/entity-module/lab-activity-core/component/lab-activity-search/lab-activity-search.component';

@Component({
  selector: 'lab-monitoring-page-activity',
  templateUrl: './lab-monitoring-activity-page.component.html',
  styleUrls: ['./lab-monitoring-activity-page.component.scss'],
  imports: [FlCardModule, LabActivitySearchComponent],
})
export class LabMonitoringActivityPageComponent {}
