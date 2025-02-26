import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import { FlFormDialogInput, FlTableColumnStatic } from '@monorepo/front-core-lib/fl-core';
import { FlPortalActionsService } from '@monorepo/front-core-lib/fl-portal-actions';
import {
  FlSavedSearch,
  FlSearchConfig,
  FlSearchModule,
  FlSearchState,
} from '@monorepo/front-core-lib/fl-search';
import { FlSnackBarService } from '@monorepo/front-core-lib/fl-snack-bar';
import { FlThemeService } from '@monorepo/front-core-lib/fl-theme';

import { LabScenarioSearch, LabScenarioSearchFields } from '../../model/lab-scenario-search.class';
import { LabScenarioService } from '../../../../entity-service/lab-scenario.service';
import { LabScenario, LabScenarioDatasource } from '../../../../model/entities/lab-scenario.entity';
import { LabScenarioFormDialogComponent } from '../lab-scenario-form-dialog/lab-scenario-form-dialog.component';
import { LabRouterService } from '../../../../service/lab-router.service';
import { PrConfigValues } from '@monorepo/protocol';
import {
  LabQuickConfigureProcessDialogComponent,
  LabQuickConfigureProcessDialogInput,
} from '../../../lab-process-core/component/lab-quick-configure-process-dialog/lab-quick-configure-process-dialog.component';
import { LabScenarioSearchFormComponent } from '../lab-scenario-search-form/lab-scenario-search-form.component';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { MatIcon } from '@angular/material/icon';
import { FlIconModule } from '@monorepo/front-core-lib/fl-svg-icon';
import { MatIconButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { LabScenarioTableComponent } from '../lab-scenario-table/lab-scenario-table.component';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'lab-scenario-search',
  templateUrl: './lab-scenario-search.component.html',
  styleUrls: ['./lab-scenario-search.component.scss'],
  providers: [FlSearchState],
  imports: [
    FlSearchModule,
    LabScenarioSearchFormComponent,
    FlTextIconModule,
    MatIcon,
    FlIconModule,
    MatIconButton,
    MatTooltip,
    LabScenarioTableComponent,
    TranslatePipe,
  ],
})
export class LabScenarioSearchComponent implements OnInit {
  @Input() scenarioSelectable: boolean = false;

  @Input() fullPageSearch: boolean = true;

  @Output() scenarioSelected: EventEmitter<LabScenario> = new EventEmitter();

  columns: FlTableColumnStatic<LabScenario>[] = ['title', 'status', 'tags', 'lastModification'];

  datasource: LabScenarioDatasource<LabScenarioSearchFields>;

  private searchState = inject(FlSearchState);
  private scenarioService = inject(LabScenarioService);
  private dialogService = inject(FlDialogService);
  private routerService = inject(LabRouterService);
  private themeService = inject(FlThemeService);
  private actionService = inject(FlPortalActionsService);
  private snackBarService = inject(FlSnackBarService);

  ngOnInit(): void {
    const config: FlSearchConfig = {
      version: 1,
      buildAdvancedForm: LabScenarioSearch.getSearchForm as any,
      advancedFormClass: LabScenarioSearchFields,
      savedSearch: this.getSavedSearch(),
      advancedFormManager: {
        config: LabScenarioSearch.searchManagerConfig,
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
        searchName: 'lab-scenario',
        id: 'current-scenarios',
        label: 'Current scenarios',
        color: this.themeService.getCurrentThemeDetail().primary,
        version: 1,
        default: true,
        filtersCriteria: {
          creationTypes: ['MANUAL', 'IMPORTED'],
          isNotValidated: false,
          isArchived: false,
        } as Partial<LabScenarioSearchFields>,
      },
      {
        searchName: 'lab-scenario',
        id: 'all-scenarios',
        label: 'All scenarios',
        color: this.themeService.getCurrentThemeDetail().primary,
        version: 1,
        default: false,
        filtersCriteria: {
          isArchived: true,
        } as Partial<LabScenarioSearchFields>,
      },
    ];
  }

  createScenario(): void {
    const input: FlFormDialogInput<LabScenario> = { mode: 'create' };
    this.dialogService
      .openSmallDialog(LabScenarioFormDialogComponent, { data: input, panelClass: 'g-dialog-allow-overflow' })
      .afterClosed()
      .subscribe((scenario) => this.onCreateScenarioClosed(scenario));
  }

  private onCreateScenarioClosed(scenario?: LabScenario): void {
    if (scenario) {
      this.routerService.navigateToScenarioDetail(scenario.id);
    }
  }

  selectScenario(scenario: LabScenario): void {
    this.scenarioSelected.next(scenario);
  }

  openImportFromUrlDialog(): void {
    const data: LabQuickConfigureProcessDialogInput = {
      title: 'biox.import_scenario_from_lab',
      helpText: 'biox.import_scenario_from_lab_help',
      specs$: this.scenarioService.getImportScenarioConfigSpecs(),
    };
    this.dialogService
      .openMediumDialog(LabQuickConfigureProcessDialogComponent, { data: data })
      .afterClosed()
      .subscribe((configValues) => this.onImportScenarioClosed(configValues));
  }

  private onImportScenarioClosed(configValues: PrConfigValues): void {
    if (configValues) {
      this.actionService.addAction(
        {
          type: 'import-scenario',
          action: this.scenarioService.importScenarioFromLab(configValues),
          text: { text: 'biox.downloading_scenario', translateText: true },
          successLink: (scenario: LabScenario) => LabRouterService.getScenarioDetailRoute(scenario.id),
        },
        false
      );

      this.snackBarService.openSuccessMessage(
        {
          text: 'biox.downloading_scenario_help_text',
          translateText: true,
        },
        5000
      );
    }
  }
}
