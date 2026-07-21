import { ChangeDetectionStrategy,Component } from '@angular/core';
import { FlCardModule } from '@monorepo/front-core-lib/fl-card';
import { LiCredentialsSearchComponent } from '@monorepo/lab-lib/li-credentials';

@Component({
  selector: 'lab-monitoring-credentials-page',
  templateUrl: './lab-monitoring-credentials-page.component.html',
  styleUrls: ['./lab-monitoring-credentials-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [FlCardModule, LiCredentialsSearchComponent],
})
export class LabMonitoringCredentialsPageComponent {}
