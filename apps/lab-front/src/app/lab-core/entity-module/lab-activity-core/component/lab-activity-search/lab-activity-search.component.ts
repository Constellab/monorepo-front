import { Component, inject, OnInit } from '@angular/core';
import { FlEntityPaginatedDatasource } from '@monorepo/front-core-lib/fl-core';
import {
  FlSavedSearch,
  FlSearchConfig,
  FlSearchModule,
  FlSearchState,
} from '@monorepo/front-core-lib/fl-search';
import { FlThemeService } from '@monorepo/front-core-lib/fl-theme';

import { LabActivityDatasource } from '../../../../model/entities/lab-activity.entity';
import { LabActivityService } from '../../../../entity-service/lab-activity.service';
import { LabActivitySearch, LabActivitySearchFields } from '../../model/lab-activity-search.class';
import { LabActivitySearchFormComponent } from '../lab-activity-search-form/lab-activity-search-form.component';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { MatIcon } from '@angular/material/icon';
import { FlIconModule } from '@monorepo/front-core-lib/fl-svg-icon';
import { LabActivityTableComponent } from '../lab-activity-table/lab-activity-table.component';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'lab-activity-search',
  templateUrl: './lab-activity-search.component.html',
  styleUrls: ['./lab-activity-search.component.scss'],
  providers: [FlSearchState],
  imports: [
    FlSearchModule,
    LabActivitySearchFormComponent,
    FlTextIconModule,
    MatIcon,
    FlIconModule,
    LabActivityTableComponent,
    TranslatePipe,
  ],
})
export class LabActivitySearchComponent implements OnInit {
  private searchState = inject<FlSearchState<any>>(FlSearchState);
  private activityService = inject(LabActivityService);
  private themeService = inject(FlThemeService);

  datasource: LabActivityDatasource<LabActivitySearchFields>;

  ngOnInit(): void {
    const config: FlSearchConfig = {
      version: 1,
      buildAdvancedForm: LabActivitySearch.getSearchForm,
      advancedFormClass: LabActivitySearchFields,
      savedSearch: this.getSavedSearch(),
      advancedFormManager: {
        config: LabActivitySearch.searchManagerConfig,
        skipFalseBoolean: true,
      },
      storeSearchInUrl: true,
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
        searchName: 'lab-activity',
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
