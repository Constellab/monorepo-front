import { ChangeDetectionStrategy, Component, inject, Input, OnInit } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { FlCardModule } from '@monorepo/front-core-lib/fl-card';
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

import { CaActivityDatasource } from '../../../../model/entities/ca-activity.class';
import { CaActivitySearch, CaActivitySearchFields } from '../../model/ca-activity-search.class';
import { CaActivitySearchFormComponent } from '../ca-activity-search-form/ca-activity-search-form.component';
import { CaActivityTableComponent } from '../ca-activity-table/ca-activity-table.component';

@Component({
  selector: 'ca-activity-search',
  templateUrl: './ca-activity-search.component.html',
  styleUrls: ['./ca-activity-search.component.scss'],
  providers: [FlSearchState],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    FlCardModule,
    FlSearchModule,
    FlTextIconModule,
    MatIcon,
    FlIconModule,
    CaActivitySearchFormComponent,
    CaActivityTableComponent,
    TranslatePipe,
  ],
})
export class CaActivitySearchComponent implements OnInit {
  private searchState = inject<FlSearchState<any>>(FlSearchState);
  private themeService = inject(FlThemeService);

  @Input({ required: true }) datasource: CaActivityDatasource<CaActivitySearchFields>;

  ngOnInit(): void {
    const config: FlSearchConfig = {
      version: 1,
      buildAdvancedForm: CaActivitySearch.getSearchForm,
      advancedFormClass: CaActivitySearchFields,
      savedSearch: this.getSavedSearch(),
      advancedFormManager: {
        config: CaActivitySearch.searchManagerConfig,
        skipFalseBoolean: true,
      },
      storeSearchInUrl: false,
      defaultSort: { key: 'creation', direction: 'DESC' },
    };

    this.searchState.init(config, this.datasource);
  }

  private getSavedSearch(): FlSavedSearch[] {
    return [
      {
        searchName: 'ca-activity',
        id: null,
        label: 'All activity',
        color: this.themeService.getCurrentThemeDetail().primary,
        version: 1,
        default: true,
        filtersCriteria: {} as Partial<CaActivitySearchFields>,
      },
    ];
  }
}
