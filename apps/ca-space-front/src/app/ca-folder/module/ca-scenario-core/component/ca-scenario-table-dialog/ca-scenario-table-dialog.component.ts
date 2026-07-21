import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy,Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogContent } from '@angular/material/dialog';
import { FlArrayObs } from '@monorepo/front-core-lib/fl-core';
import { FlDialogModule } from '@monorepo/front-core-lib/fl-dialog';
import { FlTranslatableText, FlTranslateModule } from '@monorepo/front-core-lib/fl-translate';

import { CaScenario } from '../../../../../ca-core/model/entities/folder/ca-scenario.class';
import { CaScenarioTableComponent } from '../ca-scenario-table/ca-scenario-table.component';

export interface CaScenariosListDialogInput {
  scenarios: FlArrayObs<CaScenario>;
  title: FlTranslatableText;
}

@Component({
  selector: 'ca-scenarios-table-dialog',
  templateUrl: './ca-scenario-table-dialog.component.html',
  styleUrl: './ca-scenario-table-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [FlDialogModule, MatDialogContent, CaScenarioTableComponent, AsyncPipe, FlTranslateModule],
})
export class CaScenarioTableDialogComponent {
  data = inject<CaScenariosListDialogInput>(MAT_DIALOG_DATA);
}
