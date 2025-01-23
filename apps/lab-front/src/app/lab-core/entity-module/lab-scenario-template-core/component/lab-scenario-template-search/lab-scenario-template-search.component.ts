import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FlPortalAction, FlPortalActionsService } from '@monorepo/front-core-lib/fl-portal-actions';
import {
  FlSavedSearch,
  FlSearchConfig,
  FlSearchModule,
  FlSearchState,
} from '@monorepo/front-core-lib/fl-search';
import { FlTableColumnStatic } from '@monorepo/front-core-lib/fl-core';
import { FlThemeService } from '@monorepo/front-core-lib/fl-theme';

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
import { LabScenarioTemplateSearchFormComponent } from '../lab-scenario-template-search-form/lab-scenario-template-search-form.component';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { MatIcon } from '@angular/material/icon';
import { FlIconModule } from '@monorepo/front-core-lib/fl-svg-icon';
import { FlInputFileModule } from '@monorepo/front-core-lib/fl-input-file';
import { MatTooltip } from '@angular/material/tooltip';
import { LabScenarioTemplateTableComponent } from '../lab-scenario-template-table/lab-scenario-template-table.component';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'lab-scenario-template-search',
  templateUrl: './lab-scenario-template-search.component.html',
  styleUrls: ['./lab-scenario-template-search.component.scss'],
  providers: [FlSearchState],
  imports: [
    FlSearchModule,
    LabScenarioTemplateSearchFormComponent,
    FlTextIconModule,
    MatIcon,
    FlIconModule,
    FlInputFileModule,
    MatTooltip,
    LabScenarioTemplateTableComponent,
    TranslatePipe,
  ],
})
export class LabScenarioTemplateSearchComponent implements OnInit {
  private searchState = inject<FlSearchState<any>>(FlSearchState);
  private scenarioTemplateService = inject(LabScenarioTemplateService);
  private themeService = inject(FlThemeService);
  private actionsService = inject(FlPortalActionsService);

  @Input() rowSelectable: boolean = false;

  @Output() templateSelected: EventEmitter<LabScenarioTemplate> = new EventEmitter();

  datasource: LabScenarioTemplateDatasource<LabScenarioTemplateSearchFields>;

  columns: FlTableColumnStatic<LabScenarioTemplate>[] = ['name', 'tags', 'created'];

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
