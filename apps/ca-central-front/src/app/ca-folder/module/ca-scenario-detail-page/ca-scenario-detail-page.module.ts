import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CaScenarioDetailPageComponent } from './ca-scenario-detail-page/ca-scenario-detail-page.component';
import { CaCoreModule } from '../../../ca-core/ca-core.module';
import { CaScenarioCoreModule } from '../ca-scenario-core/ca-scenario-core.module';
import { CaNoteCoreModule } from '../ca-note-core/ca-note-core.module';
import { RouterModule } from '@angular/router';
import { CaLabCoreModule } from '../../../ca-core/entity-module/ca-lab-core/ca-lab-core.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CaFolderHierarchyCoreModule } from '../ca-folder-hierarchy-core/ca-folder-hierarchy-core.module';

@NgModule({
  declarations: [CaScenarioDetailPageComponent],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,

    CaCoreModule,
    CaFolderHierarchyCoreModule,
    CaScenarioCoreModule,
    CaLabCoreModule,
    CaNoteCoreModule,
  ],
})
export class CaScenarioDetailPageModule {}
