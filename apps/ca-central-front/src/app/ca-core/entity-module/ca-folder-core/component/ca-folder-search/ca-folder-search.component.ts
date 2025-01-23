import { Component, inject, OnInit } from '@angular/core';
import { FlEntityPaginatedDatasource } from '@monorepo/front-core-lib/fl-core';
import {
  FlSavedSearch,
  FlSearchConfig,
  FlSearchModule,
  FlSearchState,
} from '@monorepo/front-core-lib/fl-search';
import { FlThemeService } from '@monorepo/front-core-lib/fl-theme';

import { CaFolderDatasource } from '../../../../model/entities/folder/ca-folder.class';
import { CaFolderService } from '../../../../service-api/ca-folder.service';
import { CaFolderSearch, CaFolderSearchFields } from '../../model/ca-folder-search.class';
import { FlCardModule } from '@monorepo/front-core-lib/fl-card';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { MatIcon } from '@angular/material/icon';
import { FlIconModule } from '@monorepo/front-core-lib/fl-svg-icon';
import { CaFolderSearchFormComponent } from '../ca-folder-search-form/ca-folder-search-form.component';
import { CaFolderTableComponent } from '../ca-folder-table/ca-folder-table.component';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'ca-folder-search',
  templateUrl: './ca-folder-search.component.html',
  styleUrls: ['./ca-folder-search.component.scss'],
  providers: [FlSearchState],
  imports: [
    FlCardModule,
    FlSearchModule,
    FlTextIconModule,
    MatIcon,
    FlIconModule,
    CaFolderSearchFormComponent,
    CaFolderTableComponent,
    TranslatePipe,
  ],
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
