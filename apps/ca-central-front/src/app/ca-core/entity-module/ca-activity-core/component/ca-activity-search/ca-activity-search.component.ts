import { Component, Input, OnInit, inject } from '@angular/core';
import { FlSavedSearch, FlSearchConfig, FlSearchState, FlThemeService } from '@monorepo/front-core-lib';
import { CaActivitySearch, CaActivitySearchFields } from '../../model/ca-activity-search.class';
import { CaActivityDatasource } from '../../../../model/entities/ca-activity.class';
import { FlCardModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-card/fl-card.module';
import { FlSearchModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-search/fl-search.module';
import { FlTextIconModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-text-icon/fl-text-icon.module';
import { MatIcon } from '@angular/material/icon';
import { FlIconModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-svg-icon/fl-icon.module';
import { CaActivitySearchFormComponent } from '../ca-activity-search-form/ca-activity-search-form.component';
import { CaActivityTableComponent } from '../ca-activity-table/ca-activity-table.component';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'ca-activity-search',
  templateUrl: './ca-activity-search.component.html',
  styleUrls: ['./ca-activity-search.component.scss'],
  providers: [FlSearchState],
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
      storeSearchInUrl: true,
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
