import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {
  FlDatasourcePaginated,
  FlPortalAction,
  FlPortalActionsService,
  FlSavedSearch,
  FlSearchConfig,
  FlSearchState,
  FlTableColumnStatic,
  FlThemeService
} from '@monorepo/front-core-lib';
import {LabProtocolTemplate} from '../../../../model/entities/process/lab-protocol-template.entity';
import {LabProtocolTemplateService} from '../../../../entity-service/lab-protocol-template.service';
import {
  LabProtocolTemplateSearch,
  LabProtocolTemplateSearchFields
} from '../../model/lab-protocol-template-search.class';
import {LabRouterService} from '../../../../service/lab-router.service';

@Component({
  selector: 'lab-protocol-template-search',
  templateUrl: './lab-protocol-template-search.component.html',
  styleUrls: ['./lab-protocol-template-search.component.scss'],
  providers: [FlSearchState]
})
export class LabProtocolTemplateSearchComponent implements OnInit {

  @Input() rowSelectable: boolean = false;

  @Output() templateSelected: EventEmitter<LabProtocolTemplate> = new EventEmitter();

  datasource: FlDatasourcePaginated<LabProtocolTemplate>;

  columns: FlTableColumnStatic<LabProtocolTemplate>[] = ['name', 'tags', 'created'];

  constructor(private searchState: FlSearchState<any>,
              private protocolTemplateService: LabProtocolTemplateService,
              private themeService: FlThemeService,
              private actionsService: FlPortalActionsService) {
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

    if (this.rowSelectable) {
      this.columns.push('openInNewTab');
    }
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

  createFromFile(file: File): void {
    const action: FlPortalAction = {
      text: {text: 'biox.import_protocol_template', translateText: true},
      type: 'importProtocolTemplate',
      action: this.protocolTemplateService.createFromFile(file),
      successLink: (result: LabProtocolTemplate) => LabRouterService.getProtocolTemplateDetailRoute(result.id)
    };

    this.actionsService.addAction(action, false);
  }
}


