import { ChangeDetectionStrategy,Component } from '@angular/core';
import { LiScenarioSearchComponent } from '@monorepo/lab-lib/li-scenario';

@Component({
  selector: 'lab-scenarios-page-list',
  templateUrl: './lab-scenarios-list-page.component.html',
  styleUrls: ['./lab-scenarios-list-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [LiScenarioSearchComponent],
})
export class LabScenariosListPageComponent {}
