import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CaCoreModule } from '../../ca-core/ca-core.module';
import { CaTeamPageComponent } from './component/ca-team-page/ca-team-page.component';
import { CaTeamDetailComponent } from './component/ca-team-detail/ca-team-detail.component';
import { CaTeamUsersListComponent } from './component/ca-team-users-list/ca-team-users-list.component';
import { CaFolderCoreModule } from '../../ca-core/entity-module/ca-folder-core/ca-folder-core.module';
import { CaGroupCoreModule } from '../../ca-core/entity-module/ca-group-core/ca-group-core.module';
import { RouterModule } from '@angular/router';

/**
 * Module for the page of group of type USERS
 */
@NgModule({
  declarations: [CaTeamPageComponent, CaTeamDetailComponent, CaTeamUsersListComponent],
  imports: [CommonModule, RouterModule, CaCoreModule, CaFolderCoreModule, CaGroupCoreModule],
})
export class CaTeamPageModule {}
