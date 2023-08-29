import {Component, Input, OnInit} from '@angular/core';
import {
  FlSavedSearch,
  FlSearchConfig,
  FlSearchState,
  FlTableColumnStatic,
  FlThemeService
} from '@monorepo/front-core-lib';
import {CaActivitySearch, CaActivitySearchFields} from '../../model/ca-activity-search.class';
import {CaActivity, CaActivityDatasource} from '../../../../model/entities/ca-activity.class';

@Component({
  selector: 'ca-activity-search',
  templateUrl: './ca-activity-search.component.html',
  styleUrls: ['./ca-activity-search.component.scss'],
  providers: [FlSearchState]
})
export class CaActivitySearchComponent implements OnInit {

  @Input() datasource: CaActivityDatasource;

  columns: FlTableColumnStatic<CaActivity>[] = ['title', 'entityType', 'entityName', 'creation'];

  constructor(private searchState: FlSearchState<any>,
              private themeService: FlThemeService) {
  }

  ngOnInit(): void {
    const config: FlSearchConfig = {
      version: 1,
      buildAdvancedForm: CaActivitySearch.getAdvancedSearchForm,
      advancedFormClass: CaActivitySearchFields,
      savedSearch: this.getSavedSearch(),
      advancedFormManager: {
        config: CaActivitySearch.advancedSearchManagerConfig,
        skipFalseBoolean: true
      },
      storeSearchInUrl: true
    };

    this.searchState.init(config, this.datasource);
  }

  private getSavedSearch(): FlSavedSearch[] {
    return [{
      searchName: 'ca-activity',
      id: null,
      label: 'All activity',
      color: this.themeService.getCurrentThemeDetail().primary,
      version: 1,
      default: true,
      filtersCriteria: {} as Partial<CaActivitySearchFields>
    }];
  }

}

