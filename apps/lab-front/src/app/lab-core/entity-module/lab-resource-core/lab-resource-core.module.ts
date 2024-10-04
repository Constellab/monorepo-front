import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LabCoreModule } from '../../lab-core.module';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  LabResourceViewPortalComponent
} from './component/lab-resource-view-portal/lab-resource-view-portal.component';
import { LabResourceTableComponent } from './component/lab-resource-table/lab-resource-table.component';
import { LabResourceSearchComponent } from './component/lab-resource-search/lab-resource-search.component';
import {
  LabResourceSearchFormComponent
} from './component/lab-resource-search-form/lab-resource-search-form.component';
import {
  LabResourceOriginOptionsComponent
} from './component/lab-resource-origin-options/lab-resource-origin-options.component';
import {
  LabSelectResourceDialogComponent
} from './component/lab-select-resource-dialog/lab-select-resource-dialog.component';
import { LabResourceCardComponent } from './component/lab-resource-card/lab-resource-card.component';
import {
  LabFsNodeTypesSelectionDialogComponent
} from './component/lab-fs-node-types-selection-dialog/lab-fs-node-types-selection-dialog.component';
import { LabTransformerCoreModule } from '../lab-transformer-core/lab-transformer-core.module';
import {
  LabImportResourceDialogComponent
} from './component/lab-import-resource-dialog/lab-import-resource-dialog.component';
import { LabConfigCoreModule } from '../lab-config-core/lab-config-core.module';
import {
  LabResourceDetailDialogComponent
} from './component/lab-resource-detail-dialog/lab-resource-detail-dialog.component';
import {
  LabUpdateResourceTypeComponent
} from './component/lab-update-resource-type/lab-update-resource-type.component';
import {
  LabUpdateResourceNameDialogComponent
} from './component/lab-update-resource-name-dialog/lab-update-resource-name-dialog.component';
import {
  LabResourceActionsMenuComponent
} from './component/lab-resource-actions-menu/lab-resource-actions-menu.component';
import { LabScenarioCoreModule } from '../lab-scenario-core/lab-scenario-core.module';
import { LabTagCoreModule } from '../lab-tag-core/lab-tag-core.module';
import { LabTypeCoreModule } from '../lab-type-core/lab-type-core.module';
import {
  LabConfigureResourceViewComponent
} from './component/lab-configure-resource-view/lab-configure-resource-view.component';
import { LabEntityCoreModule } from '../lab-entity-core/lab-entity-core.module';
import { LabFolderCoreModule } from '../lab-folder-core/lab-folder-core.module';
import {
  LabResourceViewSpecListComponent
} from './component/lab-resource-view-spec-list/lab-resource-view-spec-list.component';
import { LabViewConfigCoreModule } from '../lab-view-config-core/lab-view-config-core.module';
import {
  LabResourceViewDetailComponent
} from './component/lab-resource-view-detail/lab-resource-view-detail.component';
import {
  LabResourceViewSpreadsheetComponent
} from './component/lab-resource-view-spreadsheet/lab-resource-view-spreadsheet.component';
import { LabResourceViewTextComponent } from './component/lab-resource-view-text/lab-resource-view-text.component';
import { LabResourceViewListComponent } from './component/lab-resource-view-list/lab-resource-view-list.component';
import {
  LabResourceViewFolderComponent
} from './component/lab-resource-view-folder/lab-resource-view-folder.component';
import {
  LabResourceViewHistoricComponent
} from './component/lab-resource-view-historic/lab-resource-view-historic.component';
import {
  LabScenariosUsingResourceComponent
} from './component/lab-scenarios-using-resource/lab-scenarios-using-resource.component';
import {
  LabNotesUsingResourceComponent
} from './component/lab-notes-using-resource/lab-notes-using-resource.component';
import { LabNoteCoreModule } from '../lab-note-core/lab-note-core.module';
import { LabResourceInfoComponent } from './component/lab-resource-info/lab-resource-info.component';
import {
  LabResourceViewDetailDialogComponent
} from './component/lab-resource-view-detail-dialog/lab-resource-view-detail-dialog.component';
import { LabShareCoreModule } from '../lab-share-core/lab-share-core.module';
import {
  LabImportResourceFromLinkComponent
} from './component/lab-import-resource-from-link/lab-import-resource-from-link.component';
import {
  LabResourceUpdateFolderDialogComponent
} from './component/lab-resource-update-folder-dialog/lab-resource-update-folder-dialog.component';
import { LabResourceDetailComponent } from './component/lab-resource-detail/lab-resource-detail.component';
import {
  LabResourceDetailHeaderComponent
} from './component/lab-resource-detail-header/lab-resource-detail-header.component';
import {
  LabResourceInfoDialogComponent
} from './component/lab-resource-info-dialog/lab-resource-info-dialog.component';
import {
  LabResourceAvailableViewsPortalComponent
} from './component/lab-resource-available-views-portal/lab-resource-available-views-portal.component';
import {
  LabResourceChildrenTabsComponent
} from './component/lab-resource-children-tabs/lab-resource-children-tabs.component';
import {
  LabResourceDetailMinimizedViewsComponent
} from './component/lab-resource-detail-minimized-views/lab-resource-detail-minimized-views.component';
import {
  LabResourceViewSpecCardComponent
} from './component/lab-resource-view-spec-card/lab-resource-view-spec-card.component';
import {
  LabResourceRichTextViewComponent
} from './component/lab-resource-rich-text-view/lab-resource-rich-text-view.component';

@NgModule({
  declarations: [
    LabResourceViewSpreadsheetComponent,
    LabResourceViewTextComponent,
    LabResourceViewPortalComponent,
    LabResourceTableComponent,
    LabResourceSearchComponent,
    LabResourceSearchFormComponent,
    LabResourceOriginOptionsComponent,
    LabSelectResourceDialogComponent,
    LabResourceCardComponent,
    LabFsNodeTypesSelectionDialogComponent,
    LabImportResourceDialogComponent,
    LabResourceDetailDialogComponent,
    LabUpdateResourceTypeComponent,
    LabUpdateResourceNameDialogComponent,
    LabResourceActionsMenuComponent,
    LabResourceViewFolderComponent,
    LabResourceViewListComponent,
    LabConfigureResourceViewComponent,
    LabResourceViewSpecListComponent,
    LabResourceViewDetailComponent,
    LabResourceViewHistoricComponent,
    LabScenariosUsingResourceComponent,
    LabNotesUsingResourceComponent,
    LabResourceInfoComponent,
    LabResourceViewDetailDialogComponent,
    LabImportResourceFromLinkComponent,
    LabResourceUpdateFolderDialogComponent,
    LabResourceDetailComponent,
    LabResourceDetailHeaderComponent,
    LabResourceInfoDialogComponent,
    LabResourceAvailableViewsPortalComponent,
    LabResourceChildrenTabsComponent,
    LabResourceDetailMinimizedViewsComponent,
    LabResourceViewSpecCardComponent,
    LabResourceViewSpecCardComponent,
    LabResourceRichTextViewComponent,
  ],
  exports: [
    LabResourceViewPortalComponent,
    LabResourceTableComponent,
    LabResourceSearchComponent,
    LabResourceOriginOptionsComponent,
    LabSelectResourceDialogComponent,
    LabResourceCardComponent,
    LabImportResourceDialogComponent,
    LabResourceDetailDialogComponent,
    LabUpdateResourceTypeComponent,
    LabUpdateResourceNameDialogComponent,
    LabResourceActionsMenuComponent,
    LabConfigureResourceViewComponent,
    LabResourceViewDetailComponent,
    LabResourceViewDetailDialogComponent,
    LabResourceViewSpecListComponent,
    LabImportResourceFromLinkComponent,
    LabResourceUpdateFolderDialogComponent,
    LabResourceDetailComponent,
    LabResourceRichTextViewComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,

    LabCoreModule,
    LabTransformerCoreModule,
    LabConfigCoreModule,
    LabTypeCoreModule,
    LabScenarioCoreModule,
    LabTagCoreModule,
    LabEntityCoreModule,
    LabFolderCoreModule,
    LabViewConfigCoreModule,
    LabNoteCoreModule,
    LabShareCoreModule,
  ],
})
export class LabResourceCoreModule {
}
