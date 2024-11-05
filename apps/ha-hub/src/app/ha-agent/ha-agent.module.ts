import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HaCoreModule } from '../ha-core/ha-core.module';
import { HaAgentRoutingModule } from './ha-agent-routing.module';
import { HaAgentListComponent } from './components/ha-agent-list/ha-agent-list.component';
import { HaAgentCreateDialogComponent } from './components/ha-agent-create-dialog/ha-agent-create-dialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HaAgentVersionDetailComponent } from './components/ha-agent-version-detail/ha-agent-version-detail.component';
import { HaAgentPageComponent } from './components/ha-agent-page/ha-agent-page.component';
import { HaAgentVersionPageComponent } from './components/ha-agent-version-page/ha-agent-version-page.component';
import { HaAgentOverviewComponent } from './components/ha-agent-overview/ha-agent-overview.component';
import { HaAgentCommentsComponent } from './components/ha-agent-comments/ha-agent-comments.component';
import { HaCardComponent } from '../ha-core/ha-component/ha-card/ha-card.component';
import { HaSpaceModule } from '../ha-space/ha-space.module';
import { HaNavigationPanelComponent } from '../ha-core/ha-component/ha-navigation-panel/ha-navigation-panel.component';
import { HaUtilComponentCoreModule } from '../ha-core/entity-module/ha-util-component-core/ha-util-component-core.module';
import { HaCommentsCoreModule } from '../ha-core/entity-module/ha-comments-core/ha-comments-core.module';
import { HaAgentInvitePageComponent } from './components/ha-agent-invite-page/ha-agent-invite-page.component';
import { HaAgentVersionsPanelComponent } from './components/ha-agent-versions-panel/ha-agent-versions-panel.component';
import { HaPublicBrickPageModule } from '../ha-public/module/ha-public-brick-page/ha-public-brick-page.module';
import { HaAgentContentViewComponent } from './components/ha-agent-view/ha-agent-content-view/ha-agent-content-view.component';
import { HaAgentResourceViewInputDialogComponent } from './components/ha-agent-view/ha-agent-resource-view-input-dialog/ha-agent-resource-view-input-dialog.component';
import { HaAgentEditStyleDialogComponent } from './components/ha-agent-edit-style-dialog/ha-agent-edit-style-dialog.component';
import { MatCheckbox } from '@angular/material/checkbox';

@NgModule({
  declarations: [
    HaAgentListComponent,
    HaAgentCreateDialogComponent,
    HaAgentVersionDetailComponent,
    HaAgentPageComponent,
    HaAgentVersionPageComponent,
    HaAgentOverviewComponent,
    HaAgentCommentsComponent,
    HaAgentInvitePageComponent,
    HaAgentVersionsPanelComponent,
    HaAgentContentViewComponent,
    HaAgentResourceViewInputDialogComponent,
    HaAgentEditStyleDialogComponent,
  ],
  imports: [
    CommonModule,
    HaAgentRoutingModule,
    HaCoreModule,
    ReactiveFormsModule,
    HaCardComponent,
    HaSpaceModule,
    HaNavigationPanelComponent,
    FormsModule,
    HaUtilComponentCoreModule,
    HaCommentsCoreModule,
    HaPublicBrickPageModule,
    MatCheckbox,
  ],
})
export class HaAgentModule {}
