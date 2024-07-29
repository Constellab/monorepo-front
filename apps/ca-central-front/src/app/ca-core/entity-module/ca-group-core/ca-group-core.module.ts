import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CaCoreModule } from '../../ca-core.module';
import { CaGroupInlineComponent } from './component/ca-group-inline/ca-group-inline.component';
import { CaGroupShareDialogComponent } from './component/ca-group-share-dialog/ca-group-share-dialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CaTeamCardComponent } from './component/ca-team-card/ca-team-card.component';
import { RouterModule } from '@angular/router';
import { CaGroupAddUserDialogComponent } from './component/ca-group-add-user-dialog/ca-group-add-user-dialog.component';
import { CaTeamFormDialogComponent } from './component/ca-team-form-dialog/ca-team-form-dialog.component';
import { CaTeamTableComponent } from './component/ca-team-table/ca-team-table.component';
import { CaTeamActionMenuComponent } from './component/ca-team-action-menu/ca-team-action-menu.component';
import { CaTeamSearchComponent } from './component/ca-team-search/ca-team-search.component';
import { CaTeamSearchFormComponent } from './component/ca-team-search-form/ca-team-search-form.component';
import { CaProjectCoreModule } from '../ca-project-core/ca-project-core.module';
import { CaUserGroupTableComponent } from './component/ca-user-group-table/ca-user-group-table.component';
import { CaSelectGroupComponent } from './component/ca-select-group/ca-select-group.component';

@NgModule({
  declarations: [
    CaGroupInlineComponent,
    CaGroupShareDialogComponent,
    CaTeamCardComponent,
    CaGroupAddUserDialogComponent,
    CaTeamFormDialogComponent,
    CaTeamTableComponent,
    CaTeamActionMenuComponent,
    CaTeamSearchComponent,
    CaTeamSearchFormComponent,
    CaUserGroupTableComponent,
    CaSelectGroupComponent
  ],
  exports: [
    CaGroupInlineComponent,
    CaGroupShareDialogComponent,
    CaTeamCardComponent,
    CaGroupAddUserDialogComponent,
    CaTeamFormDialogComponent,
    CaTeamTableComponent,
    CaTeamActionMenuComponent,
    CaTeamSearchComponent,
    CaTeamSearchFormComponent,
    CaUserGroupTableComponent,
    CaSelectGroupComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,

    CaCoreModule,
    CaProjectCoreModule
  ]
})
export class CaGroupCoreModule {
}
