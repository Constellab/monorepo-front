import { Component, inject, OnInit } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { FlCardModule } from '@monorepo/front-core-lib/fl-card';
import { FlEntityPaginatedDatasource, FlTableColumnStatic } from '@monorepo/front-core-lib/fl-core';
import { FlConfirmDialogInput, FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import { FlLoaderModule } from '@monorepo/front-core-lib/fl-loader';
import {
  FlSavedSearch,
  FlSearchConfig,
  FlSearchModule,
  FlSearchState,
} from '@monorepo/front-core-lib/fl-search';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { FlThemeService } from '@monorepo/front-core-lib/fl-theme';
import { FlFileHelper } from '@monorepo/front-core-lib/fl-translate';
import { TranslatePipe } from '@ngx-translate/core';

import { CaUser, CaUserDatasourcePaginated } from '../../../../model/entities/ca-user.class';
import { CaIsAdminDirective } from '../../../../module/ca-core-directive/ca-is-admin/ca-is-admin.directive';
import { CaUsersService } from '../../../../service-api/ca-users.service';
import { CaUserSearch, CaUserSearchFields } from '../../model/ca-user-search.class';
import { CaUserSearchFormComponent } from '../ca-user-search-form/ca-user-search-form.component';
import { CaUserTableComponent } from '../ca-user-table/ca-user-table.component';

@Component({
  selector: 'ca-user-search',
  templateUrl: './ca-user-search.component.html',
  styleUrls: ['./ca-user-search.component.scss'],
  providers: [FlSearchState],
  imports: [
    FlCardModule,
    FlSearchModule,
    FlTextIconModule,
    MatIcon,
    MatIconButton,
    MatTooltip,
    FlLoaderModule,
    CaIsAdminDirective,
    CaUserSearchFormComponent,
    CaUserTableComponent,
    TranslatePipe,
  ],
})
export class CaUserSearchComponent implements OnInit {
  private searchState = inject<FlSearchState<any>>(FlSearchState);
  private userService = inject(CaUsersService);
  private themeService = inject(FlThemeService);
  private dialogService = inject(FlDialogService);

  datasource: CaUserDatasourcePaginated<CaUserSearchFields>;

  columns: FlTableColumnStatic<CaUser>[] = [
    'alias',
    'contact',
    'category',
    'lastLogin',
    'createdAt',
    'adminActions',
  ];

  exportIsLoading: boolean = false;

  ngOnInit(): void {
    const config: FlSearchConfig = {
      version: 1,
      buildAdvancedForm: CaUserSearch.getSearchForm,
      advancedFormClass: CaUserSearchFields,
      savedSearch: this.getSavedSearch(),
      advancedFormManager: {
        config: CaUserSearch.searchManagerConfig,
      },
      storeSearchInUrl: true,
      defaultSort: { key: 'createdAt', direction: 'DESC' },
    };

    this.datasource = new FlEntityPaginatedDatasource(
      (page, size, filters) => this.userService.search(page, size, filters),
      20,
      { initFirstPage: false }
    );

    this.searchState.init(config, this.datasource);
  }

  private getSavedSearch(): FlSavedSearch[] {
    return [
      {
        searchName: 'ca-user',
        id: null,
        label: 'All users',
        color: this.themeService.getCurrentThemeDetail().primary,
        version: 1,
        default: true,
        filtersCriteria: {} as Partial<CaUserSearchFields>,
      },
    ];
  }

  exportSearch(): void {
    this.exportIsLoading = true;
    this.userService.exportSearch(this.searchState.getFiltersCriteria()).subscribe({
      next: (blob) => this.exportSearchSuccess(blob),
      error: () => (this.exportIsLoading = false),
    });
  }

  syncAllUserWithCommunity(): void {
    const data: FlConfirmDialogInput = {
      title: 'synchronise_user_with_community',
      content: 'synchronise_user_with_community_confirmation',
      successMessage: 'synchronise_user_with_community_started',
      observable: this.userService.sendAllUserToQueue(),
    };

    this.dialogService.openConfirmDialog(data);
  }

  private exportSearchSuccess(result: Blob): void {
    FlFileHelper.downloadBlob(result, 'users.csv');
    this.exportIsLoading = false;
  }
}
