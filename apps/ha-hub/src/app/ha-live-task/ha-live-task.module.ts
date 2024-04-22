import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HaCoreModule} from '../ha-core/ha-core.module';
import {HaLiveTaskRoutingModule} from './ha-live-task-routing.module';
import {HaLiveTaskListComponent} from './components/ha-live-task-list/ha-live-task-list.component';
import {
  HaLiveTaskCreateDialogComponent
} from './components/ha-live-task-create-dialog/ha-live-task-create-dialog.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {
  HaLiveTaskVersionDetailComponent
} from './components/ha-live-task-version-detail/ha-live-task-version-detail.component';
import {HaLiveTaskPageComponent} from './components/ha-live-task-page/ha-live-task-page.component';
import {FlCodeEditorModule, FlInputFileModule, FlInputSearchModule} from '@monorepo/front-core-lib';
import {
  HaLiveTaskVersionPageComponent
} from './components/ha-live-task-version-page/ha-live-task-version-page.component';
import {HaLiveTaskOverviewComponent} from './components/ha-live-task-overview/ha-live-task-overview.component';
import {HaLiveTaskCommentsComponent} from './components/ha-live-task-comments/ha-live-task-comments.component';
import {HaCardComponent} from '../ha-core/ha-component/ha-card/ha-card.component';
import {HaSpaceModule} from '../ha-space/ha-space.module';
import {HaNavigationPanelComponent} from '../ha-core/ha-component/ha-navigation-panel/ha-navigation-panel.component';
import {MatRippleModule} from "@angular/material/core";
import {HaUtilComponentCoreModule} from "../ha-core/entity-module/ha-util-component-core/ha-util-component-core.module";
import {HaCommentsCoreModule} from '../ha-core/entity-module/ha-comments-core/ha-comments-core.module';
import {HaLiveTaskInvitePageComponent} from './components/ha-live-task-invite-page/ha-live-task-invite-page.component';
import {
  HaLiveTaskVersionsPanelComponent
} from './components/ha-live-task-versions-panel/ha-live-task-versions-panel.component';
import {HaPublicBrickPageModule} from "../ha-public/module/ha-public-brick-page/ha-public-brick-page.module";

@NgModule({
  declarations: [
    HaLiveTaskListComponent,
    HaLiveTaskCreateDialogComponent,
    HaLiveTaskVersionDetailComponent,
    HaLiveTaskPageComponent,
    HaLiveTaskVersionPageComponent,
    HaLiveTaskOverviewComponent,
    HaLiveTaskCommentsComponent,
    HaLiveTaskInvitePageComponent,
    HaLiveTaskVersionsPanelComponent
  ],
    imports: [
        CommonModule,
        HaLiveTaskRoutingModule,
        HaCoreModule,
        ReactiveFormsModule,
        FlInputSearchModule,
        FlInputFileModule,
        FlCodeEditorModule,
        HaCardComponent,
        HaSpaceModule,
        HaNavigationPanelComponent,
        MatRippleModule,
        FormsModule,
        HaUtilComponentCoreModule,
        HaCommentsCoreModule,
        HaPublicBrickPageModule
    ],
})
export class HaLiveTaskModule {}
