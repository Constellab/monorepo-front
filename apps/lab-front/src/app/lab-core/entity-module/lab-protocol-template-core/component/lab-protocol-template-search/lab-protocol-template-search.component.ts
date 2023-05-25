import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {
  FlDatasourcePaginated,
  FlDialogService,
  FlSavedSearch,
  FlSearchConfig,
  FlSearchState,
  FlTableColumnStatic,
  FlThemeService
} from '@monorepo/front-core-lib';
import {LabProtocolTemplate} from '../../../../model/entities/process/lab-protocol-template.entity';
import {LabRouterService} from '../../../../service/lab-router.service';
import {LabProtocolTemplateService} from '../../../../entity-service/lab-protocol-template.service';
import {
  LabProtocolTemplateSearch,
  LabProtocolTemplateSearchFields
} from '../../model/lab-protocol-template-search.class';

@Component({
  selector: 'lab-protocol-template-search',
  templateUrl: './lab-protocol-template-search.component.html',
  styleUrls: ['./lab-protocol-template-search.component.scss'],
  providers: [FlSearchState]
})
export class LabProtocolTemplateSearchComponent implements OnInit {

  @Output() templateSelected: EventEmitter<LabProtocolTemplate> = new EventEmitter();

  datasource: FlDatasourcePaginated<LabProtocolTemplate>;

  columns: FlTableColumnStatic<LabProtocolTemplate>[] = ['name', 'tags', 'created'];

  constructor(private searchState: FlSearchState<any>,
              private protocolTemplateService: LabProtocolTemplateService,
              private dialogService: FlDialogService,
              private routerService: LabRouterService,
              private themeService: FlThemeService) {
  }

  ngOnInit(): void {
    const config: FlSearchConfig = {
      version: 1,
      buildAdvancedForm: LabProtocolTemplateSearch.getAdvancedSearchForm,
      advancedFormClass: LabProtocolTemplateSearchFields,
      savedSearch: this.getSavedSearch(),
      advancedFormManager: {
        config: LabProtocolTemplateSearch.advancedSearchManagerConfig,
        skipFalseBoolean: true
      },
      storeSearchInUrl: false
    };

    this.datasource = this.protocolTemplateService.getSearchDatasource();
    this.searchState.init(config, this.datasource);
  }

  private getSavedSearch(): FlSavedSearch[] {
    // list of predefined search of the resources
    return [{
      searchName: 'lab-protocol-template',
      id: null,
      label: 'All template',
      color: this.themeService.getCurrentThemeDetail().primary,
      version: 1,
      default: true,
      filtersCriteria: {}
    }];
  }

  selectTemplate(template: LabProtocolTemplate): void {
    this.templateSelected.next(template);
  }
}


