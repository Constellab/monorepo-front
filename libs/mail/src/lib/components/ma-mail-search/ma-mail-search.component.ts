import { Component, OnInit } from '@angular/core';
import {
  FlEntityPaginatedDatasource,
  FlSavedSearch,
  FlSearchConfig,
  FlSearchState,
  FlThemeService,
} from '@monorepo/front-core-lib';
import { MaMailDatasource } from '../../models/ma-mail.entity';
import { MaMailSearch, MaMailSearchFields } from '../../models/ma-mail-search.class';
import { MaMailService } from '../../ma-mail.service';

@Component({
    selector: 'ma-mail-search',
    templateUrl: './ma-mail-search.component.html',
    styleUrl: './ma-mail-search.component.scss',
    providers: [FlSearchState],
    standalone: false
})
export class MaMailSearchComponent implements OnInit {
  datasource: MaMailDatasource<MaMailSearchFields>;

  constructor(
    private searchState: FlSearchState<any>,
    private mailService: MaMailService,
    private themeService: FlThemeService
  ) {}

  ngOnInit(): void {
    const config: FlSearchConfig = {
      version: 1,
      buildAdvancedForm: MaMailSearch.getSearchForm,
      advancedFormClass: MaMailSearchFields,
      savedSearch: this.getSavedSearch(),
      advancedFormManager: {
        config: MaMailSearch.searchManagerConfig,
        skipFalseBoolean: true,
      },
      storeSearchInUrl: true,
      defaultSort: { key: 'lastModifiedAt', direction: 'DESC' },
    };

    this.datasource = new FlEntityPaginatedDatasource(
      (page, size, data) => this.mailService.search(page, size, data),
      20,
      { initFirstPage: false }
    );
    this.searchState.init(config, this.datasource);
  }

  private getSavedSearch(): FlSavedSearch[] {
    return [
      {
        searchName: 'ma-mail',
        id: null,
        label: 'All mails',
        color: this.themeService.getCurrentThemeDetail().primary,
        version: 1,
        default: true,
        filtersCriteria: {} as Partial<MaMailSearchFields>,
      },
    ];
  }
}
