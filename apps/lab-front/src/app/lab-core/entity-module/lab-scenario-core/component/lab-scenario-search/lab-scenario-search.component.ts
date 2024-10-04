import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FlDialogService,
  FlFormDialogInput,
  FlSavedSearch,
  FlSearchConfig,
  FlSearchState,
  FlTag,
  FlThemeService
} from '@monorepo/front-core-lib';
import { LabScenarioSearch, LabScenarioSearchFields } from '../../model/lab-scenario-search.class';
import { LabScenarioService } from '../../../../entity-service/lab-scenario.service';
import { LabScenario, LabScenarioDatasource } from '../../../../model/entities/lab-scenario.entity';
import { LabScenarioFormDialogComponent } from '../lab-scenario-form-dialog/lab-scenario-form-dialog.component';
import { LabRouterService } from '../../../../service/lab-router.service';
import {
  LabImportScenarioFromLinkComponent
} from '../lab-import-scenario-from-link/lab-import-scenario-from-link.component';


@Component({
  selector: 'lab-scenario-search',
  templateUrl: './lab-scenario-search.component.html',
  styleUrls: ['./lab-scenario-search.component.scss'],
  providers: [
    FlSearchState
  ]
})
export class LabScenarioSearchComponent implements OnInit {

  @Input() scenarioSelectable: boolean = false;

  @Input() fullPageSearch: boolean = true;

  @Output() scenarioSelected: EventEmitter<LabScenario> = new EventEmitter();

  datasource: LabScenarioDatasource<LabScenarioSearchFields>;

  constructor(private searchState: FlSearchState<any>,
              private scenarioService: LabScenarioService,
              private dialogService: FlDialogService,
              private routerService: LabRouterService,
              private themeService: FlThemeService) {
  }

  ngOnInit(): void {
    const config: FlSearchConfig = {
      version: 1,
      buildAdvancedForm: LabScenarioSearch.getSearchForm as any,
      advancedFormClass: LabScenarioSearchFields,
      savedSearch: this.getSavedSearch(),
      advancedFormManager: {
        config: LabScenarioSearch.searchManagerConfig,
        skipFalseBoolean: true
      },
      storeSearchInUrl: this.fullPageSearch,
      defaultSort: { key: 'lastModification', direction: 'DESC' }
    };

    this.datasource = this.scenarioService.searchDatasource();
    this.searchState.init(config, this.datasource);
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
          isArchived: false
        } as Partial<LabScenarioSearchFields>
      },
      {
        searchName: 'lab-scenario',
        id: 'all-scenarios',
        label: 'All scenarios',
        color: this.themeService.getCurrentThemeDetail().primary,
        version: 1,
        default: false,
        filtersCriteria: {
          isArchived: true
        } as Partial<LabScenarioSearchFields>
      }
    ];
  }

  createScenario(): void {
    const input: FlFormDialogInput<LabScenario> = { mode: 'create' };
    this.dialogService.openSmallDialog(LabScenarioFormDialogComponent,
      { data: input, panelClass: 'g-dialog-allow-overflow' }).afterClosed().subscribe(
      scenario => this.onCreateScenarioClosed(scenario)
    );
  }

  private onCreateScenarioClosed(scenario?: LabScenario): void {
    if (scenario) {
      this.routerService.navigateToScenarioDetail(scenario.id);
    }
  }

  selectScenario(scenario: LabScenario): void {
    this.scenarioSelected.next(scenario);
  }

  searchOnTag(tag: FlTag): void {
    const search: Partial<LabScenarioSearchFields> = {
      tags: [tag]
    };
    this.searchState.callAdvancedSearchFromObject(search);
  }

  openImportFromUrlDialog(): void {
    this.dialogService.openMediumDialog(LabImportScenarioFromLinkComponent);
  }
}
