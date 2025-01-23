import { Component, inject, input, OnInit, output } from '@angular/core';
import { FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import { FlFormFieldDirective } from '@monorepo/front-core-lib/fl-core';
import { FlInputSearchAdvancedButton, FlInputSearchModule } from '@monorepo/front-core-lib/fl-input-search';
import { FlInputSearchFilter } from '@monorepo/front-core-lib/fl-core';
import { FlTranslatableText, FlTranslateModule } from '@monorepo/front-core-lib/fl-translate';

import { LabScenario, LabScenarioDatasource } from '../../../../model/entities/lab-scenario.entity';
import { NgControl } from '@angular/forms';
import { LabScenarioService } from '../../../../entity-service/lab-scenario.service';
import { Observable } from 'rxjs';
import { LabSelectScenarioDialogComponent } from '../lab-select-scenario-dialog/lab-select-scenario-dialog.component';
import { FlUserModule } from '@monorepo/front-core-lib/fl-user';
import { MatIcon } from '@angular/material/icon';
import { FlIconModule } from '@monorepo/front-core-lib/fl-svg-icon';
import { LabScenarioInlineComponent } from '../lab-scenario-inline/lab-scenario-inline.component';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'lab-select-scenario',
  templateUrl: './lab-select-scenario.component.html',
  styleUrls: ['./lab-select-scenario.component.scss'],
  providers: [{ provide: FlFormFieldDirective, useExisting: LabSelectScenarioComponent }],
  imports: [
    FlInputSearchModule,
    FlUserModule,
    MatIcon,
    FlIconModule,
    LabScenarioInlineComponent,
    AsyncPipe,
    FlTranslateModule,
  ],
})
export class LabSelectScenarioComponent extends FlFormFieldDirective<LabScenario> implements OnInit {
  private scenarioService = inject(LabScenarioService);
  private dialogService = inject(FlDialogService);

  placeholder = input<FlTranslatableText>('biox.scenario_select');

  scenarioChange = output<LabScenario>();

  selectedScenario: LabScenario | Observable<LabScenario>;

  datasource: LabScenarioDatasource<FlInputSearchFilter>;

  advancedButton: FlInputSearchAdvancedButton<LabScenario>;

  constructor() {
    const ngControl = inject(NgControl, { optional: true, self: true });

    super(ngControl);
  }

  ngOnInit(): void {
    this.datasource = this.scenarioService.searchByTitleDatasource();

    this.advancedButton = {
      onClick: () => this.dialogService.openBigDialog(LabSelectScenarioDialogComponent).afterClosed(),
    };
  }

  writeValue(obj: LabScenario): void {
    if (obj == null || obj.id == null) {
      this.selectedScenario = null;
      this.value = null;
      return;
    }

    // if the provided object is not an instance of LabScenario, load it from the api
    if (!(obj instanceof LabScenario)) {
      this.selectedScenario = this.scenarioService.getScenario((obj as any).id);
    } else {
      this.selectedScenario = obj;
    }
    this.value = obj;
  }

  callChangeEvent(value: LabScenario): void {
    this.scenarioChange.emit(value);
    this.selectedScenario = value;
  }

  onDisableChange(): void {}
}
