import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FlPortalAction,
  FlPortalActionsService,
  FlSavedSearch,
  FlSearchConfig,
  FlSearchState,
  FlTableColumnStatic,
  FlThemeService,
} from '@monorepo/front-core-lib';
import {
  LabScenarioTemplate,
  LabScenarioTemplateDatasource,
} from '../../../../model/entities/process/lab-scenario-template.entity';
import { LabScenarioTemplateService } from '../../../../entity-service/lab-scenario-template.service';
import {
  LabScenarioTemplateSearch,
  LabScenarioTemplateSearchFields,
} from '../../model/lab-scenario-template-search.class';
import { LabRouterService } from '../../../../service/lab-router.service';

@Component({
  selector: 'lab-scenario-template-search',
  templateUrl: './lab-scenario-template-search.component.html',
  styleUrls: ['./lab-scenario-template-search.component.scss'],
  providers: [FlSearchState],
})
export class LabScenarioTemplateSearchComponent implements OnInit {
  @Input() rowSelectable: boolean = false;

  @Output() templateSelected: EventEmitter<LabScenarioTemplate> = new EventEmitter();

  datasource: LabScenarioTemplateDatasource<LabScenarioTemplateSearchFields>;

  columns: FlTableColumnStatic<LabScenarioTemplate>[] = ['name', 'tags', 'created'];

  constructor(
    private searchState: FlSearchState<any>,
    private scenarioTemplateService: LabScenarioTemplateService,
    private themeService: FlThemeService,
    private actionsService: FlPortalActionsService
  ) {}

  ngOnInit(): void {
    const config: FlSearchConfig = {
      version: 1,
      buildAdvancedForm: LabScenarioTemplateSearch.getSearchForm,
      advancedFormClass: LabScenarioTemplateSearchFields,
      savedSearch: this.getSavedSearch(),
      advancedFormManager: {
        config: LabScenarioTemplateSearch.searchManagerConfig,
        skipFalseBoolean: true,
      },
      storeSearchInUrl: false,
      defaultSort: { key: 'lastModification', direction: 'DESC' },
    };

    this.datasource = this.scenarioTemplateService.getSearchDatasource();
    this.searchState.init(config, this.datasource);

    if (this.rowSelectable) {
      this.columns.push('openInNewTab');
    }
  }

  private getSavedSearch(): FlSavedSearch[] {
    // list of predefined search of the resources
    return [
      {
        searchName: 'lab-scenario-template',
        id: null,
        label: 'All template',
        color: this.themeService.getCurrentThemeDetail().primary,
        version: 1,
        default: true,
        filtersCriteria: {},
      },
    ];
  }

  selectTemplate(template: LabScenarioTemplate): void {
    this.templateSelected.next(template);
  }

  createFromFile(file: File): void {
    const action: FlPortalAction = {
      text: { text: 'biox.import_scenario_template', translateText: true },
      type: 'importScenarioTemplate',
      action: this.scenarioTemplateService.createFromFile(file),
      successLink: (result: LabScenarioTemplate) =>
        LabRouterService.getScenarioTemplateDetailRoute(result.id),
    };

    this.actionsService.addAction(action, false);
  }
}
