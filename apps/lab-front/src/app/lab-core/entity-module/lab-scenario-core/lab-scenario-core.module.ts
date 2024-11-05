import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LabScenarioTableComponent } from './component/lab-scenario-table/lab-scenario-table.component';
import { LabCoreModule } from '../../lab-core.module';
import { RouterModule } from '@angular/router';
import { LabScenarioFormDialogComponent } from './component/lab-scenario-form-dialog/lab-scenario-form-dialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LabScenarioSearchComponent } from './component/lab-scenario-search/lab-scenario-search.component';
import { LabScenarioSearchFormComponent } from './component/lab-scenario-search-form/lab-scenario-search-form.component';
import { LabScenarioStatusOptionsComponent } from './component/lab-scenario-status-options/lab-scenario-status-options.component';
import { LabScenarioCreationTypeOptionsComponent } from './component/lab-scenario-creation-type-options/lab-scenario-creation-type-options.component';
import { LabSelectScenarioDialogComponent } from './component/lab-select-scenario-dialog/lab-select-scenario-dialog.component';
import { LabSelectScenarioComponent } from './component/lab-select-scenario/lab-select-scenario.component';
import { LabTagCoreModule } from '../lab-tag-core/lab-tag-core.module';
import { LabEntityCoreModule } from '../lab-entity-core/lab-entity-core.module';
import { LabFolderCoreModule } from '../lab-folder-core/lab-folder-core.module';
import { LabRunningScenarioTableComponent } from './component/lab-running-scenario-table/lab-running-scenario-table.component';
import { LabProcessCoreModule } from '../lab-process-core/lab-process-core.module';
import { LabScenarioTemplateCoreModule } from '../lab-scenario-template-core/lab-scenario-template-core.module';
import { LabScenarioInlineComponent } from './component/lab-scenario-inline/lab-scenario-inline.component';
import { LabTypeCoreModule } from '../lab-type-core/lab-type-core.module';
import { LabImportScenarioFromLinkComponent } from './component/lab-import-scenario-from-link/lab-import-scenario-from-link.component';
import { LabScenarioIconsComponent } from './component/lab-scenario-icons/lab-scenario-icons.component';

@NgModule({
  declarations: [
    LabScenarioTableComponent,
    LabScenarioFormDialogComponent,
    LabScenarioSearchComponent,
    LabScenarioSearchFormComponent,
    LabScenarioStatusOptionsComponent,
    LabScenarioCreationTypeOptionsComponent,
    LabSelectScenarioDialogComponent,
    LabSelectScenarioComponent,
    LabRunningScenarioTableComponent,
    LabScenarioInlineComponent,
    LabImportScenarioFromLinkComponent,
    LabScenarioIconsComponent,
  ],
  exports: [
    LabScenarioTableComponent,
    LabScenarioFormDialogComponent,
    LabScenarioSearchComponent,
    LabScenarioSearchFormComponent,
    LabScenarioStatusOptionsComponent,
    LabScenarioCreationTypeOptionsComponent,
    LabSelectScenarioDialogComponent,
    LabSelectScenarioComponent,
    LabRunningScenarioTableComponent,
    LabImportScenarioFromLinkComponent,
    LabScenarioIconsComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,

    LabCoreModule,
    LabEntityCoreModule,
    LabTagCoreModule,
    LabFolderCoreModule,
    LabProcessCoreModule,
    LabScenarioTemplateCoreModule,
    LabTypeCoreModule,
  ],
})
export class LabScenarioCoreModule {}
