import { Component, EventEmitter, OnInit, Optional, Output, Self } from '@angular/core';
import {
  FlDialogService,
  FlFormFieldDirective,
  FlInputSearchAdvancedButton,
  FlInputSearchFilter
} from '@monorepo/front-core-lib';
import { LabScenario, LabScenarioDatasource } from '../../../../model/entities/lab-scenario.entity';
import { NgControl } from '@angular/forms';
import { LabScenarioService } from '../../../../entity-service/lab-scenario.service';
import { Observable } from 'rxjs';
import { LabSelectScenarioDialogComponent } from '../lab-select-scenario-dialog/lab-select-scenario-dialog.component';

@Component({
  selector: 'lab-select-scenario',
  templateUrl: './lab-select-scenario.component.html',
  styleUrls: ['./lab-select-scenario.component.scss'],
  providers: [{provide: FlFormFieldDirective, useExisting: LabSelectScenarioComponent}]
})
export class LabSelectScenarioComponent extends FlFormFieldDirective<LabScenario>
  implements OnInit {

  @Output() scenarioChange: EventEmitter<LabScenario> = new EventEmitter();

  selectedScenario: LabScenario | Observable<LabScenario>;

  datasource: LabScenarioDatasource<FlInputSearchFilter>;

  advancedButton: FlInputSearchAdvancedButton<LabScenario>;


  constructor(@Optional() @Self() ngControl: NgControl,
              private scenarioService: LabScenarioService,
              private dialogService: FlDialogService) {
    super(ngControl);
  }

  ngOnInit(): void {
    this.datasource = this.scenarioService.searchByTitleDatasource();

    this.advancedButton = {
      onClick: () => this.dialogService.openBigDialog(LabSelectScenarioDialogComponent).afterClosed()
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
    this.scenarioChange.next(value);
    this.selectedScenario = value;
  }

  onDisableChange(): void {
  }


}
