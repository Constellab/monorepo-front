import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FlDialogService,
  FlEntityPaginatedDatasource,
  FlFormDialogInput,
  FlSavedSearch,
  FlSearchConfig,
  FlSearchState,
  FlThemeService,
} from '@monorepo/front-core-lib';
import {
  CaServerCloud,
  CaServerCloudDatasource,
} from '../../../../model/entities/server/ca-server-cloud.class';
import { CaServerService } from '../../../../service-api/ca-server.service';
import { CaServerCloudFormDialogComponent } from '../ca-server-cloud-form-dialog/ca-server-cloud-form-dialog.component';
import { CaServerCloudSearch, CaServerCloudSearchFields } from '../../model/ca-server-cloud-search.class';

@Component({
  selector: 'ca-server-cloud-search',
  templateUrl: './ca-server-cloud-search.component.html',
  styleUrls: ['./ca-server-cloud-search.component.scss'],
  providers: [FlSearchState],
})
export class CaServerCloudSearchComponent implements OnInit {
  @Input() mode: 'search' | 'selection' = 'search';

  @Output() serverCloudSelected: EventEmitter<CaServerCloud> = new EventEmitter();

  datasource: CaServerCloudDatasource<CaServerCloudSearchFields>;

  constructor(
    private searchState: FlSearchState<any>,
    private serverService: CaServerService,
    private themeService: FlThemeService,
    private dialogService: FlDialogService
  ) {}

  ngOnInit(): void {
    const config: FlSearchConfig = {
      version: 1,
      buildAdvancedForm: CaServerCloudSearch.getSearchForm,
      advancedFormClass: CaServerCloudSearchFields,
      savedSearch: this.getSavedSearch(),
      advancedFormManager: {
        config: CaServerCloudSearch.searchManagerConfig,
        skipFalseBoolean: true,
      },
      storeSearchInUrl: this.mode === 'search',
      defaultSort: { key: 'technicalName', direction: 'ASC' },
    };

    this.datasource = new FlEntityPaginatedDatasource(
      (page, size, filters) => this.serverService.searchServerCloud(page, size, filters),
      20,
      { initFirstPage: false }
    );
    this.searchState.init(config, this.datasource);
  }

  private getSavedSearch(): FlSavedSearch[] {
    return [
      {
        searchName: 'ca-server-info',
        id: null,
        label: 'All server',
        color: this.themeService.getCurrentThemeDetail().primary,
        version: 1,
        default: true,
        filtersCriteria: {} as Partial<CaServerCloudSearchFields>,
      },
    ];
  }

  openCreateServerCloud(): void {
    const dialogInput: FlFormDialogInput = {
      mode: 'create',
    };

    this.dialogService
      .openSmallDialog(CaServerCloudFormDialogComponent, { data: dialogInput })
      .afterClosed()
      .subscribe((serverCloud) => this.onCreateServerCloud(serverCloud));
  }

  private onCreateServerCloud(serverCloud?: CaServerCloud): void {
    if (serverCloud) {
      this.datasource.unshiftItem(serverCloud);
    }
  }

  selectServerCloud(serverCloud: CaServerCloud): void {
    this.serverCloudSelected.emit(serverCloud);
  }
}
