import {Component, OnInit} from '@angular/core';
import {
  FlDialogService,
  FlEntityPaginatedDatasource,
  FlFormDialogInput,
  FlSavedSearch,
  FlSearchConfig,
  FlSearchState,
  FlThemeService
} from '@monorepo/front-core-lib';
import {CaServerInfo, CaServerInfoDatasource} from '../../../../model/entities/ca-server-info.class';
import {CaServerInfoService} from '../../../../service-api/ca-server-info.service';
import {CaServerInfoFormDialogComponent} from '../ca-server-info-form-dialog/ca-server-info-form-dialog.component';
import {CaServerInfoSearch, CaServerInfoSearchFields} from '../../model/ca-server-info-search.class';

@Component({
  selector: 'ca-server-info-search',
  templateUrl: './ca-server-info-search.component.html',
  styleUrls: ['./ca-server-info-search.component.scss'],
  providers: [FlSearchState]
})
export class CaServerInfoSearchComponent implements OnInit {

  datasource: CaServerInfoDatasource;

  constructor(private searchState: FlSearchState<any>,
              private serverInfoService: CaServerInfoService,
              private themeService: FlThemeService,
              private dialogService: FlDialogService) {
  }

  ngOnInit(): void {
    const config: FlSearchConfig = {
      version: 1,
      buildAdvancedForm: CaServerInfoSearch.getAdvancedSearchForm,
      advancedFormClass: CaServerInfoSearchFields,
      savedSearch: this.getSavedSearch(),
      advancedFormManager: {
        config: CaServerInfoSearch.advancedSearchManagerConfig,
        skipFalseBoolean: true
      },
      storeSearchInUrl: true
    };

    this.datasource = new FlEntityPaginatedDatasource(
      (page, size, filters) => this.serverInfoService.search(page, size, filters),
      20, false);
    this.searchState.init(config, this.datasource);
  }

  private getSavedSearch(): FlSavedSearch[] {
    return [{
      searchName: 'ca-server-info',
      id: null,
      label: 'All server',
      color: this.themeService.getCurrentThemeDetail().primary,
      version: 1,
      default: true,
      filtersCriteria: {} as Partial<CaServerInfoSearchFields>
    }];
  }

  openCreateServerInfo(): void {
    const dialogInput: FlFormDialogInput = {
      mode: 'create'
    };

    this.dialogService.openSmallDialog(CaServerInfoFormDialogComponent, {data: dialogInput}).afterClosed()
      .subscribe(
        serverInfo => this.onCreateServerInfo(serverInfo)
      );
  }

  private onCreateServerInfo(serverInfo?: CaServerInfo): void {
    if (serverInfo) {
      this.datasource.unshiftItem(serverInfo);
    }
  }
}

