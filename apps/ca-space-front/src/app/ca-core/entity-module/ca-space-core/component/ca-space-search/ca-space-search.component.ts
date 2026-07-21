import { ChangeDetectionStrategy,Component, inject, OnInit } from '@angular/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { FlCardModule } from '@monorepo/front-core-lib/fl-card';
import { FlEntityPaginatedDatasource } from '@monorepo/front-core-lib/fl-core';
import { FlConfirmDialogInput, FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
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

import { CaSpaceDatasource } from '../../../../model/entities/space/ca-space.class';
import { CaSpaceSettingsDto } from '../../../../model/entities/space/ca-space.dto';
import { CaSpaceService } from '../../../../service-api/ca-space.service';
import { CaSpaceSearch, CaSpaceSearchFields } from '../../model/ca-space-search.class';
import {
  CaSpaceFormDialogComponent,
  CaSpaceFormDialogInput,
} from '../ca-space-form-dialog/ca-space-form-dialog.component';
import { CaSpaceSearchFormComponent } from '../ca-space-search-form/ca-space-search-form.component';
import { CaSpaceTableComponent } from '../ca-space-table/ca-space-table.component';

@Component({
  selector: 'ca-space-search',
  templateUrl: './ca-space-search.component.html',
  styleUrls: ['./ca-space-search.component.scss'],
  providers: [FlSearchState],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    FlCardModule,
    FlSearchModule,
    FlTextIconModule,
    MatIcon,
    FlIconModule,
    MatIconButton,
    MatTooltip,
    MatButton,
    CaSpaceSearchFormComponent,
    CaSpaceTableComponent,
    TranslatePipe,
  ],
})
export class CaSpaceSearchComponent implements OnInit {
  private searchState = inject<FlSearchState<any>>(FlSearchState);
  private spaceService = inject(CaSpaceService);
  private themeService = inject(FlThemeService);
  private dialogService = inject(FlDialogService);

  datasource: CaSpaceDatasource<CaSpaceSearchFields>;

  ngOnInit(): void {
    const config: FlSearchConfig = {
      version: 1,
      buildAdvancedForm: CaSpaceSearch.getSearchForm,
      advancedFormClass: CaSpaceSearchFields,
      savedSearch: this.getSavedSearch(),
      advancedFormManager: {
        config: CaSpaceSearch.searchManagerConfig,
      },
      storeSearchInUrl: true,
      defaultSort: { key: 'created', direction: 'DESC' },
    };

    this.datasource = new FlEntityPaginatedDatasource(
      (page, size, filters) => this.spaceService.search(page, size, filters),
      20,
      { initFirstPage: false }
    );
    this.searchState.init(config, this.datasource);
  }

  private getSavedSearch(): FlSavedSearch[] {
    return [
      {
        searchName: 'ca-space',
        id: null,
        label: 'All spaces',
        color: this.themeService.getCurrentThemeDetail().primary,
        version: 1,
        default: true,
        filtersCriteria: {} as Partial<CaSpaceSearchFields>,
      },
    ];
  }

  createSpace(): void {
    const input: CaSpaceFormDialogInput = {
      mode: 'create',
    };

    this.dialogService
      .openSmallDialog(CaSpaceFormDialogComponent, { data: input })
      .afterClosed()
      .subscribe((version) => this.onCreateClosed(version));
  }

  private onCreateClosed(spaceSettings?: CaSpaceSettingsDto): void {
    if (spaceSettings) {
      this.datasource.addItem(spaceSettings.space, () => true);
    }
  }

  generateAllUserPersonalSpaces(): void {
    const data: FlConfirmDialogInput = {
      title: 'generate_all_user_space',
      content: 'generate_all_user_space_confirmation',
      observable: this.spaceService.generateAllUserPersonalSpace(),
      successMessage: 'all_user_space_generated',
    };

    this.dialogService.openConfirmDialog(data);
  }
}
