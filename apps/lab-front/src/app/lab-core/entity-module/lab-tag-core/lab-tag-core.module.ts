import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LabCoreModule} from '../../lab-core.module';
import {LabTagDashboardComponent} from './component/lab-tag-dashboard/lab-tag-dashboard.component';
import {LabTagEntityDetailComponent} from './component/lab-tag-entity-detail/lab-tag-entity-detail.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {LabTagFormDialogComponent} from './component/lab-tag-form-dialog/lab-tag-form-dialog.component';
import {LabTagHelpDialogComponent} from './component/lab-tag-help-dialog/lab-tag-help-dialog.component';
import {LabGetEntityTagsPipe} from './pipe/lab-get-entity-tags.pipe';
import {
  LabManageEntityTagsDialogComponent
} from './component/lab-manage-entity-tags-dialog/lab-manage-entity-tags-dialog.component';
import {
  LabTagCheckPropagationComponent
} from './component/lab-tag-check-propagation/lab-tag-check-propagation.component';
import {LabNavigableEntityCoreModule} from '../lab-navigable-entity-core/lab-navigable-entity-core.module';
import {LabTagListComponent} from './component/lab-tag-list/lab-tag-list.component';

@NgModule({
  declarations: [
    LabTagDashboardComponent,
    LabTagEntityDetailComponent,
    LabTagFormDialogComponent,
    LabTagHelpDialogComponent,
    LabGetEntityTagsPipe,
    LabManageEntityTagsDialogComponent,
    LabTagCheckPropagationComponent,
    LabTagListComponent,
  ],
  exports: [
    LabTagDashboardComponent,
    LabTagEntityDetailComponent,
    LabTagHelpDialogComponent,
    LabGetEntityTagsPipe,
    LabManageEntityTagsDialogComponent,
    LabTagListComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    LabCoreModule,
    LabNavigableEntityCoreModule,
  ],
})
export class LabTagCoreModule {}
