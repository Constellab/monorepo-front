import { Component, EventEmitter, inject,Input, OnInit, Output } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { FlFormDialogInput, FlTableColumnStatic } from '@monorepo/front-core-lib/fl-core';
import { FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import { FlPortalActionsService } from '@monorepo/front-core-lib/fl-portal-actions';
import {
  FlSavedSearch,
  FlSearchConfig,
  FlSearchModule,
  FlSearchState,
} from '@monorepo/front-core-lib/fl-search';
import { FlSnackBarService } from '@monorepo/front-core-lib/fl-snack-bar';
import { FlIconModule } from '@monorepo/front-core-lib/fl-svg-icon';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { FlThemeService } from '@monorepo/front-core-lib/fl-theme';
import {
  LiRouterService,
  LiScenario,
  LiScenarioDatasource,
  LiScenarioSearch,
  LiScenarioSearchFields,
  LiScenarioService,
} from '@monorepo/lab-lib/li-core';
import {
  LiQuickConfigureProcessDialogComponent,
  LiQuickConfigureProcessDialogInput,
} from '@monorepo/lab-lib/li-process';
import { TdParamSpecsValues } from '@monorepo/technical-doc';
import { TranslatePipe } from '@ngx-translate/core';

import { LiScenarioFormDialogComponent } from '../li-scenario-form-dialog/li-scenario-form-dialog.component';
import { LiScenarioSearchFormComponent } from '../li-scenario-search-form/li-scenario-search-form.component';
import { LiScenarioTableComponent } from '../li-scenario-table/li-scenario-table.component';

@Component({
  selector: 'li-scenario-search',
  templateUrl: './li-scenario-search.component.html',
  styleUrls: ['./li-scenario-search.component.scss'],
  providers: [FlSearchState],
  imports: [
    FlSearchModule,
    LiScenarioSearchFormComponent,
    FlTextIconModule,
    MatIcon,
    FlIconModule,
    MatIconButton,
    MatTooltip,
    LiScenarioTableComponent,
    TranslatePipe,
  ],
})
export class LiScenarioSearchComponent implements OnInit {
  @Input() scenarioSelectable: boolean = false;

  @Input() fullPageSearch: boolean = true;

  @Output() scenarioSelected: EventEmitter<LiScenario> = new EventEmitter();

  columns: FlTableColumnStatic<LiScenario>[] = ['title', 'status', 'tags', 'lastModification'];

  datasource: LiScenarioDatasource<LiScenarioSearchFields>;

  private searchState = inject(FlSearchState);
  private scenarioService = inject(LiScenarioService);
  private dialogService = inject(FlDialogService);
  private routerService = inject(LiRouterService);
  private themeService = inject(FlThemeService);
  private actionService = inject(FlPortalActionsService);
  private snackBarService = inject(FlSnackBarService);

  ngOnInit(): void {
    const config: FlSearchConfig = {
      version: 1,
      buildAdvancedForm: LiScenarioSearch.getSearchForm as any,
      advancedFormClass: LiScenarioSearchFields,
      savedSearch: this.getSavedSearch(),
      advancedFormManager: {
        config: LiScenarioSearch.searchManagerConfig,
        skipFalseBoolean: true,
      },
      storeSearchInUrl: this.fullPageSearch,
      defaultSort: { key: 'lastModification', direction: 'DESC' },
    };

    this.datasource = this.scenarioService.searchDatasource();
    this.searchState.init(config, this.datasource);

    if (this.fullPageSearch) {
      this.columns.push('actions');
    }
  }

  private getSavedSearch(): FlSavedSearch[] {
    // list of predefined search of the resources
    return [
      {
        searchName: 'li-scenario',
        id: 'current-scenarios',
        label: 'Current scenarios',
        color: this.themeService.getCurrentThemeDetail().primary,
        version: 1,
        default: true,
        filtersCriteria: {
          creationTypes: ['MANUAL', 'IMPORTED'],
          isNotValidated: false,
          isArchived: false,
        } as Partial<LiScenarioSearchFields>,
      },
      {
        searchName: 'li-scenario',
        id: 'all-scenarios',
        label: 'All scenarios',
        color: this.themeService.getCurrentThemeDetail().primary,
        version: 1,
        default: false,
        filtersCriteria: {
          isArchived: true,
        } as Partial<LiScenarioSearchFields>,
      },
    ];
  }

  createScenario(): void {
    const input: FlFormDialogInput<LiScenario> = { mode: 'create' };
    this.dialogService
      .openSmallDialog(LiScenarioFormDialogComponent, { data: input, panelClass: 'g-dialog-allow-overflow' })
      .afterClosed()
      .subscribe((scenario) => this.onCreateScenarioClosed(scenario));
  }

  private onCreateScenarioClosed(scenario?: LiScenario): void {
    if (scenario) {
      this.routerService.navigateToScenarioDetail(scenario.id);
    }
  }

  selectScenario(scenario: LiScenario): void {
    this.scenarioSelected.next(scenario);
  }

  openImportFromUrlDialog(): void {
    const data: LiQuickConfigureProcessDialogInput = {
      title: 'li.import_scenario_from_lab',
      helpText: 'li.import_scenario_from_lab_help',
      specs$: this.scenarioService.getImportScenarioConfigSpecs(),
    };
    this.dialogService
      .openMediumDialog(LiQuickConfigureProcessDialogComponent, { data: data })
      .afterClosed()
      .subscribe((configValues) => this.onImportScenarioClosed(configValues));
  }

  private onImportScenarioClosed(configValues: TdParamSpecsValues): void {
    if (configValues) {
      this.actionService.addAction(
        {
          type: 'import-scenario',
          action: this.scenarioService.importScenarioFromLab(configValues),
          text: { text: 'li.downloading_scenario', translateText: true },
          successLink: (scenario: LiScenario) => LiRouterService.getScenarioDetailRoute(scenario.id),
        },
        false
      );

      this.snackBarService.openSuccessMessage(
        {
          text: 'li.downloading_scenario_help_text',
          translateText: true,
        },
        5000
      );
    }
  }
}
