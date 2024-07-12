import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LabExperimentTableComponent } from './component/lab-experiment-table/lab-experiment-table.component';
import { LabCoreModule } from '../../lab-core.module';
import { RouterModule } from '@angular/router';
import {
  LabExperimentFormDialogComponent
} from './component/lab-experiment-form-dialog/lab-experiment-form-dialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LabExperimentSearchComponent } from './component/lab-experiment-search/lab-experiment-search.component';
import {
  LabExperimentSearchFormComponent
} from './component/lab-experiment-search-form/lab-experiment-search-form.component';
import {
  LabExperimentStatusOptionsComponent
} from './component/lab-experiment-status-options/lab-experiment-status-options.component';
import {
  LabExperimentCreationTypeOptionsComponent
} from './component/lab-experiment-creation-type-options/lab-experiment-creation-type-options.component';
import {
  LabSelectExperimentDialogComponent
} from './component/lab-select-experiment-dialog/lab-select-experiment-dialog.component';
import { LabSelectExperimentComponent } from './component/lab-select-experiment/lab-select-experiment.component';
import { LabTagCoreModule } from '../lab-tag-core/lab-tag-core.module';
import { LabEntityCoreModule } from '../lab-entity-core/lab-entity-core.module';
import { LabProjectCoreModule } from '../lab-project-core/lab-project-core.module';
import {
  LabRunningExperimentTableComponent
} from './component/lab-running-experiment-table/lab-running-experiment-table.component';
import { LabProcessCoreModule } from '../lab-process-core/lab-process-core.module';
import { LabProtocolTemplateCoreModule } from '../lab-protocol-template-core/lab-protocol-template-core.module';
import { LabExperimentInlineComponent } from './component/lab-experiment-inline/lab-experiment-inline.component';
import { LabTypeCoreModule } from '../lab-type-core/lab-type-core.module';
import {
  LabImportExperimentFromLinkComponent
} from './component/lab-import-experiment-from-link/lab-import-experiment-from-link.component';
import { LabExperimentIconsComponent } from './component/lab-experiment-icons/lab-experiment-icons.component';


@NgModule({
  declarations: [
    LabExperimentTableComponent,
    LabExperimentFormDialogComponent,
    LabExperimentSearchComponent,
    LabExperimentSearchFormComponent,
    LabExperimentStatusOptionsComponent,
    LabExperimentCreationTypeOptionsComponent,
    LabSelectExperimentDialogComponent,
    LabSelectExperimentComponent,
    LabRunningExperimentTableComponent,
    LabExperimentInlineComponent,
    LabImportExperimentFromLinkComponent,
    LabExperimentIconsComponent
  ],
  exports: [
    LabExperimentTableComponent,
    LabExperimentFormDialogComponent,
    LabExperimentSearchComponent,
    LabExperimentSearchFormComponent,
    LabExperimentStatusOptionsComponent,
    LabExperimentCreationTypeOptionsComponent,
    LabSelectExperimentDialogComponent,
    LabSelectExperimentComponent,
    LabRunningExperimentTableComponent,
    LabImportExperimentFromLinkComponent,
    LabExperimentIconsComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,

    LabCoreModule,
    LabEntityCoreModule,
    LabTagCoreModule,
    LabProjectCoreModule,
    LabProcessCoreModule,
    LabProtocolTemplateCoreModule,
    LabTypeCoreModule
  ]
})
export class LabExperimentCoreModule {
}
