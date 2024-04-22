import {NgModule} from '@angular/core';
import {HaPublicBrickPageComponent} from './ha-public-brick-page/ha-public-brick-page.component';
import {HaCoreModule} from '../../../ha-core/ha-core.module';
import {HaPublicSidenavComponent} from './ha-public-sidenav/ha-public-sidenav.component';
import {CommonModule} from '@angular/common';
import {
  HaPublicSidenavCreateFormDialogComponent
} from './ha-public-sidenav-create-form-dialog/ha-public-sidenav-create-form-dialog.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HaPublicAddVersionDialogComponent} from './ha-public-add-version-dialog/ha-public-add-version-dialog.component';
import {HaPublicVersionsComponent} from './ha-public-versions/ha-public-versions.component';
import {
  HaPublicBrickVersionsTableComponent
} from './ha-public-brick-versions-table/ha-public-brick-versions-table.component';
import {MatTableModule} from '@angular/material/table';
import {FlDateModule, FlInputFileModule, FlKeyValueModule,} from '@monorepo/front-core-lib';
import {HaPublicBrickDescriptionComponent} from './ha-public-brick-description/ha-public-brick-description.component';
import {MatCardModule} from '@angular/material/card';
import {MatRadioModule} from '@angular/material/radio';
import {HaPublicDocComponent} from './ha-public-doc/ha-public-doc.component';
import {HaPublicEditBrickDialogComponent} from './ha-public-edit-brick-dialog/ha-public-edit-brick-dialog.component';
import {MatTooltipModule} from '@angular/material/tooltip';
import {
  HaPublicBrickVersionDetailDialogComponent
} from './ha-public-brick-version-detail-dialog/ha-public-brick-version-detail-dialog.component';
import {HaPublicTechDocComponent} from './ha-public-tech-doc/ha-public-tech-doc.component';
import {Ha404Component} from '../ha404/ha404.component';
import {HaPublicFindDocComponent} from './ha-public-find-doc/ha-public-find-doc.component';
import {HaPublicBrickRightPanelComponent} from './ha-public-brick-right-panel/ha-public-brick-right-panel.component';
import {HaPublicBrickUsersComponent} from './ha-public-brick-users/ha-public-brick-users.component';
import {
  HaPublicInviteBrickUserDialogComponent
} from './ha-public-invite-brick-user-dialog/ha-public-invite-brick-user-dialog.component';
import {
  HaPublicBrickUserInvitePageComponent
} from './ha-public-brick-user-invite-page/ha-public-brick-user-invite-page.component';
import {
  HaDocResourceViewInputDialogComponent
} from './ha-doc-view/ha-doc-resource-view-input-dialog/ha-doc-resource-view-input-dialog.component';
import {HaDocContentViewComponent} from './ha-doc-view/ha-doc-content-view/ha-doc-content-view.component';
import {
  HaUtilComponentCoreModule
} from "../../../ha-core/entity-module/ha-util-component-core/ha-util-component-core.module";

@NgModule({
    declarations: [
        HaPublicBrickPageComponent,
        HaPublicSidenavComponent,
        HaPublicSidenavCreateFormDialogComponent,
        HaPublicAddVersionDialogComponent,
        HaPublicVersionsComponent,
        HaPublicBrickVersionsTableComponent,
        HaPublicBrickDescriptionComponent,
        HaPublicDocComponent,
        HaPublicEditBrickDialogComponent,
        HaPublicBrickVersionDetailDialogComponent,
        HaPublicTechDocComponent,
        Ha404Component,
        HaPublicFindDocComponent,
        HaPublicBrickRightPanelComponent,
        HaPublicBrickUsersComponent,
        HaPublicInviteBrickUserDialogComponent,
        HaPublicBrickUserInvitePageComponent,
        HaDocResourceViewInputDialogComponent,
        HaDocContentViewComponent,
    ],
    imports: [
        HaCoreModule,
        CommonModule,
        ReactiveFormsModule,
        MatTableModule,
        FlDateModule,
        MatCardModule,
        FlKeyValueModule,
        MatRadioModule,
        FormsModule,
        MatTooltipModule,
        FlInputFileModule,
        HaUtilComponentCoreModule,
    ],
    exports: [
        Ha404Component
    ]
})
export class HaPublicBrickPageModule {}
