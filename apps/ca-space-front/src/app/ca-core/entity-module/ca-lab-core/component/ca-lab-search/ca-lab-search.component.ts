import { Component, inject, Input, OnInit } from '@angular/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { FlCardModule } from '@monorepo/front-core-lib/fl-card';
import {
  FlEntityPaginatedDatasource,
  FlFormDialogInput,
  FlTableColumnStatic,
} from '@monorepo/front-core-lib/fl-core';
import { FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import {
  FlSavedSearch,
  FlSearchConfig,
  FlSearchModule,
  FlSearchState,
} from '@monorepo/front-core-lib/fl-search';
import { FlIconModule } from '@monorepo/front-core-lib/fl-svg-icon';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { FlThemeService } from '@monorepo/front-core-lib/fl-theme';
import { TranslatePipe } from '@ngx-translate/core';

import { CaLab, CaLabDatasource, CaLabWithSpace } from '../../../../model/entities/lab/ca-lab.class';
import { CaIsAdminDirective } from '../../../../module/ca-core-directive/ca-is-admin/ca-is-admin.directive';
import { CaRouterService } from '../../../../service/ca-router.service';
import { CaLabService } from '../../../../service-api/ca-lab.service';
import { CaLabSearch, CaLabSearchFields } from '../../model/ca-lab-search.class';
import {
  CaLabAdminFormDialogComponent,
  CaLabAdminFormDialogInput,
} from '../ca-lab-admin-form-dialog/ca-lab-admin-form-dialog.component';
import { CaLabFreeAdminFormDialogComponent } from '../ca-lab-free-admin-form-dialog/ca-lab-free-admin-form-dialog.component';
import {
  CaLabSearchFormComponent,
  CaLabSearchMode,
} from '../ca-lab-search-form/ca-lab-search-form.component';
import { CaLabTableComponent } from '../ca-lab-table/ca-lab-table.component';

@Component({
  selector: 'ca-lab-search',
  templateUrl: './ca-lab-search.component.html',
  styleUrls: ['./ca-lab-search.component.scss'],
  providers: [FlSearchState],
  imports: [
    FlCardModule,
    FlSearchModule,
    FlTextIconModule,
    MatIcon,
    FlIconModule,
    CaIsAdminDirective,
    MatIconButton,
    MatTooltip,
    MatButton,
    CaLabSearchFormComponent,
    CaLabTableComponent,
    TranslatePipe,
  ],
})
export class CaLabSearchComponent implements OnInit {
  private searchState = inject<FlSearchState<any>>(FlSearchState);
  private labService = inject(CaLabService);
  private themeService = inject(FlThemeService);
  private dialogService = inject(FlDialogService);
  private routerService = inject(CaRouterService);

  /**
   * Mode for the search
   * All --> search in all lab, only for admin
   * CurrentSpace --> search in the current space, only for space admin
   */
  @Input() mode: CaLabSearchMode;

  datasource: CaLabDatasource<CaLabSearchFields>;

  columns: FlTableColumnStatic<CaLab>[];

  ngOnInit(): void {
    const config: FlSearchConfig = {
      version: 1,
      buildAdvancedForm: CaLabSearch.getSearchForm,
      advancedFormClass: CaLabSearchFields,
      savedSearch: this.getSavedSearch(),
      advancedFormManager: {
        config: CaLabSearch.searchManagerConfig,
      },
      storeSearchInUrl: true,
      defaultSort: { key: 'name', direction: 'ASC' },
    };

    this.datasource = this.getDatasource();
    this.searchState.init(config, this.datasource);

    this.columns = this.getColumns();
  }

  private getSavedSearch(): FlSavedSearch[] {
    return [
      {
        searchName: 'ca-lab',
        id: null,
        label: 'All labs',
        color: this.themeService.getCurrentThemeDetail().primary,
        version: 1,
        default: true,
        filtersCriteria: {} as Partial<CaLabSearchFields>,
      },
      {
        searchName: 'ca-lab',
        id: null,
        label: 'Running cloud',
        color: this.themeService.getCurrentThemeDetail().primary,
        version: 1,
        default: false,
        filtersCriteria: {
          type: 'CLOUD',
          currentStatus: 'LAB_RUNNING',
        } as Partial<CaLabSearchFields>,
      },
    ];
  }

  private getDatasource(): CaLabDatasource<CaLabSearchFields> {
    switch (this.mode) {
      case 'all':
        return new FlEntityPaginatedDatasource(
          (page, size, data) => this.labService.searchAll(page, size, data),
          20,
          { initFirstPage: false }
        );
      case 'current-space':
        return new FlEntityPaginatedDatasource(
          (page, size, filters) => this.labService.searchInCurrentSpace(page, size, filters),
          20,
          { initFirstPage: false }
        );
      default:
        throw new Error(`[CaLabSearchComponent] Unknown mode '${this.mode}'`);
    }
  }

  private getColumns(): FlTableColumnStatic<CaLab>[] {
    switch (this.mode) {
      case 'all':
        return ['name', 'space', 'currentStatus', 'virtualHost', 'serverCloud', 'actions'];
      case 'current-space':
        return ['name', 'currentStatus', 'virtualHost', 'serverCloud'];
      default:
        throw new Error(`[CaLabSearchComponent] Unknown mode '${this.mode}'`);
    }
  }

  openCreateLabForm(): void {
    const dialogInput: CaLabAdminFormDialogInput = {
      mode: 'create',
    };

    this.dialogService
      .openMediumDialog(CaLabAdminFormDialogComponent, { data: dialogInput })
      .afterClosed()
      .subscribe((lab: CaLabWithSpace) => this.onCreateLabClosed(lab));
  }

  openCreateLabFreeForm(): void {
    const dialogInput: FlFormDialogInput = {
      mode: 'create',
    };

    this.dialogService
      .openMediumDialog(CaLabFreeAdminFormDialogComponent, { data: dialogInput })
      .afterClosed()
      .subscribe((lab: CaLabWithSpace) => this.onCreateLabClosed(lab));
  }

  private onCreateLabClosed(lab?: CaLabWithSpace): void {
    if (lab) {
      this.routerService.navigateToExternalSpaceRoute(
        lab.space.domain,
        CaRouterService.getLabDetailRoute(lab.id)
      );
    }
  }
}
