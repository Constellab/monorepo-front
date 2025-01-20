import { Component, Inject } from '@angular/core';
import { FlArrayObs, FlTranslatableText } from '@monorepo/front-core-lib';
import { CaScenario } from '../../../../../ca-core/model/entities/folder/ca-scenario.class';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface CaScenariosListDialogInput {
  scenarios: FlArrayObs<CaScenario>;
  title: FlTranslatableText;
}

@Component({
    selector: 'ca-scenarios-table-dialog',
    templateUrl: './ca-scenario-table-dialog.component.html',
    styleUrl: './ca-scenario-table-dialog.component.scss',
    standalone: false
})
export class CaScenarioTableDialogComponent {
  scenarios: FlArrayObs<CaScenario>;
  title: FlTranslatableText;

  constructor(@Inject(MAT_DIALOG_DATA) data: CaScenariosListDialogInput) {
    this.scenarios = data.scenarios;
    this.title = data.title;
  }
}
