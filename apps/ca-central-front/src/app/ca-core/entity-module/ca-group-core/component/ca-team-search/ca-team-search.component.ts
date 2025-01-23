import { Component, OnInit, inject } from '@angular/core';
import { FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import { FlEntityPaginatedDatasource } from '@monorepo/front-core-lib/fl-core';
import { FlSavedSearch } from '@monorepo/front-core-lib/fl-search';
import { FlSearchConfig } from '@monorepo/front-core-lib/fl-search';
import { FlSearchState } from '@monorepo/front-core-lib/fl-search';
import { FlThemeService } from '@monorepo/front-core-lib/fl-theme';

import {
  CaTeamFormDialogComponent,
  CaTeamFormDialogInput,
} from '../ca-team-form-dialog/ca-team-form-dialog.component';
import { CaGroup, CaGroupDatasource } from '../../../../model/entities/ca-group.entity';
import { CaGroupService } from '../../../../service-api/ca-group.service';
import { CaTeamSearch, CaTeamSearchFields } from '../../model/ca-team.search.class';
import { FlCardModule } from '@monorepo/front-core-lib/fl-card';
import { FlSearchModule } from '@monorepo/front-core-lib/fl-search';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { MatIcon } from '@angular/material/icon';
import { FlIconModule } from '@monorepo/front-core-lib/fl-svg-icon';
import { MatIconButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { CaTeamSearchFormComponent } from '../ca-team-search-form/ca-team-search-form.component';
import { CaTeamTableComponent } from '../ca-team-table/ca-team-table.component';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'ca-team-search',
  templateUrl: './ca-team-search.component.html',
  styleUrls: ['./ca-team-search.component.scss'],
  providers: [FlSearchState],
  imports: [
    FlCardModule,
    FlSearchModule,
    FlTextIconModule,
    MatIcon,
    FlIconModule,
    MatIconButton,
    MatTooltip,
    CaTeamSearchFormComponent,
    CaTeamTableComponent,
    TranslatePipe,
  ],
})
export class CaTeamSearchComponent implements OnInit {
  private searchState = inject<FlSearchState<any>>(FlSearchState);
  private groupService = inject(CaGroupService);
  private themeService = inject(FlThemeService);
  private dialogService = inject(FlDialogService);

  datasource: CaGroupDatasource<CaTeamSearchFields>;

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
