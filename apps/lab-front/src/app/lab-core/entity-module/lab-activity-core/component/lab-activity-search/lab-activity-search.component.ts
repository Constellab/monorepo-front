import {Component, OnInit} from '@angular/core';
import {
  FlEntityPaginatedDatasource,
  FlSavedSearch,
  FlSearchConfig,
  FlSearchState,
  FlTableColumnStatic,
  FlThemeService
} from '@monorepo/front-core-lib';
import {LabActivity, LabActivityDatasource} from '../../../../model/entities/lab-activity.entity';
import {LabActivityService} from '../../../../entity-service/lab-activity.service';
import {LabActivitySearch, LabActivitySearchFields} from '../../model/lab-activity-search.class';

@Component({
  selector: 'lab-activity-search',
  templateUrl: './lab-activity-search.component.html',
  styleUrls: ['./lab-activity-search.component.scss'],
  providers: [FlSearchState]
})
export class LabActivitySearchComponent implements OnInit {
  datasource: LabActivityDatasource;

  columns: FlTableColumnStatic<LabActivity>[] = ['user', 'activityType', 'objectType', 'createdAt', 'objectId', 'link'];

  constructor(private searchState: FlSearchState<any>,
              private activityService: LabActivityService,
              private themeService: FlThemeService) {
  }

  ngOnInit(): void {
    const config: FlSearchConfig = {
      version: 1,
      buildAdvancedForm: LabActivitySearch.getAdvancedSearchForm,
      advancedFormClass: LabActivitySearchFields,
      savedSearch: this.getSavedSearch(),
      advancedFormManager: {
        config: LabActivitySearch.advancedSearchManagerConfig,
        skipFalseBoolean: true
      },
      storeSearchInUrl: true
    };

    this.datasource = new FlEntityPaginatedDatasource(
      (page: number, pageSize: number, data) => this.activityService.search(page, pageSize, data),
      20, true
    );
    this.searchState.init(config, this.datasource);
  }

  private getSavedSearch(): FlSavedSearch[] {
    // list of predefined search of the resources
    return [{
      searchName: 'lab-activity',
      id: null,
      label: 'All activities',
      color: this.themeService.getCurrentThemeDetail().primary,
      version: 1,
      default: true,
      filtersCriteria: {}
    }];
  }
}
