import { ChangeDetectionStrategy,Component, inject, OnInit } from '@angular/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { FlCardModule } from '@monorepo/front-core-lib/fl-card';
import { FlTableColumnStatic } from '@monorepo/front-core-lib/fl-core';
import {
  FlConfirmDialogInput,
  FlConfirmDialogResult,
  FlDialogService,
} from '@monorepo/front-core-lib/fl-dialog';
import { FlSavedSearch, FlSearchConfig, FlSearchState } from '@monorepo/front-core-lib/fl-search';
import { FlSearchModule } from '@monorepo/front-core-lib/fl-search';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { FlThemeService } from '@monorepo/front-core-lib/fl-theme';
import { TranslatePipe } from '@ngx-translate/core';

import { CaCurrentSpaceInvitDialogComponent } from '../../../../../ca-structure/ca-space-page/component/ca-current-space-invit-dialog/ca-current-space-invit-dialog.component';
import {
  CaSpaceUserRoleDialogComponent,
  CaSpaceUserRoleDialogInput,
} from '../../../../../ca-structure/ca-space-page/component/ca-space-user-role-dialog/ca-space-user-role-dialog.component';
import {
  CaSpaceRole,
  CaSpaceUser,
  CaSpaceUserDatasource,
} from '../../../../model/entities/space/ca-space-user.class';
import { CaIsAdminDirective } from '../../../../module/ca-core-directive/ca-is-admin/ca-is-admin.directive';
import { CaIsSpaceAdminDirective } from '../../../../module/ca-core-directive/ca-is-space-admlin/ca-is-space-admin.directive';
import { CaCurrentSpaceService } from '../../../../service-api/ca-current-space.service';
import {
  CaGroupAddUserDialogComponent,
  CaGroupAddUserDialogInput,
} from '../../../ca-group-core/component/ca-group-add-user-dialog/ca-group-add-user-dialog.component';
import { CaSpaceSearchFields } from '../../model/ca-space-search.class';
import { CaSpaceUserSearch, CaSpaceUserSearchFields } from '../../model/ca-space-user-search.class';
import { CaSpaceUserSearchFormComponent } from '../ca-space-user-search-form/ca-space-user-search-form.component';
import { CaSpaceUserTableComponent } from '../ca-space-user-table/ca-space-user-table.component';

@Component({
  selector: 'ca-space-user-search',
  templateUrl: './ca-space-user-search.component.html',
  styleUrls: ['./ca-space-user-search.component.scss'],
  providers: [FlSearchState],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    FlCardModule,
    FlSearchModule,
    FlTextIconModule,
    MatIcon,
    CaIsAdminDirective,
    MatIconButton,
    MatTooltip,
    CaSpaceUserSearchFormComponent,
    CaSpaceUserTableComponent,
    TranslatePipe,
    CaIsSpaceAdminDirective,
    MatButton,
  ],
})
export class CaSpaceUserSearchComponent implements OnInit {
  private searchState = inject<FlSearchState<any>>(FlSearchState);
  private currentSpaceService = inject(CaCurrentSpaceService);
  private themeService = inject(FlThemeService);
  private dialogService = inject(FlDialogService);

  datasource: CaSpaceUserDatasource<CaSpaceUserSearchFields>;

  columns: FlTableColumnStatic<CaSpaceUser>[] = ['user', 'role', 'active', 'addedInfo'];

  ngOnInit(): void {
    // only show the remove button if the user is an admin
    if (this.currentSpaceService.isSpaceAdmin()) {
      this.columns.push('lastLogin', 'actions');
    }

    const config: FlSearchConfig = {
      version: 1,
      buildAdvancedForm: CaSpaceUserSearch.getSearchForm,
      advancedFormClass: CaSpaceUserSearchFields,
      savedSearch: this.getSavedSearch(),
      advancedFormManager: {
        config: CaSpaceUserSearch.searchManagerConfig,
      },
      storeSearchInUrl: true,
      defaultSort: { key: 'user', direction: 'ASC' },
    };

    this.datasource = new CaSpaceUserDatasource(
      (page, size, data) => this.currentSpaceService.searchSpaceUsers(page, size, data),
      20,
      { initFirstPage: false }
    );
    this.searchState.init(config, this.datasource);
  }

  private getSavedSearch(): FlSavedSearch[] {
    return [
      {
        searchName: 'ca-space',
        id: null,
        label: 'All spaces',
        color: this.themeService.getCurrentThemeDetail().primary,
        version: 1,
        default: true,
        filtersCriteria: {} as Partial<CaSpaceSearchFields>,
      },
    ];
  }

  openAddUserDialog(): void {
    const input: CaGroupAddUserDialogInput = {
      addUserToGroup: (userId: string) => this.currentSpaceService.addUserToSpace(userId),
      title: 'space_add_user',
      successMessage: 'space_user_added',
      selectUserMode: 'all', // add the add bouton is only for admin, set the select to all user
    };

    this.dialogService
      .openSmallDialog(CaGroupAddUserDialogComponent, { data: input })
      .afterClosed()
      .subscribe((user) => this.onAddUserClosed(user));
  }

  private onAddUserClosed(user?: CaSpaceUser): void {
    if (user) {
      this.datasource.addItem(user, () => true);
    }
  }

  openUpdateRoleDialog(user: CaSpaceUser): void {
    const data: CaSpaceUserRoleDialogInput = {
      currentRole: user.role,
      updateRole: (role) => this.currentSpaceService.updateUserRole(user.user.id, role),
    };

    this.dialogService
      .openSmallDialog(CaSpaceUserRoleDialogComponent, { data })
      .afterClosed()
      .subscribe((role) => this.onUpdateRoleClosed(user, role));
  }

  private onUpdateRoleClosed(user: CaSpaceUser, role?: CaSpaceRole): void {
    if (role) {
      user.role = role;
    }
  }

  openDeactivateUserDialog(user: CaSpaceUser): void {
    const data: FlConfirmDialogInput = {
      title: 'space_deactivate_license',
      content: 'space_deactivate_license_confirmation',
      observable: this.currentSpaceService.deactivateUser(user.user.id),
      successMessage: 'space_license_deactivated',
    };

    this.dialogService
      .openConfirmDialog(data)
      .afterClosed()
      .subscribe((result) => this.onDeactivateUserClosed(result, user));
  }

  private onDeactivateUserClosed(result: FlConfirmDialogResult, user: CaSpaceUser): void {
    if (result.choice) {
      user.active = false;
    }
  }

  openActivateUser(user: CaSpaceUser): void {
    const data: FlConfirmDialogInput = {
      title: 'space_activate_license',
      content: 'space_activate_license_confirmation',
      observable: this.currentSpaceService.activateUser(user.user.id),
      successMessage: 'space_license_activated',
    };

    this.dialogService
      .openConfirmDialog(data)
      .afterClosed()
      .subscribe((result) => this.onActivateUserClosed(result, user));
  }

  private onActivateUserClosed(result: FlConfirmDialogResult, user: CaSpaceUser): void {
    if (result.choice) {
      user.active = true;
    }
  }

  openRemoveUserDialog(user: CaSpaceUser): void {
    const data: FlConfirmDialogInput = {
      title: 'space_remove_user',
      content: 'space_remove_user_confirmation',
      observable: this.currentSpaceService.removeUserFromSpace(user.user.id),
      successMessage: 'space_user_removed',
    };

    this.dialogService
      .openConfirmDialog(data)
      .afterClosed()
      .subscribe((result) => this.onRemoveUserClosed(result, user));
  }

  private onRemoveUserClosed(result: FlConfirmDialogResult, user: CaSpaceUser): void {
    if (result.choice) {
      this.datasource.removeItem(user);
    }
  }

  openInvitationDialog(): void {
    this.dialogService.openBigDialog(CaCurrentSpaceInvitDialogComponent, { autoFocus: false });
  }
}
