import { ChangeDetectionStrategy,Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { ClBrick } from '@monorepo/core-lib';
import { FlEntityPaginatedDatasource, FlTableColumnStatic } from '@monorepo/front-core-lib/fl-core';
import {
  FlSavedSearch,
  FlSearchConfig,
  FlSearchFunction,
  FlSearchModule,
  FlSearchState,
} from '@monorepo/front-core-lib/fl-search';
import { FlThemeService } from '@monorepo/front-core-lib/fl-theme';
import {
  LiTypeEntity,
  LiTypeEntityDatasource,
  LiTypeSearch,
  LiTypeSearchConfig,
  LiTypeSearchFields,
  LiTypeService,
} from '@monorepo/lab-lib/li-core';

import { LiProcessTypeTableComponent } from '../li-process-type-table/li-process-type-table.component';
import { LiTypeSearchFormComponent } from '../li-type-search-form/li-type-search-form.component';

@Component({
  selector: 'li-type-search',
  templateUrl: './li-type-search.component.html',
  styleUrls: ['./li-type-search.component.scss'],
  providers: [FlSearchState],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [FlSearchModule, LiTypeSearchFormComponent, LiProcessTypeTableComponent],
})
export class LiTypeSearchComponent implements OnInit {
  private searchState = inject<FlSearchState<any>>(FlSearchState);
  private typeService = inject(LiTypeService);
  private themeService = inject(FlThemeService);

  @Input() fullPageSearch: boolean = false;

  @Input() config: LiTypeSearchConfig;

  @Output() typeSelected: EventEmitter<LiTypeEntity> = new EventEmitter();

  columns: FlTableColumnStatic<LiTypeEntity>[];
  datasource: LiTypeEntityDatasource;

  ngOnInit(): void {
    // set hidden filters based on config
    let hiddenFilters: Partial<LiTypeSearchFields>;
    let searchFunction: FlSearchFunction;

    switch (this.config.mode) {
      case 'process':
        searchFunction = this.typeService.getAdvancedSearchFunction();

        hiddenFilters = { objectType: ['TASK', 'PROTOCOL'] };
        this.columns = ['name', 'description', 'objectSubType', 'detail'];
        break;
      case 'resource':
        searchFunction = this.typeService.getAdvancedSearchFunction();

        hiddenFilters = { objectType: ['RESOURCE'] };
        this.columns = ['name', 'description', 'objectSubType', 'detail'];
        break;
      case 'transformer':
        searchFunction = this.typeService.getTransformerAdvancedSearchFunction(
          this.config.resourceTypingNames
        );

        // don't set the objectSubType because it is always transformers
        this.columns = ['name', 'description', 'detail'];
        break;
      case 'importer':
        searchFunction = this.typeService.getImporterAdvancedSearchFunction(
          this.config.resourceTypingName,
          this.config.extension
        );

        // don't set the objectSubType because it is always importers
        this.columns = ['name', 'description', 'detail'];
        break;
      case 'processSuggestion':
        searchFunction = this.typeService.getProcessSuggestion(
          this.config.resourceTypingNames,
          this.config.suggestBy
        );
        hiddenFilters = { objectType: ['TASK', 'PROTOCOL'] };
        this.columns = ['name', 'description', 'objectSubType', 'detail'];
    }

    this.searchState.setHiddenFilters(hiddenFilters);

    const config: FlSearchConfig = {
      version: 1,
      buildAdvancedForm: LiTypeSearch.getSearchForm,
      advancedFormClass: LiTypeSearchFields,
      savedSearch: this.getSavedSearch(),
      advancedFormManager: {
        config: LiTypeSearch.searchManagerConfig,
        skipFalseBoolean: true,
      },
      storeSearchInUrl: this.fullPageSearch,
      defaultSort: { key: 'name', direction: 'ASC' },
    };

    this.datasource = new FlEntityPaginatedDatasource(searchFunction, 20, { initFirstPage: false });
    this.searchState.init(config, this.datasource);
  }

  private getSavedSearch(): FlSavedSearch[] {
    // list of predefined search of the resources
    return [
      {
        searchName: 'li-type',
        id: null,
        label: 'All',
        color: this.themeService.getCurrentThemeDetail().primary,
        version: 1,
        default: true,
        filtersCriteria: { includeDeprecated: false } as Partial<LiTypeSearchFields>,
      },
      {
        searchName: 'li-type',
        id: null,
        label: 'Core',
        color: this.themeService.getCurrentThemeDetail().primary,
        version: 1,
        default: false,
        filtersCriteria: {
          brick: [ClBrick.GWS_CORE],
          includeDeprecated: false,
        } as Partial<LiTypeSearchFields>,
      },
    ];
  }

  selectType(type: LiTypeEntity): void {
    this.typeSelected.next(type);
  }
}
