import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HaCoreModule} from '../ha-core/ha-core.module';
import {HaLiveTaskRoutingModule} from './ha-live-task-routing.module';
import {HaLiveTaskListComponent} from './components/ha-live-task-list/ha-live-task-list.component';
import {
  HaLiveTaskCreateDialogComponent
} from './components/ha-live-task-create-dialog/ha-live-task-create-dialog.component';
import {ReactiveFormsModule} from '@angular/forms';
import {
  HaLiveTaskVersionDetailComponent
} from './components/ha-live-task-version-detail/ha-live-task-version-detail.component';
import {HaLiveTaskPageComponent} from './components/ha-live-task-page/ha-live-task-page.component';
import {FlCodeEditorModule, FlInputFileModule, FlInputSearchModule} from '@monorepo/front-core-lib';
import {
  HaLiveTaskVersionPageComponent
} from './components/ha-live-task-version-page/ha-live-task-version-page.component';
import {
  HaLiveTaskVersionDetailIoComponent
} from './components/ha-live-task-version-detail-io/ha-live-task-version-detail-io.component';
import {HaLiveTaskOverviewComponent} from './components/ha-live-task-overview/ha-live-task-overview.component';
import {HaLiveTaskCommentsComponent} from './components/ha-live-task-comments/ha-live-task-comments.component';
import {HaLiveTaskVersionsComponent} from './components/ha-live-task-versions/ha-live-task-versions.component';
import {HaCardComponent} from '../ha-core/ha-component/ha-card/ha-card.component';
import {HaSpaceModule} from '../ha-space/ha-space.module';
import {HaNavigationPanelComponent} from '../ha-core/ha-component/ha-navigation-panel/ha-navigation-panel.component';

@NgModule({
  declarations: [
    HaLiveTaskListComponent,
    HaLiveTaskCreateDialogComponent,
    HaLiveTaskVersionDetailComponent,
    HaLiveTaskPageComponent,
    HaLiveTaskVersionPageComponent,
    HaLiveTaskVersionDetailIoComponent,
    HaLiveTaskOverviewComponent,
    HaLiveTaskCommentsComponent,
    HaLiveTaskVersionsComponent,
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
  ],
})
export class HaLiveTaskModule {}
