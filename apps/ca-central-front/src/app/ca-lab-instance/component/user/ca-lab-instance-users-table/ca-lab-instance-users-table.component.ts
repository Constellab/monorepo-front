import { Component, Input } from '@angular/core';
import {
  FlConfirmDialogInput,
  FlConfirmDialogResult,
  FlDialogService,
  FlTableColumnStatic
} from '@monorepo/front-core-lib';
import {
  CaLabInstanceUser,
  CaLabInstanceUserDatasource
} from '../../../../ca-core/model/entities/lab/ca-lab-instance-user.class';
import { CaLabInstanceService } from '../../../../ca-core/service-api/ca-lab-instance.service';
import {
  CaLabInstanceUserFormDialogComponent,
  LabInstanceUserFormDialogInput
} from '../ca-lab-instance-user-form-dialog/ca-lab-instance-user-form-dialog.component';

@Component({
  selector: 'ca-lab-instance-users-table',
  templateUrl: './ca-lab-instance-users-table.component.html',
  styleUrls: ['./ca-lab-instance-users-table.component.scss']
})
export class CaLabInstanceUsersTableComponent {

  @Input({ required: true }) datasource: CaLabInstanceUserDatasource;

  @Input({ required: true }) labInstanceId: string;

  @Input() columns: FlTableColumnStatic<CaLabInstanceUser>[] = ['user', 'role', 'createdBy', 'createdAt'];

  constructor(private labInstanceService: CaLabInstanceService,
              private dialogService: FlDialogService) {
  }


  openUpdateUserRoleDialog(labUSer: CaLabInstanceUser): void {
    const input: LabInstanceUserFormDialogInput = {
      mode: 'update',
      object: labUSer,
      labInstanceId: this.labInstanceId
    };

    this.dialogService.openSmallDialog(CaLabInstanceUserFormDialogComponent, { data: input }).afterClosed().subscribe(
      (updatedUser: CaLabInstanceUser) => this.onUpdateRoleClosed(labUSer, updatedUser)
    );
  }

  private onUpdateRoleClosed(labUser: CaLabInstanceUser, newLabUser?: CaLabInstanceUser): void {
    if (newLabUser) {
      labUser.role = newLabUser.role;
    }
  }

  openDeleteUserDialog(labUser: CaLabInstanceUser): void {
    const data: FlConfirmDialogInput = {
      title: 'delete_lab_user',
      content: 'delete_lab_user_confirmation',
      translateTitleAndContent: true,
      observable: this.labInstanceService.removeUserFromLab(this.labInstanceId, labUser.user.id),
      successMessage: 'lab_user_deleted',
      translateMessage: true
    };

    this.dialogService.openConfirmDialog(data).afterClosed().subscribe(
      (result: FlConfirmDialogResult<void>) => this.onDeleteUserClosed(result, labUser)
    );
  }

  private onDeleteUserClosed(result: FlConfirmDialogResult<void>, labUser: CaLabInstanceUser): void {
    if (result.choice) {
      this.datasource.removeItem(labUser);
    }
  }
}
