import { Component, inject,OnInit } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { FlEntityPaginatedDatasource } from '@monorepo/front-core-lib/fl-core';
import {
  FlSavedSearch,
  FlSearchConfig,
  FlSearchModule,
  FlSearchState,
} from '@monorepo/front-core-lib/fl-search';
import { FlIconModule } from '@monorepo/front-core-lib/fl-svg-icon';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { FlThemeService } from '@monorepo/front-core-lib/fl-theme';
import { LiActivityDatasource } from '@monorepo/lab-lib/li-core';
import { TranslatePipe } from '@ngx-translate/core';

import { LiActivitySearch, LiActivitySearchFields } from '../../model/li-activity-search.class';
import { LiActivityService } from '../../service/li-activity.service';
import { LiActivitySearchFormComponent } from '../li-activity-search-form/li-activity-search-form.component';
import { LiActivityTableComponent } from '../li-activity-table/li-activity-table.component';

@Component({
  selector: 'li-activity-search',
  templateUrl: './li-activity-search.component.html',
  styleUrls: ['./li-activity-search.component.scss'],
  providers: [FlSearchState],
  imports: [
    FlSearchModule,
    LiActivitySearchFormComponent,
    FlTextIconModule,
    MatIcon,
    FlIconModule,
    LiActivityTableComponent,
    TranslatePipe,
  ],
})
export class LiActivitySearchComponent implements OnInit {
  private searchState = inject<FlSearchState<any>>(FlSearchState);
  private activityService = inject(LiActivityService);
  private themeService = inject(FlThemeService);

  datasource: LiActivityDatasource<LiActivitySearchFields>;

  ngOnInit(): void {
    const config: FlSearchConfig = {
      version: 1,
      buildAdvancedForm: LiActivitySearch.getSearchForm,
      advancedFormClass: LiActivitySearchFields,
      savedSearch: this.getSavedSearch(),
      advancedFormManager: {
        config: LiActivitySearch.searchManagerConfig,
        skipFalseBoolean: true,
      },
      storeSearchInUrl: false,
      defaultSort: { key: 'date', direction: 'DESC' },
    };

    this.datasource = new FlEntityPaginatedDatasource(
      (page: number, pageSize: number, data) => this.activityService.search(page, pageSize, data),
      20,
      { initFirstPage: false }
    );
    this.searchState.init(config, this.datasource);
  }

  private getSavedSearch(): FlSavedSearch[] {
    // list of predefined search of the resources
    return [
      {
        searchName: 'li-activity',
        id: null,
        label: 'All activities',
        color: this.themeService.getCurrentThemeDetail().primary,
        version: 1,
        default: true,
        filtersCriteria: {},
      },
    ];
  }
}
