import { ChangeDetectionStrategy,Component } from '@angular/core';
import { FlCardModule } from '@monorepo/front-core-lib/fl-card';
import { LiLabSearchComponent } from '@monorepo/lab-lib/li-lab';

@Component({
  selector: 'lab-monitoring-lab-page',
  templateUrl: './lab-monitoring-lab-page.component.html',
  styleUrls: ['./lab-monitoring-lab-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [FlCardModule, LiLabSearchComponent],
})
export class LabMonitoringLabPageComponent {}
