import { Component, Input } from '@angular/core';
import { CaScenario } from '../../../../../ca-core/model/entities/folder/ca-scenario.class';
import { TeBasicConfig } from '@monorepo/text-editor';

@Component({
    selector: 'ca-scenario-info',
    templateUrl: './ca-scenario-info.component.html',
    styleUrls: ['./ca-scenario-info.component.scss'],
    standalone: false
})
export class CaScenarioInfoComponent {
  @Input() scenario: CaScenario;

  textEditorConfig = new TeBasicConfig();
}
