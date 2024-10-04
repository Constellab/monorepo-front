import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { CaScenario } from '../../../../../ca-core/model/entities/folder/ca-scenario.class';
import { CaScenarioService } from '../../../../../ca-core/service-api/ca-scenario.service';

/**
 * Preview of the scenario in the folder detail page right section
 */
@Component({
  selector: 'ca-folder-scenario-preview',
  templateUrl: './ca-folder-scenario-preview.component.html',
  styleUrls: ['./ca-folder-scenario-preview.component.scss']
})
export class CaFolderScenarioPreviewComponent implements OnInit {

  @Input() scenarioId: string;

  scenario$: Observable<CaScenario>;

  constructor(private scenarioService: CaScenarioService) {
  }

  ngOnInit(): void {
    this.scenario$ = this.scenarioService.findById(this.scenarioId);
  }

}
