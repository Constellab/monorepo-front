import { Component, OnInit } from '@angular/core';
import {
  FlDialogService,
  FlEntityPaginatedDatasource,
  FlSavedSearch,
  FlSearchConfig,
  FlSearchState,
  FlThemeService,
} from '@monorepo/front-core-lib';
import {
  CaTeamFormDialogComponent,
  CaTeamFormDialogInput,
} from '../ca-team-form-dialog/ca-team-form-dialog.component';
import { CaGroup, CaGroupDatasource } from '../../../../model/entities/ca-group.entity';
import { CaGroupService } from '../../../../service-api/ca-group.service';
import { CaTeamSearch, CaTeamSearchFields } from '../../model/ca-team.search.class';

@Component({
    selector: 'ca-team-search',
    templateUrl: './ca-team-search.component.html',
    styleUrls: ['./ca-team-search.component.scss'],
    providers: [FlSearchState],
    standalone: false
})
export class CaTeamSearchComponent implements OnInit {
  datasource: CaGroupDatasource<CaTeamSearchFields>;

  constructor(
    private searchState: FlSearchState<any>,
    private groupService: CaGroupService,
    private themeService: FlThemeService,
    private dialogService: FlDialogService
  ) {}

  ngOnInit(): void {
    const config: FlSearchConfig = {
      version: 1,
      buildAdvancedForm: CaTeamSearch.getSearchForm,
      advancedFormClass: CaTeamSearchFields,
      savedSearch: this.getSavedSearch(),
      advancedFormManager: {
        config: CaTeamSearch.searchManagerConfig,
        skipFalseBoolean: true,
      },
      storeSearchInUrl: true,
      defaultSort: { key: 'label', direction: 'ASC' },
    };

    this.datasource = new FlEntityPaginatedDatasource(
      (page, size, filters) => this.groupService.searchTeamInCurrentSpace(page, size, filters),
      20,
      { initFirstPage: false }
    );
    this.searchState.init(config, this.datasource);
  }

  private getSavedSearch(): FlSavedSearch[] {
    return [
      {
        searchName: 'ca-teams',
        id: null,
        label: 'All teams',
        color: this.themeService.getCurrentThemeDetail().primary,
        version: 1,
        default: true,
        filtersCriteria: {} as Partial<CaTeamSearchFields>,
      },
    ];
  }

  createTeam(): void {
    const input: CaTeamFormDialogInput = {
      mode: 'create',
    };

    this.dialogService
      .openSmallDialog(CaTeamFormDialogComponent, { data: input })
      .afterClosed()
      .subscribe((group) => this.onCreateClosed(group));
  }

  private onCreateClosed(group?: CaGroup): void {
    if (group) {
      this.datasource.addItem(group);
    }
  }
}
