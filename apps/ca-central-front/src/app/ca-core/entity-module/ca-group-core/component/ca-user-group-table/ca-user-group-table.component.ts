import { Component, Input } from '@angular/core';
import {
  FlConfirmDialogInput,
  FlConfirmDialogResult,
  FlDialogService,
  FlTableColumnStatic,
} from '@monorepo/front-core-lib';
import { CaUserGroup, CaUserGroupDatasource } from '../../../../model/entities/ca-group.entity';
import { CaGroupService } from '../../../../service-api/ca-group.service';

@Component({
  selector: 'ca-user-group-table',
  templateUrl: './ca-user-group-table.component.html',
  styleUrls: ['./ca-user-group-table.component.scss'],
})
export class CaUserGroupTableComponent {
  @Input() datasource: CaUserGroupDatasource;

  @Input() columns: FlTableColumnStatic<CaUserGroup>[] = ['user', 'creation', 'actions'];

  constructor(
    private groupService: CaGroupService,
    private dialogService: FlDialogService
  ) {}

  openRemoveUserDialog(userGroup: CaUserGroup): void {
    const data: FlConfirmDialogInput = {
      title: 'team_remove_user',
      content: 'team_remove_user_confirmation',
      observable: this.groupService.removeUserFromTeam(userGroup.groupId, userGroup.user.id),
      successMessage: 'team_user_removed',
    };

    this.dialogService
      .openConfirmDialog(data)
      .afterClosed()
      .subscribe((result) => this.onRemoveUserClosed(result, userGroup));
  }

  private onRemoveUserClosed(result: FlConfirmDialogResult, userGroup: CaUserGroup): void {
    if (result.choice) {
      this.datasource.removeItem(userGroup);
    }
  }
}
