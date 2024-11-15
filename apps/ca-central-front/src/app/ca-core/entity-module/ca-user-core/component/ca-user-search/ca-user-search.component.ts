import { Component, OnInit } from '@angular/core';
import {
  FlConfirmDialogInput,
  FlDialogService,
  FlEntityPaginatedDatasource,
  FlFileHelper,
  FlSavedSearch,
  FlSearchConfig,
  FlSearchState,
  FlTableColumnStatic,
  FlThemeService,
} from '@monorepo/front-core-lib';
import { CaUser, CaUserDatasourcePaginated } from '../../../../model/entities/ca-user.class';
import { CaUsersService } from '../../../../service-api/ca-users.service';
import { CaUserSearch, CaUserSearchFields } from '../../model/ca-user-search.class';

@Component({
  selector: 'ca-user-search',
  templateUrl: './ca-user-search.component.html',
  styleUrls: ['./ca-user-search.component.scss'],
  providers: [FlSearchState],
})
export class CaUserSearchComponent implements OnInit {
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

  constructor(
    private searchState: FlSearchState<any>,
    private userService: CaUsersService,
    private themeService: FlThemeService,
    private dialogService: FlDialogService
  ) {}

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
      successMessage: 'all_user_synchronised',
      observable: this.userService.sendAllUserToQueue(),
    };

    this.dialogService.openConfirmDialog(data);
  }

  private exportSearchSuccess(result: Blob): void {
    FlFileHelper.downloadBlob(result, 'users.csv');
    this.exportIsLoading = false;
  }
}
