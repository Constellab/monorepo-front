import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  LabScenarioTemplateSearchComponent
} from './component/lab-scenario-template-search/lab-scenario-template-search.component';
import {
  LabScenarioTemplateSearchFormComponent
} from './component/lab-scenario-template-search-form/lab-scenario-template-search-form.component';
import {
  LabScenarioTemplateFormDialogComponent
} from './component/lab-scenario-template-form-dialog/lab-scenario-template-form-dialog.component';
import {
  LabSelectScenarioTemplateComponent
} from './component/lab-select-scenario-template/lab-select-scenario-template.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LabCoreModule } from '../../lab-core.module';
import {
  LabScenarioTemplateInlineComponent
} from './component/lab-scenario-template-inline/lab-scenario-template-inline.component';
import { LabTagCoreModule } from '../lab-tag-core/lab-tag-core.module';
import {
  LabScenarioTemplateTableComponent
} from './component/lab-scenario-template-table/lab-scenario-template-table.component';
import {
  LabSelectScenarioTemplateDialogComponent
} from './component/lab-select-scenario-template-dialog/lab-select-scenario-template-dialog.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    LabScenarioTemplateSearchComponent,
    LabScenarioTemplateSearchFormComponent,
    LabScenarioTemplateFormDialogComponent,
    LabSelectScenarioTemplateComponent,
    LabScenarioTemplateInlineComponent,
    LabScenarioTemplateTableComponent,
    LabSelectScenarioTemplateDialogComponent,
  ],
  exports: [
    LabScenarioTemplateSearchComponent,
    LabScenarioTemplateSearchFormComponent,
    LabScenarioTemplateFormDialogComponent,
    LabSelectScenarioTemplateComponent,
    LabScenarioTemplateInlineComponent,
    LabScenarioTemplateTableComponent,
    LabSelectScenarioTemplateDialogComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,

    LabCoreModule,
    LabTagCoreModule,
  ],
})
export class LabScenarioTemplateCoreModule {
}
