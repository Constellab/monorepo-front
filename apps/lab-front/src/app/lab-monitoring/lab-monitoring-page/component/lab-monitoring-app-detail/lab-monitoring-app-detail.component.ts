import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FlKeyValueModule } from '@monorepo/front-core-lib/fl-key-value';
import { LiAppInstance, LiDetailRoutePipe } from '@monorepo/lab-lib/li-core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'lab-monitoring-app-detail',
  imports: [FlKeyValueModule, RouterLink, TranslatePipe, LiDetailRoutePipe],
  templateUrl: './lab-monitoring-app-detail.component.html',
  styleUrl: './lab-monitoring-app-detail.component.scss',
})
export class LabMonitoringAppDetailComponent {
  appInstance = input.required<LiAppInstance>();
}
