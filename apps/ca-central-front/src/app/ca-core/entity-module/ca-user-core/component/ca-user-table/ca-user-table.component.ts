import {Component, ContentChild, Input, TemplateRef} from '@angular/core';
import {CaUser, CaUserDatasourcePaginated} from '../../../../model/entities/ca-user.class';
import {
  FlConfirmDialogInput,
  FlConfirmDialogResult,
  FlDialogService,
  FlTableColumnStatic,
  FlViewContext
} from '@monorepo/front-core-lib';
import {ClUserStatus} from '@monorepo/core-lib';
import {CaUserAccountsService} from '../../../../service-api/ca-user-accounts.service';

/**
 * Table to display users
 * It supports a template content in column
 */
@Component({
  selector: 'ca-user-table',
  templateUrl: './ca-user-table.component.html',
  styleUrls: ['./ca-user-table.component.scss']
})
export class CaUserTableComponent {

  @Input() datasource: CaUserDatasourcePaginated;

  @Input() columns: FlTableColumnStatic<CaUser>[] = ['fullname', 'email', 'phone', 'category', 'lastLogin', 'createdAt', 'adminActions'];

  @ContentChild(TemplateRef) templateRef: TemplateRef<any>;

  constructor(private userAccountsService: CaUserAccountsService,
              private dialogService: FlDialogService) {
  }

  isLocked(user: CaUser): boolean{
    return user.status === ClUserStatus.LOCKED_BY_ADMIN;
  }

  getUserViewContext(user: CaUser): FlViewContext<CaUser> {
    return {$implicit: user};
  }

  lockUser(user: CaUser): void {
    const input: FlConfirmDialogInput = {
      title: 'lock_user',
      content: 'lock_user_confirmation',
      translateTitleAndContent: true,
      observable: this.userAccountsService.lockUser(user.id),
      successMessage: 'user_locked',
      translateMessage: true
    };

    this.openConfirmDialog(input);
  }

  unlockUser(user: CaUser): void {
    const input: FlConfirmDialogInput = {
      title: 'unlock_user',
      content: 'unlock_user_confirmation',
      translateTitleAndContent: true,
      observable: this.userAccountsService.unlockUser(user.id),
      successMessage: 'user_unlocked',
      translateMessage: true
    };

    this.openConfirmDialog(input);
  }

  private openConfirmDialog(input: FlConfirmDialogInput): void {
    this.dialogService.openConfirmDialog(input).afterClosed().subscribe(
      (result: FlConfirmDialogResult<CaUser>) => this.onDialogClosed(result)
    );
  }

  private onDialogClosed(result: FlConfirmDialogResult<CaUser>): void {
    if (result.choice) {
      this.datasource.updateItem(result.result);
    }
  }

}
