import { Component, OnInit, inject } from '@angular/core';
import {
  FlEntityPaginatedDatasource,
  FlSavedSearch,
  FlSearchConfig,
  FlSearchState,
  FlThemeService,
} from '@monorepo/front-core-lib';
import { CaFolderDatasource } from '../../../../model/entities/folder/ca-folder.class';
import { CaFolderService } from '../../../../service-api/ca-folder.service';
import { CaFolderSearch, CaFolderSearchFields } from '../../model/ca-folder-search.class';

@Component({
  selector: 'ca-folder-search',
  templateUrl: './ca-folder-search.component.html',
  styleUrls: ['./ca-folder-search.component.scss'],
  providers: [FlSearchState],
  standalone: false,
})
export class CaFolderSearchComponent implements OnInit {
  private searchState = inject<FlSearchState<any>>(FlSearchState);
  private folderService = inject(CaFolderService);
  private themeService = inject(FlThemeService);

  datasource: CaFolderDatasource<CaFolderSearchFields>;

  ngOnInit(): void {
    const config: FlSearchConfig = {
      version: 1,
      buildAdvancedForm: CaFolderSearch.getSearchForm,
      advancedFormClass: CaFolderSearchFields,
      savedSearch: this.getSavedSearch(),
      advancedFormManager: {
        config: CaFolderSearch.searchManagerConfig,
        skipFalseBoolean: true,
      },
      storeSearchInUrl: true,
      defaultSort: { key: 'name', direction: 'ASC' },
    };

    this.datasource = new FlEntityPaginatedDatasource(
      (page, size, data) => this.folderService.searchFoldersInCurrentSpace(page, size, data),
      20,
      { initFirstPage: false }
    );
    this.searchState.init(config, this.datasource);
  }

  private getSavedSearch(): FlSavedSearch[] {
    return [
      {
        searchName: 'ca-folder',
        id: null,
        label: 'All folders',
        color: this.themeService.getCurrentThemeDetail().primary,
        version: 1,
        default: true,
        filtersCriteria: {} as Partial<CaFolderSearchFields>,
      },
    ];
  }
}
