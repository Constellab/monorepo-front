import { ChangeDetectionStrategy,Component, inject, OnInit } from '@angular/core';
import { FlEntityPaginatedDatasource } from '@monorepo/front-core-lib/fl-core';
import { FlSavedSearch, FlSearchConfig, FlSearchState } from '@monorepo/front-core-lib/fl-search';
import { FlThemeService } from '@monorepo/front-core-lib/fl-theme';

import { MaMailService } from '../../ma-mail.service';
import { MaMailDatasource } from '../../models/ma-mail.entity';
import { MaMailSearch, MaMailSearchFields } from '../../models/ma-mail-search.class';

@Component({
  selector: 'ma-mail-search',
  templateUrl: './ma-mail-search.component.html',
  styleUrl: './ma-mail-search.component.scss',
  providers: [FlSearchState],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class MaMailSearchComponent implements OnInit {
  private searchState = inject<FlSearchState<any>>(FlSearchState);
  private mailService = inject(MaMailService);
  private themeService = inject(FlThemeService);

  datasource: MaMailDatasource<MaMailSearchFields>;

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
