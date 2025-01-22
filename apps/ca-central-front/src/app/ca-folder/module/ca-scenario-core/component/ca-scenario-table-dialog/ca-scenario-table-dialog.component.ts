import { Component, inject } from '@angular/core';
import { FlArrayObs, FlTranslatableText } from '@monorepo/front-core-lib';
import { CaScenario } from '../../../../../ca-core/model/entities/folder/ca-scenario.class';
import { MAT_DIALOG_DATA, MatDialogContent } from '@angular/material/dialog';
import { FlDialogModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-dialog/fl-dialog.module';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { CaScenarioTableComponent } from '../ca-scenario-table/ca-scenario-table.component';
import { AsyncPipe } from '@angular/common';
import { FlTranslateModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-translate/fl-translate.module';

export interface CaScenariosListDialogInput {
  scenarios: FlArrayObs<CaScenario>;
  title: FlTranslatableText;
}

@Component({
  selector: 'ca-scenarios-table-dialog',
  templateUrl: './ca-scenario-table-dialog.component.html',
  styleUrl: './ca-scenario-table-dialog.component.scss',
  imports: [
    FlDialogModule,
    CdkScrollable,
    MatDialogContent,
    CaScenarioTableComponent,
    AsyncPipe,
    FlTranslateModule,
  ],
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
