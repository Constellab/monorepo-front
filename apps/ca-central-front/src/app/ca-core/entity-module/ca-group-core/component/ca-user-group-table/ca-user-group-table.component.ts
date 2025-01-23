import { Component, inject, Input } from '@angular/core';
import {
  FlConfirmDialogInput,
  FlConfirmDialogResult,
  FlDialogService,
} from '@monorepo/front-core-lib/fl-dialog';
import { FlTableColumnStatic } from '@monorepo/front-core-lib/fl-core';

import { CaUserGroup, CaUserGroupDatasource } from '../../../../model/entities/ca-group.entity';
import { CaGroupService } from '../../../../service-api/ca-group.service';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable,
} from '@angular/material/table';
import { FlUserModule } from '@monorepo/front-core-lib/fl-user';
import { MatIconButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { MatIcon } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'ca-user-group-table',
  templateUrl: './ca-user-group-table.component.html',
  styleUrls: ['./ca-user-group-table.component.scss'],
  imports: [
    MatTable,
    MatColumnDef,
    MatHeaderCellDef,
    MatHeaderCell,
    MatCellDef,
    MatCell,
    FlUserModule,
    MatIconButton,
    MatTooltip,
    MatIcon,
    MatHeaderRowDef,
    MatHeaderRow,
    MatRowDef,
    MatRow,
    TranslatePipe,
  ],
})
export class CaUserGroupTableComponent {
  private groupService = inject(CaGroupService);
  private dialogService = inject(FlDialogService);

  @Input() datasource: CaUserGroupDatasource;

  @Input() columns: FlTableColumnStatic<CaUserGroup>[] = ['user', 'creation', 'actions'];

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
