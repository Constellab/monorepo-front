import { ChangeDetectionStrategy,Component } from '@angular/core';
import { LiScenarioTemplateSearchComponent } from '@monorepo/lab-lib/li-scenario-template';

@Component({
  selector: 'lab-scenario-templates-page',
  templateUrl: './lab-scenario-templates-search-page.component.html',
  styleUrl: './lab-scenario-templates-search-page.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [LiScenarioTemplateSearchComponent],
})
export class LabScenarioTemplatesSearchPageComponent {}
