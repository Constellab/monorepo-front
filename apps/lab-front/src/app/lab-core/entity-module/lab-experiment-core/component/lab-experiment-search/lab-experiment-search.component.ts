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
import { LabExperimentSearch, LabExperimentSearchFields } from '../../model/lab-experiment-search.class';
import { LabExperimentService } from '../../../../entity-service/lab-experiment.service';
import { LabExperiment, LabExperimentDatasource } from '../../../../model/entities/lab-experiment.entity';
import { LabExperimentFormDialogComponent } from '../lab-experiment-form-dialog/lab-experiment-form-dialog.component';
import { LabRouterService } from '../../../../service/lab-router.service';
import {
  LabImportExperimentFromLinkComponent
} from '../lab-import-experiment-from-link/lab-import-experiment-from-link.component';


@Component({
  selector: 'lab-experiment-search',
  templateUrl: './lab-experiment-search.component.html',
  styleUrls: ['./lab-experiment-search.component.scss'],
  providers: [
    FlSearchState
  ]
})
export class LabExperimentSearchComponent implements OnInit {

  @Input() experimentSelectable: boolean = false;

  @Input() fullPageSearch: boolean = true;

  @Output() experimentSelected: EventEmitter<LabExperiment> = new EventEmitter();

  datasource: LabExperimentDatasource<LabExperimentSearchFields>;

  constructor(private searchState: FlSearchState<any>,
              private experimentService: LabExperimentService,
              private dialogService: FlDialogService,
              private routerService: LabRouterService,
              private themeService: FlThemeService) {
  }

  ngOnInit(): void {
    const config: FlSearchConfig = {
      version: 1,
      buildAdvancedForm: LabExperimentSearch.getSearchForm as any,
      advancedFormClass: LabExperimentSearchFields,
      savedSearch: this.getSavedSearch(),
      advancedFormManager: {
        config: LabExperimentSearch.searchManagerConfig,
        skipFalseBoolean: true
      },
      storeSearchInUrl: this.fullPageSearch,
      defaultSort: { key: 'lastModification', direction: 'DESC' }
    };

    this.datasource = this.experimentService.searchDatasource();
    this.searchState.init(config, this.datasource);
  }

  private getSavedSearch(): FlSavedSearch[] {
    // list of predefined search of the resources
    return [
      {
        searchName: 'lab-experiment',
        id: 'current-experiments',
        label: 'Current experiments',
        color: this.themeService.getCurrentThemeDetail().primary,
        version: 1,
        default: true,
        filtersCriteria: {
          creationTypes: ['MANUAL', 'IMPORTED'],
          isNotValidated: false,
          isArchived: false
        } as Partial<LabExperimentSearchFields>
      },
      {
        searchName: 'lab-experiment',
        id: 'all-experiments',
        label: 'All experiments',
        color: this.themeService.getCurrentThemeDetail().primary,
        version: 1,
        default: false,
        filtersCriteria: {
          isArchived: true
        } as Partial<LabExperimentSearchFields>
      }
    ];
  }

  createExperiment(): void {
    const input: FlFormDialogInput<LabExperiment> = { mode: 'create' };
    this.dialogService.openSmallDialog(LabExperimentFormDialogComponent,
      { data: input, panelClass: 'g-dialog-allow-overflow' }).afterClosed().subscribe(
      experiment => this.onCreateExperimentClosed(experiment)
    );
  }

  private onCreateExperimentClosed(experiment?: LabExperiment): void {
    if (experiment) {
      this.routerService.navigateToExperimentDetail(experiment.id);
    }
  }

  selectExperiment(experiment: LabExperiment): void {
    this.experimentSelected.next(experiment);
  }

  searchOnTag(tag: FlTag): void {
    const search: Partial<LabExperimentSearchFields> = {
      tags: [tag]
    };
    this.searchState.callAdvancedSearchFromObject(search);
  }

  openImportFromUrlDialog(): void {
    this.dialogService.openMediumDialog(LabImportExperimentFromLinkComponent);
  }
}
