import { NgTemplateOutlet } from '@angular/common';
import { Component, ContentChild, inject, Input, TemplateRef } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { MatSortHeader } from '@angular/material/sort';
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
import { RouterLink } from '@angular/router';
import { ClUserStatus } from '@monorepo/core-lib';
import { FlTableColumnStatic, FlViewContext } from '@monorepo/front-core-lib/fl-core';
import { FlDateModule } from '@monorepo/front-core-lib/fl-date';
import {
  FlConfirmDialogInput,
  FlConfirmDialogResult,
  FlDialogService,
} from '@monorepo/front-core-lib/fl-dialog';
import { FlSearchModule } from '@monorepo/front-core-lib/fl-search';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { FlUserModule } from '@monorepo/front-core-lib/fl-user';
import { TranslatePipe } from '@ngx-translate/core';

import { CaUser, CaUserDatasourcePaginated } from '../../../../model/entities/ca-user.class';
import { CaDetailRoutePipe } from '../../../../module/ca-core-pipe/ca-detail-route/ca-detail-route.pipe';
import { CaUserAccountsService } from '../../../../service-api/ca-user-accounts.service';
import {
  CaUserUpdateLicenseDialogInput,
  CaUserUpdateLicenseFormDialogComponent,
} from '../ca-user-update-license-form-dialog/ca-user-update-license-form-dialog.component';

/**
 * Table to display users
 * It supports a template content in column
 */
@Component({
  selector: 'ca-user-table',
  templateUrl: './ca-user-table.component.html',
  styleUrls: ['./ca-user-table.component.scss'],
  imports: [
    MatTable,
    FlSearchModule,
    MatColumnDef,
    MatHeaderCellDef,
    MatHeaderCell,
    MatSortHeader,
    MatCellDef,
    MatCell,
    FlUserModule,
    FlDateModule,
    FlTextIconModule,
    MatIcon,
    MatTooltip,
    MatIconButton,
    MatMenuTrigger,
    MatMenu,
    MatMenuItem,
    RouterLink,
    NgTemplateOutlet,
    MatHeaderRowDef,
    MatHeaderRow,
    MatRowDef,
    MatRow,
    CaDetailRoutePipe,
    TranslatePipe,
  ],
})
export class CaUserTableComponent {
  private userAccountsService = inject(CaUserAccountsService);
  private dialogService = inject(FlDialogService);

  @Input({ required: true }) datasource: CaUserDatasourcePaginated<any>;

  @Input() columns: FlTableColumnStatic<CaUser>[] = [
    'alias',
    'contact',
    'category',
    'lastLogin',
    'createdAt',
    'adminActions',
  ];

  @ContentChild(TemplateRef) templateRef: TemplateRef<any>;

  isLocked(user: CaUser): boolean {
    return user.status === ClUserStatus.LOCKED_BY_ADMIN;
  }

  getUserViewContext(user: CaUser): FlViewContext<CaUser> {
    return { $implicit: user };
  }

  lockUser(user: CaUser): void {
    const input: FlConfirmDialogInput = {
      title: 'lock_user',
      content: 'lock_user_confirmation',
      observable: this.userAccountsService.lockUser(user.id),
      successMessage: 'user_locked',
    };

    this.openConfirmDialog(input);
  }

  unlockUser(user: CaUser): void {
    const input: FlConfirmDialogInput = {
      title: 'unlock_user',
      content: 'unlock_user_confirmation',
      observable: this.userAccountsService.unlockUser(user.id),
      successMessage: 'user_unlocked',
    };

    this.openConfirmDialog(input);
  }

  private openConfirmDialog(input: FlConfirmDialogInput): void {
    this.dialogService
      .openConfirmDialog(input)
      .afterClosed()
      .subscribe((result: FlConfirmDialogResult<CaUser>) => this.onDialogClosed(result));
  }

  private onDialogClosed(result: FlConfirmDialogResult<CaUser>): void {
    if (result.choice) {
      this.datasource.updateItem(result.result);
    }
  }

  updateLicense(user: CaUser): void {
    const input: CaUserUpdateLicenseDialogInput = {
      userId: user.id,
      license: user.license,
    };

    this.dialogService
      .openSmallDialog(CaUserUpdateLicenseFormDialogComponent, { data: input })
      .afterClosed()
      .subscribe((result: CaUser) => this.updateLicenseClosed(result));
  }

  private updateLicenseClosed(user?: CaUser): void {
    if (user) {
      this.datasource.updateItem(user);
    }
  }

  resendActivationMail(user: CaUser): void {
    const input: FlConfirmDialogInput = {
      title: 'resend_activation_mail',
      content: 'resend_activation_mail_confirmation',
      observable: this.userAccountsService.resendActivationMail(user.id),
      successMessage: 'activation_mail_resent',
    };

    this.dialogService.openConfirmDialog(input).afterClosed().subscribe();
  }

  deleteUser(user: CaUser): void {
    const input: FlConfirmDialogInput = {
      title: 'delete_user',
      content: 'delete_user_confirmation',
      observable: this.userAccountsService.deleteUser(user.id),
      successMessage: 'user_deleted',
    };

    this.dialogService
      .openConfirmDialog(input)
      .afterClosed()
      .subscribe((result) => this.onDeleteUserClosed(result, user));
  }

  private onDeleteUserClosed(result: FlConfirmDialogResult, user: CaUser): void {
    if (result.choice) {
      this.datasource.removeItem(user);
    }
  }
}
