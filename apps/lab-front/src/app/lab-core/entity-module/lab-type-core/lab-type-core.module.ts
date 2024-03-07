import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LabTypeSearchFormComponent} from './component/lab-type-search-form/lab-type-search-form.component';
import {LabTypeSearchComponent} from './component/lab-type-search/lab-type-search.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {LabCoreModule} from '../../lab-core.module';
import {LabBrickCoreModule} from '../lab-brick-core/lab-brick-core.module';
import {LabSelectTypeDialogComponent} from './component/lab-select-type-dialog/lab-select-type-dialog.component';
import {LabTypeDetailComponent} from './component/lab-type-detail/lab-type-detail.component';
import {
  LabTypeShowDetailButtonComponent
} from './component/lab-type-show-detail-button/lab-type-show-detail-button.component';
import {LabTypeDialogComponent} from './component/lab-type-dialog/lab-type-dialog.component';
import {LabProcessTypeTableComponent} from './component/lab-process-type-table/lab-process-type-table.component';
import {RouterModule} from '@angular/router';
import {LabSelectTypeComponent} from './component/lab-select-type/lab-select-type.component';
import {
  LabSelectCommunityLiveTaskDialogComponent
} from './component/lab-select-community-live-task-dialog/lab-select-community-live-task-dialog.component';
import {MatChipsModule} from '@angular/material/chips';
import {
  LabCreateCommunityLiveTaskDialogComponent
} from './component/lab-create-community-live-task-dialog/lab-create-community-live-task-dialog.component';
import {
  LabShareLiveTaskCommunityDialogComponent
} from './component/lab-share-live-task-community-dialog/lab-share-live-task-community-dialog.component';
import {
  LabSelectCommunityLiveTaskComponent
} from './component/lab-select-community-live-task/lab-select-community-live-task.component';

@NgModule({
  declarations: [
    LabTypeSearchFormComponent,
    LabTypeSearchComponent,
    LabSelectTypeDialogComponent,
    LabTypeDetailComponent,
    LabTypeDialogComponent,
    LabTypeShowDetailButtonComponent,
    LabProcessTypeTableComponent,
    LabSelectTypeComponent,
    LabSelectCommunityLiveTaskDialogComponent,
    LabCreateCommunityLiveTaskDialogComponent,
    LabShareLiveTaskCommunityDialogComponent,
    LabSelectCommunityLiveTaskComponent
  ],
  exports: [
    LabTypeSearchFormComponent,
    LabTypeSearchComponent,
    LabSelectTypeDialogComponent,
    LabTypeDetailComponent,
    LabTypeDialogComponent,
    LabTypeShowDetailButtonComponent,
    LabProcessTypeTableComponent,
    LabSelectTypeComponent,
    LabSelectCommunityLiveTaskDialogComponent,
    LabCreateCommunityLiveTaskDialogComponent,
    LabShareLiveTaskCommunityDialogComponent,
    LabSelectCommunityLiveTaskComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,

    LabCoreModule,
    LabBrickCoreModule,
    MatChipsModule,
  ],
})
export class LabTypeCoreModule {
}
