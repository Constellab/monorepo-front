import { Component } from '@angular/core';
import { FlCardModule } from '@monorepo/front-core-lib/fl-card';
import { LiActivitySearchComponent } from '@monorepo/lab-lib/li-activity';

@Component({
  selector: 'lab-monitoring-page-activity',
  templateUrl: './lab-monitoring-activity-page.component.html',
  styleUrls: ['./lab-monitoring-activity-page.component.scss'],
  imports: [FlCardModule, LiActivitySearchComponent],
})
export class LabMonitoringActivityPageComponent {}
