import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import { FlFormFieldDirective, FlInputSearchFilter } from '@monorepo/front-core-lib/fl-core';
import { FlInputSearchAdvancedButton, FlInputSearchModule } from '@monorepo/front-core-lib/fl-input-search';
import { FlUserModule } from '@monorepo/front-core-lib/fl-user';
import {
  LiScenarioTemplate,
  LiScenarioTemplateDatasource,
  LiScenarioTemplateService,
} from '@monorepo/lab-lib/li-core';
import { LiScenarioTemplateInlineComponent } from '../li-scenario-template-inline/li-scenario-template-inline.component';
import {
  LiSelectScenarioTemplateDialogComponent,
  LiSelectScenarioTemplateDialogInput,
} from '../li-select-scenario-template-dialog/li-select-scenario-template-dialog.component';
import { NgControl } from '@angular/forms';
import { Observable } from 'rxjs';

/**
 * Input/Select component to search for a Protocol template and select one.
 * It uses the FlInputSearchComponent to search for users.
 */
@Component({
  selector: 'li-select-scenario-template',
  templateUrl: './li-select-scenario-template.component.html',
  styleUrls: ['./li-select-scenario-template.component.scss'],
  providers: [{ provide: FlFormFieldDirective, useExisting: LiSelectScenarioTemplateComponent }],
  imports: [FlInputSearchModule, FlUserModule, LiScenarioTemplateInlineComponent],
})
export class LiSelectScenarioTemplateComponent
  extends FlFormFieldDirective<LiScenarioTemplate>
  implements OnInit
{
  private scenarioTemplateService = inject(LiScenarioTemplateService);
  private dialogService = inject(FlDialogService);

  @Input() placeholder: string;

  @Output() valueChange: EventEmitter<LiScenarioTemplate> = new EventEmitter();

  selectedTemplate: LiScenarioTemplate;

  datasource: LiScenarioTemplateDatasource<FlInputSearchFilter>;

  advancedButton: FlInputSearchAdvancedButton<LiScenarioTemplate>;

  constructor() {
    const ngControl = inject(NgControl, { optional: true, self: true });

    super(ngControl);
  }

  ngOnInit(): void {
    this.datasource = this.scenarioTemplateService.searchByNameDatasource();

    this.advancedButton = {
      onClick: () => this.openScenarioTemplateDialog(),
    };
  }

  private openScenarioTemplateDialog(): Observable<any> {
    const data: LiSelectScenarioTemplateDialogInput = {
      rowSelectable: true,
    };
    return this.dialogService.openBigDialog(LiSelectScenarioTemplateDialogComponent, { data }).afterClosed();
  }

  callChangeEvent(value: LiScenarioTemplate): void {
    this.valueChange.emit(value);
    this.selectedTemplate = value;
  }

  onDisableChange(): void {}

  writeValue(obj: LiScenarioTemplate): void {
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
