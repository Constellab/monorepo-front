import {NgModule} from '@angular/core';
import {HaStoryRoutingModule} from './ha-story-routing.module';
import {HaStoryPageComponent} from './module/ha-story-page/ha-story-page.component';
import {HaStoryEditPageComponent} from './module/ha-story-edit-page/ha-story-edit-page.component';
import {HaStoryListPageComponent} from './module/ha-story-list-page/ha-story-list-page.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HaCoreModule} from '../ha-core/ha-core.module';
import {HaStoryCreateDialogComponent} from './module/ha-story-create-dialog/ha-story-create-dialog.component';
import {CommonModule} from '@angular/common';
import {HaStoryInvitePageComponent} from './module/ha-story-invite-page/ha-story-invite-page.component';
import {FlImageModule, FlInputFileModule} from '@monorepo/front-core-lib';
import {MatTooltipModule} from '@angular/material/tooltip';
import {
  HaStoryContentViewComponent
} from './module/ha-story-view/ha-story-content-view/ha-story-content-view.component';
import {
  HaStoryResourceViewInputDialogComponent
} from './module/ha-story-view/ha-story-resource-view-input-dialog/ha-story-resource-view-input-dialog.component';
import {HaCoAuthorCoreModule} from '../ha-core/entity-module/ha-co-author-core/ha-co-author-core.module';
import {HaUtilComponentCoreModule} from "../ha-core/entity-module/ha-util-component-core/ha-util-component-core.module";
import {HaCommentsCoreModule} from '../ha-core/entity-module/ha-comments-core/ha-comments-core.module';
import {HaFileCoreModule} from '../ha-core/entity-module/ha-file-core/ha-file-core.module';
import {HaPublicBrickPageModule} from "../ha-public/module/ha-public-brick-page/ha-public-brick-page.module";
import {
  HaTextEditorHistoryCoreModule
} from '../ha-core/entity-module/ha-text-editor-history-core/ha-text-editor-history-core.module';

@NgModule({
  declarations: [
    HaStoryPageComponent,
    HaStoryEditPageComponent,
    HaStoryListPageComponent,
    HaStoryCreateDialogComponent,
    HaStoryInvitePageComponent,
    HaStoryContentViewComponent,
    HaStoryResourceViewInputDialogComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    HaStoryRoutingModule,
    HaCoreModule,
    FlInputFileModule,
    MatTooltipModule,

    HaCoAuthorCoreModule,
    HaUtilComponentCoreModule,
    HaCommentsCoreModule,
    HaFileCoreModule,
    HaPublicBrickPageModule,
    HaTextEditorHistoryCoreModule,
    FlImageModule
  ],
})
export class HaStoryModule {}
