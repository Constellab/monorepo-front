import { AsyncPipe } from '@angular/common';
import { Component, inject, input, OnInit, output } from '@angular/core';
import { NgControl } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { FlFormFieldDirective, FlInputSearchFilter } from '@monorepo/front-core-lib/fl-core';
import { FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import { FlInputSearchAdvancedButton, FlInputSearchModule } from '@monorepo/front-core-lib/fl-input-search';
import { FlIconModule } from '@monorepo/front-core-lib/fl-svg-icon';
import { FlTranslatableText, FlTranslateModule } from '@monorepo/front-core-lib/fl-translate';
import { FlUserModule } from '@monorepo/front-core-lib/fl-user';
import { LiScenario, LiScenarioDatasource, LiScenarioService } from '@monorepo/lab-lib/li-core';
import { Observable } from 'rxjs';

import { LiScenarioInlineComponent } from '../li-scenario-inline/li-scenario-inline.component';
import { LiSelectScenarioDialogComponent } from '../li-select-scenario-dialog/li-select-scenario-dialog.component';

@Component({
  selector: 'li-select-scenario',
  templateUrl: './li-select-scenario.component.html',
  styleUrls: ['./li-select-scenario.component.scss'],
  providers: [{ provide: FlFormFieldDirective, useExisting: LiSelectScenarioComponent }],
  imports: [
    FlInputSearchModule,
    FlUserModule,
    MatIcon,
    FlIconModule,
    LiScenarioInlineComponent,
    AsyncPipe,
    FlTranslateModule,
  ],
})
export class LiSelectScenarioComponent extends FlFormFieldDirective<LiScenario> implements OnInit {
  private scenarioService = inject(LiScenarioService);
  private dialogService = inject(FlDialogService);

  placeholder = input<FlTranslatableText>('li.scenario_select');

  scenarioChange = output<LiScenario>();

  selectedScenario: LiScenario | Observable<LiScenario>;

  datasource: LiScenarioDatasource<FlInputSearchFilter>;

  advancedButton: FlInputSearchAdvancedButton<LiScenario>;

  constructor() {
    const ngControl = inject(NgControl, { optional: true, self: true });

    super(ngControl);
  }

  ngOnInit(): void {
    this.datasource = this.scenarioService.searchByTitleDatasource();

    this.advancedButton = {
      onClick: () => this.dialogService.openBigDialog(LiSelectScenarioDialogComponent).afterClosed(),
    };
  }

  writeValue(obj: LiScenario): void {
    if (obj == null) {
      this.selectedScenario = null;
      this.value = null;
      return;
    }

    // if the provided object is not an instance of LiScenario, load it from the api
    if (obj instanceof LiScenario) {
      this.selectedScenario = obj;
    } else if (typeof obj == 'string') {
      this.selectedScenario = this.scenarioService.getScenario(obj);
    } else if ((obj as any).id != null) {
      this.selectedScenario = this.scenarioService.getScenario((obj as any).id);
    }
    this.value = obj;
  }

  callChangeEvent(value: LiScenario): void {
    this.scenarioChange.emit(value);
    this.selectedScenario = value;
  }

  onDisableChange(): void {}
}
