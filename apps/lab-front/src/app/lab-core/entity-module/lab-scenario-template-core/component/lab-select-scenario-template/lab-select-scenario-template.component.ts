import { Component, EventEmitter, Input, OnInit, Optional, Output, Self } from '@angular/core';
import {
  FlDialogService,
  FlFormFieldDirective,
  FlInputSearchAdvancedButton,
  FlInputSearchFilter,
} from '@monorepo/front-core-lib';
import {
  LabScenarioTemplate,
  LabScenarioTemplateDatasource,
} from '../../../../model/entities/process/lab-scenario-template.entity';
import { NgControl } from '@angular/forms';
import { LabScenarioTemplateService } from '../../../../entity-service/lab-scenario-template.service';
import {
  LabSelectScenarioTemplateDialogComponent,
  LabSelectScenarioTemplateDialogInput,
} from '../lab-select-scenario-template-dialog/lab-select-scenario-template-dialog.component';
import { Observable } from 'rxjs';

/**
 * Input/Select component to search for a Protocol template and select one.
 * It uses the FlInputSearchComponent to search for users.
 */
@Component({
    selector: 'lab-select-scenario-template',
    templateUrl: './lab-select-scenario-template.component.html',
    styleUrls: ['./lab-select-scenario-template.component.scss'],
    providers: [{ provide: FlFormFieldDirective, useExisting: LabSelectScenarioTemplateComponent }],
    standalone: false
})
export class LabSelectScenarioTemplateComponent
  extends FlFormFieldDirective<LabScenarioTemplate>
  implements OnInit
{
  @Input() placeholder: string;

  @Output() valueChange: EventEmitter<LabScenarioTemplate> = new EventEmitter();

  selectedTemplate: LabScenarioTemplate;

  datasource: LabScenarioTemplateDatasource<FlInputSearchFilter>;

  advancedButton: FlInputSearchAdvancedButton<LabScenarioTemplate>;

  constructor(
    private scenarioTemplateService: LabScenarioTemplateService,
    private dialogService: FlDialogService,
    @Optional() @Self() ngControl: NgControl
  ) {
    super(ngControl);
  }

  ngOnInit(): void {
    this.datasource = this.scenarioTemplateService.searchByNameDatasource();

    this.advancedButton = {
      onClick: () => this.openScenarioTemplateDialog(),
    };
  }

  private openScenarioTemplateDialog(): Observable<any> {
    const data: LabSelectScenarioTemplateDialogInput = {
      rowSelectable: true,
    };
    return this.dialogService.openBigDialog(LabSelectScenarioTemplateDialogComponent, { data }).afterClosed();
  }

  callChangeEvent(value: LabScenarioTemplate): void {
    this.valueChange.emit(value);
    this.selectedTemplate = value;
  }

  onDisableChange(): void {}

  writeValue(obj: LabScenarioTemplate): void {
    if (obj == null || obj.id == null) {
      this.selectedTemplate = null;
      this.value = null;
      return;
    }
    // if the user is complete
    this.selectedTemplate = obj;

    this.value = obj;
  }
}
