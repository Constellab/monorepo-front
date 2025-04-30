import { Component, inject } from '@angular/core';
import { FlArrayObs } from '@monorepo/front-core-lib/fl-core';
import { FlTranslatableText, FlTranslateModule } from '@monorepo/front-core-lib/fl-translate';
import { CaScenario } from '../../../../../ca-core/model/entities/folder/ca-scenario.class';
import { MAT_DIALOG_DATA, MatDialogContent } from '@angular/material/dialog';
import { FlDialogModule } from '@monorepo/front-core-lib/fl-dialog';
import { CaScenarioTableComponent } from '../ca-scenario-table/ca-scenario-table.component';
import { AsyncPipe } from '@angular/common';

export interface CaScenariosListDialogInput {
  scenarios: FlArrayObs<CaScenario>;
  title: FlTranslatableText;
}

@Component({
  selector: 'ca-scenarios-table-dialog',
  templateUrl: './ca-scenario-table-dialog.component.html',
  styleUrl: './ca-scenario-table-dialog.component.scss',
  imports: [FlDialogModule, MatDialogContent, CaScenarioTableComponent, AsyncPipe, FlTranslateModule],
})
export class CaScenarioTableDialogComponent {
  scenarios: FlArrayObs<CaScenario>;
  title: FlTranslatableText;

  constructor() {
    const data = inject<CaScenariosListDialogInput>(MAT_DIALOG_DATA);

    this.scenarios = data.scenarios;
    this.title = data.title;
  }
}
