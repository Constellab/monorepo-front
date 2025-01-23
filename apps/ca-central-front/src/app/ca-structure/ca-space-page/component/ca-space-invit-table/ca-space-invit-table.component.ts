import { Component, inject, Input } from '@angular/core';
import { CaSpaceInvitService } from '../../../../ca-core/service-api/ca-space-invit.service';
import {
  FlConfirmDialogInput,
  FlConfirmDialogResult,
  FlDialogService,
} from '@monorepo/front-core-lib/fl-dialog';
import { FlDatasourcePaginated, FlTableColumnStatic } from '@monorepo/front-core-lib/fl-core';

import {
  CaSpaceUserRoleDialogComponent,
  CaSpaceUserRoleDialogInput,
} from '../ca-space-user-role-dialog/ca-space-user-role-dialog.component';
import { CaSpaceInvit } from '../../../../ca-core/model/entities/space/ca-space-invit.class';
import { CaSpaceRole } from '../../../../ca-core/model/entities/space/ca-space-user.class';
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
import { MatTooltip } from '@angular/material/tooltip';
import { NgClass } from '@angular/common';
import { MatIconButton } from '@angular/material/button';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { MatIcon } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';
import { FlDateModule } from '@monorepo/front-core-lib/fl-date';

/**
 * Table for the SpaceInvit entity with actions
 */
@Component({
  selector: 'ca-space-invit-table',
  templateUrl: './ca-space-invit-table.component.html',
  styleUrls: ['./ca-space-invit-table.component.scss'],
  imports: [
    MatTable,
    MatColumnDef,
    MatHeaderCellDef,
    MatHeaderCell,
    MatCellDef,
    MatCell,
    MatTooltip,
    NgClass,
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
export class CaSpaceInvitTableComponent {
  private spaceInvitService = inject(CaSpaceInvitService);
  private dialogService = inject(FlDialogService);

  @Input() datasource: FlDatasourcePaginated<CaSpaceInvit>;

  @Input() columns: FlTableColumnStatic<CaSpaceInvit>[] = [
    'userMail',
    'role',
    'validUntil',
    'sentThe',
    'actions',
  ];

  openUpdateRoleDialog(invitation: CaSpaceInvit): void {
    const data: CaSpaceUserRoleDialogInput = {
      currentRole: invitation.role,
      updateRole: (role) => this.spaceInvitService.updateInvitationRole(invitation.id, role),
    };

    this.dialogService
      .openSmallDialog(CaSpaceUserRoleDialogComponent, { data })
      .afterClosed()
      .subscribe((role) => this.onUpdateRoleClosed(invitation, role));
  }

  private onUpdateRoleClosed(invitation: CaSpaceInvit, role?: CaSpaceRole): void {
    if (role) {
      invitation.role = role;
    }
  }

  openResendInvitationDialog(invitation: CaSpaceInvit): void {
    const input: FlConfirmDialogInput = {
      title: 'resend_invitation',
      content: 'resend_invitation_confirmation',
      observable: this.spaceInvitService.resendInvitation(invitation.id),
      successMessage: 'invitation_resent',
    };

    this.dialogService.openConfirmDialog(input);
  }

  openRefreshInvitationDialog(invitation: CaSpaceInvit): void {
    const input: FlConfirmDialogInput = {
      title: 'refresh_invitation_expiration',
      content: 'refresh_invitation_expiration_confirmation',
      observable: this.spaceInvitService.refreshInvitationValidUntil(invitation.id),
      successMessage: 'invitation_expiration_refreshed',
    };

    this.dialogService
      .openConfirmDialog(input)
      .afterClosed()
      .subscribe((result) => this.onRefreshClosed(result));
  }

  private onRefreshClosed(result: FlConfirmDialogResult<CaSpaceInvit>): void {
    if (result.choice) {
      this.datasource.updateItem(result.result);
    }
  }

  openDeleteInvitationDialog(invitation: CaSpaceInvit): void {
    const input: FlConfirmDialogInput = {
      title: 'delete_invitation',
      content: 'delete_invitation_confirmation',
      observable: this.spaceInvitService.deleteInvitation(invitation.id),
      successMessage: 'invitation_deleted',
    };

    this.dialogService
      .openConfirmDialog(input)
      .afterClosed()
      .subscribe((result) => this.onDeleteClosed(result, invitation));
  }

  private onDeleteClosed(result: FlConfirmDialogResult<void>, invitation: CaSpaceInvit): void {
    if (result.choice) {
      this.datasource.removeItem(invitation);
    }
  }
}
