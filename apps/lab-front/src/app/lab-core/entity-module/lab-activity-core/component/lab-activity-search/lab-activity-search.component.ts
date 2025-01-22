import { Component, OnInit, inject } from '@angular/core';
import {
  FlEntityPaginatedDatasource,
  FlSavedSearch,
  FlSearchConfig,
  FlSearchState,
  FlThemeService,
} from '@monorepo/front-core-lib';
import { LabActivityDatasource } from '../../../../model/entities/lab-activity.entity';
import { LabActivityService } from '../../../../entity-service/lab-activity.service';
import { LabActivitySearch, LabActivitySearchFields } from '../../model/lab-activity-search.class';

@Component({
  selector: 'lab-activity-search',
  templateUrl: './lab-activity-search.component.html',
  styleUrls: ['./lab-activity-search.component.scss'],
  providers: [FlSearchState],
  standalone: false,
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
      20
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
