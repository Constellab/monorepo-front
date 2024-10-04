import { Component, Input, OnInit } from '@angular/core';
import {
  FlDialogService,
  FlEntityPaginatedDatasource,
  FlFormDialogInput,
  FlSavedSearch,
  FlSearchConfig,
  FlSearchState,
  FlTableColumnStatic,
  FlThemeService
} from '@monorepo/front-core-lib';
import { CaLabInstance, CaLabInstanceDatasource } from '../../../../model/entities/lab/ca-lab-instance.class';
import { CaLabInstanceService } from '../../../../service-api/ca-lab-instance.service';
import { CaLabInstanceSearch, CaLabInstanceSearchFields } from '../../model/ca-lab-instance-search.class';
import {
  CaLabInstanceAdminFormDialogComponent,
  CaLabInstanceAdminFormDialogInput
} from '../ca-lab-instance-admin-form-dialog/ca-lab-instance-admin-form-dialog.component';
import { CaLabInstanceSearchMode } from '../ca-lab-instance-search-form/ca-lab-instance-search-form.component';
import {
  CaLabFreeAdminFormDialogComponent
} from '../ca-lab-free-admin-form-dialog/ca-lab-free-admin-form-dialog.component';

@Component({
  selector: 'ca-lab-instance-search',
  templateUrl: './ca-lab-instance-search.component.html',
  styleUrls: ['./ca-lab-instance-search.component.scss'],
  providers: [FlSearchState]
})
export class CaLabInstanceSearchComponent implements OnInit {

  /**
   * Mode for the search
   * All --> search in all lab, only for admin
   * CurrentSpace --> search in the current space, only for space admin
   */
  @Input() mode: CaLabInstanceSearchMode;

  datasource: CaLabInstanceDatasource<CaLabInstanceSearchFields>;

  columns: FlTableColumnStatic<CaLabInstance>[];


  constructor(private searchState: FlSearchState<any>,
              private labInstanceService: CaLabInstanceService,
              private themeService: FlThemeService,
              private dialogService: FlDialogService) {
  }

  ngOnInit(): void {
    const config: FlSearchConfig = {
      version: 1,
      buildAdvancedForm: CaLabInstanceSearch.getSearchForm,
      advancedFormClass: CaLabInstanceSearchFields,
      savedSearch: this.getSavedSearch(),
      advancedFormManager: {
        config: CaLabInstanceSearch.searchManagerConfig,
      },
      storeSearchInUrl: true,
      defaultSort: {key: 'name', direction: 'ASC'}
    };

    this.datasource = this.getDatasource();
    this.searchState.init(config, this.datasource);

    this.columns = this.getColumns();
  }

  private getSavedSearch(): FlSavedSearch[] {
    return [
      {
        searchName: 'ca-lab-instance',
        id: null,
        label: 'All labs',
        color: this.themeService.getCurrentThemeDetail().primary,
        version: 1,
        default: true,
        filtersCriteria: {} as Partial<CaLabInstanceSearchFields>
      },
      {
        searchName: 'ca-lab-instance',
        id: null,
        label: 'Running cloud',
        color: this.themeService.getCurrentThemeDetail().primary,
        version: 1,
        default: false,
        filtersCriteria: {
          type: 'CLOUD',
          currentStatus: 'LAB_RUNNING'
        } as Partial<CaLabInstanceSearchFields>
      }
    ];
  }

  private getDatasource(): CaLabInstanceDatasource<CaLabInstanceSearchFields> {
    switch (this.mode) {
      case 'all':
        return new FlEntityPaginatedDatasource(
          (page, size, data) => this.labInstanceService.searchAll(page, size, data),
          20, false);
      case 'current-space':
        return new FlEntityPaginatedDatasource(
          (page, size, filters) => this.labInstanceService.searchInCurrentSpace(page, size, filters),
          20, false);
      default:
        throw new Error(`[CaLabInstanceSearchComponent] Unknown mode '${this.mode}'`);
    }
  }

  private getColumns(): FlTableColumnStatic<CaLabInstance>[] {
    switch (this.mode) {
      case 'all':
        return ['name', 'space', 'currentStatus', 'virtualHost', 'serverCloud', 'actions'];
      case 'current-space':
        return ['name', 'currentStatus', 'virtualHost', 'serverCloud'];
      default:
        throw new Error(`[CaLabInstanceSearchComponent] Unknown mode '${this.mode}'`);
    }
  }

  openCreateLabInstanceForm(): void {
    const dialogInput: CaLabInstanceAdminFormDialogInput = {
      mode: 'create'
    };

    this.dialogService.openMediumDialog(CaLabInstanceAdminFormDialogComponent, {data: dialogInput}).afterClosed()
      .subscribe(
        labInstance => this.onCreateLabInstanceClosed(labInstance)
      );
  }

  openCreateLabFreeForm(): void {
    const dialogInput: FlFormDialogInput = {
      mode: 'create'
    };

    this.dialogService.openMediumDialog(CaLabFreeAdminFormDialogComponent, {data: dialogInput}).afterClosed()
      .subscribe(
        labInstance => this.onCreateLabInstanceClosed(labInstance)
      );
  }

  private onCreateLabInstanceClosed(labInstance?: CaLabInstance): void {
    if (labInstance) {
      this.datasource.unshiftItem(labInstance);
    }
  }
}
