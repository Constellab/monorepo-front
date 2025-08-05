import { Component, inject, Input } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
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
import { FlTableColumnStatic } from '@monorepo/front-core-lib/fl-core';
import { FlDateModule } from '@monorepo/front-core-lib/fl-date';
import {
  FlConfirmDialogInput,
  FlConfirmDialogResult,
  FlDialogService,
} from '@monorepo/front-core-lib/fl-dialog';
import { FlUserModule } from '@monorepo/front-core-lib/fl-user';
import { TranslatePipe } from '@ngx-translate/core';

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
  imports: [
    MatTable,
    MatColumnDef,
    MatHeaderCellDef,
    MatHeaderCell,
    MatCellDef,
    MatCell,
    FlUserModule,
    MatIconButton,
    MatMenuTrigger,
    MatIcon,
    MatMenu,
    MatMenuItem,
    MatHeaderRowDef,
    MatHeaderRow,
    MatRowDef,
    MatRow,
    TranslatePipe,
    FlDateModule,
  ],
})
export class CaLabUsersTableComponent {
  private labService = inject(CaLabService);
  private dialogService = inject(FlDialogService);

  @Input({ required: true }) datasource: CaLabUserDatasource;

  @Input({ required: true }) labId: string;

  @Input() columns: FlTableColumnStatic<CaLabUser>[] = ['user', 'role', 'createdBy', 'createdAt'];

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
