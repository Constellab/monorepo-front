import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { FlEntityPaginatedDatasource } from '@monorepo/front-core-lib/fl-core';
import { FlSavedSearch } from '@monorepo/front-core-lib/fl-search';
import { FlSearchConfig } from '@monorepo/front-core-lib/fl-search';
import { FlSearchFunction } from '@monorepo/front-core-lib/fl-search';
import { FlSearchState } from '@monorepo/front-core-lib/fl-search';
import { FlTableColumnStatic } from '@monorepo/front-core-lib/fl-core';
import { FlThemeService } from '@monorepo/front-core-lib/fl-theme';

import { LabTypeSearch, LabTypeSearchConfig, LabTypeSearchFields } from '../../model/lab-type-search.class';
import { LabTypeEntity, LabTypeEntityDatasource } from '../../../../model/entities/lab-type/lab-type.entity';
import { LabTypeService } from '../../../../entity-service/lab-type.service';
import { TdBrick } from '@monorepo/technical-doc';
import { FlSearchModule } from '@monorepo/front-core-lib/fl-search';
import { LabTypeSearchFormComponent } from '../lab-type-search-form/lab-type-search-form.component';
import { LabProcessTypeTableComponent } from '../lab-process-type-table/lab-process-type-table.component';

@Component({
  selector: 'lab-type-search',
  templateUrl: './lab-type-search.component.html',
  styleUrls: ['./lab-type-search.component.scss'],
  providers: [FlSearchState],
  imports: [FlSearchModule, LabTypeSearchFormComponent, LabProcessTypeTableComponent],
})
export class LabTypeSearchComponent implements OnInit {
  private searchState = inject<FlSearchState<any>>(FlSearchState);
  private typeService = inject(LabTypeService);
  private themeService = inject(FlThemeService);

  @Input() fullPageSearch: boolean = false;

  @Input() config: LabTypeSearchConfig;

  @Output() typeSelected: EventEmitter<LabTypeEntity> = new EventEmitter();

  columns: FlTableColumnStatic<LabTypeEntity>[];
  datasource: LabTypeEntityDatasource;

  ngOnInit(): void {
    // set hidden filters based on config
    let hiddenFilters: Partial<LabTypeSearchFields>;
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
      buildAdvancedForm: LabTypeSearch.getSearchForm,
      advancedFormClass: LabTypeSearchFields,
      savedSearch: this.getSavedSearch(),
      advancedFormManager: {
        config: LabTypeSearch.searchManagerConfig,
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
        searchName: 'lab-type',
        id: null,
        label: 'All',
        color: this.themeService.getCurrentThemeDetail().primary,
        version: 1,
        default: true,
        filtersCriteria: { includeDeprecated: false } as Partial<LabTypeSearchFields>,
      },
      {
        searchName: 'lab-type',
        id: null,
        label: 'Core',
        color: this.themeService.getCurrentThemeDetail().primary,
        version: 1,
        default: false,
        filtersCriteria: {
          brick: [TdBrick.GWS_CORE],
          includeDeprecated: false,
        } as Partial<LabTypeSearchFields>,
      },
    ];
  }

  selectType(type: LabTypeEntity): void {
    this.typeSelected.next(type);
  }
}
