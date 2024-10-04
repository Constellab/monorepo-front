import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  CaExperimentDetailPageComponent
} from './component/ca-experiment-detail-page/ca-experiment-detail-page.component';
import { CaCoreModule } from '../../../ca-core/ca-core.module';
import { CaExperimentCoreModule } from '../ca-experiment-core/ca-experiment-core.module';
import { CaNoteCoreModule } from '../ca-note-core/ca-note-core.module';
import { RouterModule } from '@angular/router';
import { CaLabCoreModule } from '../../../ca-core/entity-module/ca-lab-core/ca-lab-core.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CaFolderHierarchyCoreModule } from '../ca-folder-hierarchy-core/ca-folder-hierarchy-core.module';


@NgModule({
  declarations: [
    CaExperimentDetailPageComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,

    CaCoreModule,
    CaFolderHierarchyCoreModule,
    CaExperimentCoreModule,
    CaLabCoreModule,
    CaNoteCoreModule,
  ]
})
export class CaExperimentDetailPageModule {
}
