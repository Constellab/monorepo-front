import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { FlIconModule } from '@monorepo/front-core-lib/fl-svg-icon';
import { FlInputFileModule } from '@monorepo/front-core-lib/fl-input-file';
import { FlPortalAction, FlPortalActionsService } from '@monorepo/front-core-lib/fl-portal-actions';
import {
  FlSavedSearch,
  FlSearchConfig,
  FlSearchModule,
  FlSearchState,
} from '@monorepo/front-core-lib/fl-search';
import { FlTableColumnStatic } from '@monorepo/front-core-lib/fl-core';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { FlThemeService } from '@monorepo/front-core-lib/fl-theme';
import {
  LiRouterService,
  LiScenarioTemplate,
  LiScenarioTemplateDatasource,
  LiScenarioTemplateSearch,
  LiScenarioTemplateSearchFields,
  LiScenarioTemplateService,
} from '@monorepo/lab-lib/li-core';
import { LiScenarioTemplateSearchFormComponent } from '../li-scenario-template-search-form/li-scenario-template-search-form.component';
import { LiScenarioTemplateTableComponent } from '../li-scenario-template-table/li-scenario-template-table.component';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'li-scenario-template-search',
  templateUrl: './li-scenario-template-search.component.html',
  styleUrls: ['./li-scenario-template-search.component.scss'],
  providers: [FlSearchState],
  imports: [
    FlSearchModule,
    LiScenarioTemplateSearchFormComponent,
    FlTextIconModule,
    MatIcon,
    FlIconModule,
    FlInputFileModule,
    MatTooltip,
    LiScenarioTemplateTableComponent,
    TranslatePipe,
  ],
})
export class LiScenarioTemplateSearchComponent implements OnInit {
  private searchState = inject<FlSearchState<any>>(FlSearchState);
  private scenarioTemplateService = inject(LiScenarioTemplateService);
  private themeService = inject(FlThemeService);
  private actionsService = inject(FlPortalActionsService);

  @Input() rowSelectable: boolean = false;

  @Output() templateSelected: EventEmitter<LiScenarioTemplate> = new EventEmitter();

  datasource: LiScenarioTemplateDatasource<LiScenarioTemplateSearchFields>;

  columns: FlTableColumnStatic<LiScenarioTemplate>[] = ['name', 'tags', 'created'];

  ngOnInit(): void {
    const config: FlSearchConfig = {
      version: 1,
      buildAdvancedForm: LiScenarioTemplateSearch.getSearchForm,
      advancedFormClass: LiScenarioTemplateSearchFields,
      savedSearch: this.getSavedSearch(),
      advancedFormManager: {
        config: LiScenarioTemplateSearch.searchManagerConfig,
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
        searchName: 'li-scenario-template',
        id: null,
        label: 'All template',
        color: this.themeService.getCurrentThemeDetail().primary,
        version: 1,
        default: true,
        filtersCriteria: {},
      },
    ];
  }

  selectTemplate(template: LiScenarioTemplate): void {
    this.templateSelected.next(template);
  }

  createFromFile(file: File): void {
    const action: FlPortalAction = {
      text: { text: 'li.import_scenario_template', translateText: true },
      type: 'importScenarioTemplate',
      action: this.scenarioTemplateService.createFromFile(file),
      successLink: (result: LiScenarioTemplate) => LiRouterService.getScenarioTemplateDetailRoute(result.id),
    };

    this.actionsService.addAction(action, false);
  }
}
