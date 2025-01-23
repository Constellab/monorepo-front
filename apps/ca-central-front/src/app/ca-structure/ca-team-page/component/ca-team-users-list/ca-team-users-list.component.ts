import { Component, Input, OnInit, inject } from '@angular/core';
import { FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import {
  CaGroupAddUserDialogComponent,
  CaGroupAddUserDialogInput,
} from '../../../../ca-core/entity-module/ca-group-core/component/ca-group-add-user-dialog/ca-group-add-user-dialog.component';
import { CaGroupService } from '../../../../ca-core/service-api/ca-group.service';
import { CaUserGroup, CaUserGroupDatasource } from '../../../../ca-core/model/entities/ca-group.entity';
import { FlCardModule } from '@monorepo/front-core-lib/fl-card';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import { FlInfiniteScrollModule } from '@monorepo/front-core-lib/fl-infinite-scroll';
import { CaUserGroupTableComponent } from '../../../../ca-core/entity-module/ca-group-core/component/ca-user-group-table/ca-user-group-table.component';
import { TranslatePipe } from '@ngx-translate/core';

/**
 * Component to list the users of a team
 * with possibility to add or remove users.
 */
@Component({
  selector: 'ca-team-users-list',
  templateUrl: './ca-team-users-list.component.html',
  styleUrls: ['./ca-team-users-list.component.scss'],
  imports: [
    FlCardModule,
    FlTextIconModule,
    MatIcon,
    MatButton,
    FlInfiniteScrollModule,
    CaUserGroupTableComponent,
    TranslatePipe,
  ],
})
export class CaTeamUsersListComponent implements OnInit {
  private groupService = inject(CaGroupService);
  private dialogService = inject(FlDialogService);

  @Input() groupId: string;

  datasource: CaUserGroupDatasource;

  ngOnInit(): void {
    this.datasource = new CaUserGroupDatasource(
      (page, size) => this.groupService.getUsersOfTeam(this.groupId, page, size),
      20
    );
  }

  openAddUserDialog(): void {
    const input: CaGroupAddUserDialogInput = {
      addUserToGroup: (userId: string) => this.groupService.addUserToTeam(this.groupId, userId),
      title: 'team_add_user',
      successMessage: 'team_user_added',
    };

    this.dialogService
      .openSmallDialog(CaGroupAddUserDialogComponent, { data: input })
      .afterClosed()
      .subscribe((user) => this.onAddUserClosed(user));
  }

  private onAddUserClosed(userGroup?: CaUserGroup): void {
    if (userGroup) {
      this.datasource.addItem(userGroup, () => true);
    }
  }
}
