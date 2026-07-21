import { ChangeDetectionStrategy,Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { FlCardModule } from '@monorepo/front-core-lib/fl-card';
import { FlEntityPaginatedDatasource, FlFormDialogInput } from '@monorepo/front-core-lib/fl-core';
import { FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import {
  FlSavedSearch,
  FlSearchConfig,
  FlSearchModule,
  FlSearchState,
} from '@monorepo/front-core-lib/fl-search';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { FlThemeService } from '@monorepo/front-core-lib/fl-theme';
import { TranslatePipe } from '@ngx-translate/core';

import {
  CaServerCloud,
  CaServerCloudDatasource,
} from '../../../../model/entities/server/ca-server-cloud.class';
import { CaServerService } from '../../../../service-api/ca-server.service';
import { CaServerCloudSearch, CaServerCloudSearchFields } from '../../model/ca-server-cloud-search.class';
import { CaServerCloudFormDialogComponent } from '../ca-server-cloud-form-dialog/ca-server-cloud-form-dialog.component';
import { CaServerCloudSearchFormComponent } from '../ca-server-cloud-search-form/ca-server-cloud-search-form.component';
import { CaServerCloudTableComponent } from '../ca-server-cloud-table/ca-server-cloud-table.component';

@Component({
  selector: 'ca-server-cloud-search',
  templateUrl: './ca-server-cloud-search.component.html',
  styleUrls: ['./ca-server-cloud-search.component.scss'],
  providers: [FlSearchState],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    FlCardModule,
    FlSearchModule,
    FlTextIconModule,
    MatIcon,
    MatIconButton,
    MatTooltip,
    CaServerCloudSearchFormComponent,
    CaServerCloudTableComponent,
    TranslatePipe,
  ],
})
export class CaServerCloudSearchComponent implements OnInit {
  private searchState = inject<FlSearchState<any>>(FlSearchState);
  private serverService = inject(CaServerService);
  private themeService = inject(FlThemeService);
  private dialogService = inject(FlDialogService);

  @Input() mode: 'search' | 'selection' = 'search';

  @Output() serverCloudSelected: EventEmitter<CaServerCloud> = new EventEmitter();

  datasource: CaServerCloudDatasource<CaServerCloudSearchFields>;

  ngOnInit(): void {
    const config: FlSearchConfig = {
      version: 1,
      buildAdvancedForm: CaServerCloudSearch.getSearchForm,
      advancedFormClass: CaServerCloudSearchFields,
      savedSearch: this.getSavedSearch(),
      advancedFormManager: {
        config: CaServerCloudSearch.searchManagerConfig,
        skipFalseBoolean: true,
      },
      storeSearchInUrl: this.mode === 'search',
      defaultSort: { key: 'technicalName', direction: 'ASC' },
    };

    this.datasource = new FlEntityPaginatedDatasource(
      (page, size, filters) => this.serverService.searchServerCloud(page, size, filters),
      20,
      { initFirstPage: false }
    );
    this.searchState.init(config, this.datasource);
  }

  private getSavedSearch(): FlSavedSearch[] {
    return [
      {
        searchName: 'ca-server-info',
        id: null,
        label: 'All server',
        color: this.themeService.getCurrentThemeDetail().primary,
        version: 1,
        default: true,
        filtersCriteria: {} as Partial<CaServerCloudSearchFields>,
      },
    ];
  }

  openCreateServerCloud(): void {
    const dialogInput: FlFormDialogInput = {
      mode: 'create',
    };

    this.dialogService
      .openSmallDialog(CaServerCloudFormDialogComponent, { data: dialogInput })
      .afterClosed()
      .subscribe((serverCloud) => this.onCreateServerCloud(serverCloud));
  }

  private onCreateServerCloud(serverCloud?: CaServerCloud): void {
    if (serverCloud) {
      this.datasource.unshiftItem(serverCloud);
    }
  }

  selectServerCloud(serverCloud: CaServerCloud): void {
    this.serverCloudSelected.emit(serverCloud);
  }
}
