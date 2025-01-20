import { Component, Input } from '@angular/core';
import {
  FlConfirmDialogInput,
  FlConfirmDialogResult,
  FlDialogService,
  FlTableColumnStatic,
} from '@monorepo/front-core-lib';
import { CaLabUser, CaLabUserDatasource } from '../../../../ca-core/model/entities/lab/ca-lab-user.class';
import { CaLabService } from '../../../../ca-core/service-api/ca-lab.service';
import {
  CaLabUserFormDialogComponent,
  LabUserFormDialogInput,
} from '../ca-lab-user-form-dialog/ca-lab-user-form-dialog.component';

@Component({
    selector: 'ca-lab-users-table',
    templateUrl: './ca-lab-users-table.component.html',
    styleUrls: ['./ca-lab-users-table.component.scss'],
    standalone: false
})
export class CaLabUsersTableComponent {
  @Input({ required: true }) datasource: CaLabUserDatasource;

  @Input({ required: true }) labId: string;

  @Input() columns: FlTableColumnStatic<CaLabUser>[] = ['user', 'role', 'createdBy', 'createdAt'];

  constructor(
    private labService: CaLabService,
    private dialogService: FlDialogService
  ) {}

  openUpdateUserRoleDialog(labUSer: CaLabUser): void {
    const input: LabUserFormDialogInput = {
      mode: 'update',
      object: labUSer,
      labId: this.labId,
    };

    this.dialogService
      .openSmallDialog(CaLabUserFormDialogComponent, { data: input })
      .afterClosed()
      .subscribe((updatedUser: CaLabUser) => this.onUpdateRoleClosed(labUSer, updatedUser));
  }

  private onUpdateRoleClosed(labUser: CaLabUser, newLabUser?: CaLabUser): void {
    if (newLabUser) {
      labUser.role = newLabUser.role;
    }
  }

  openDeleteUserDialog(labUser: CaLabUser): void {
    const data: FlConfirmDialogInput = {
      title: 'delete_lab_user',
      content: 'delete_lab_user_confirmation',
      observable: this.labService.removeUserFromLab(this.labId, labUser.user.id),
      successMessage: 'lab_user_deleted',
    };

    this.dialogService
      .openConfirmDialog(data)
      .afterClosed()
      .subscribe((result: FlConfirmDialogResult<void>) => this.onDeleteUserClosed(result, labUser));
  }

  private onDeleteUserClosed(result: FlConfirmDialogResult<void>, labUser: CaLabUser): void {
    if (result.choice) {
      this.datasource.removeItem(labUser);
    }
  }
}
