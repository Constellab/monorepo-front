import { Component, OnInit } from '@angular/core';
import {
  FlEntityPaginatedDatasource,
  FlSavedSearch,
  FlSearchConfig,
  FlSearchState,
  FlThemeService
} from '@monorepo/front-core-lib';
import { CaFolderDatasource } from '../../../../model/entities/folder/ca-folder.class';
import { CaFolderService } from '../../../../service-api/ca-folder.service';
import { CaFolderSearch, CaFolderSearchFields } from '../../model/ca-folder-search.class';

@Component({
  selector: 'ca-folder-search',
  templateUrl: './ca-folder-search.component.html',
  styleUrls: ['./ca-folder-search.component.scss'],
  providers: [FlSearchState]

})
export class CaFolderSearchComponent implements OnInit {

  datasource: CaFolderDatasource;

  constructor(private searchState: FlSearchState<any>,
              private folderService: CaFolderService,
              private themeService: FlThemeService) {
  }

  ngOnInit(): void {
    const config: FlSearchConfig = {
      version: 1,
      buildAdvancedForm: CaFolderSearch.getAdvancedSearchForm,
      advancedFormClass: CaFolderSearchFields,
      savedSearch: this.getSavedSearch(),
      advancedFormManager: {
        config: CaFolderSearch.advancedSearchManagerConfig,
        skipFalseBoolean: true
      },
      storeSearchInUrl: true
    };

    this.datasource = new FlEntityPaginatedDatasource(
      (page, size, filters) => this.folderService.searchFoldersInCurrentSpace(page, size, filters),
      20, false);
    this.searchState.init(config, this.datasource);
  }

  private getSavedSearch(): FlSavedSearch[] {
    return [{
      searchName: 'ca-folder',
      id: null,
      label: 'All folders',
      color: this.themeService.getCurrentThemeDetail().primary,
      version: 1,
      default: true,
      filtersCriteria: {} as Partial<CaFolderSearchFields>
    }];
  }

}
