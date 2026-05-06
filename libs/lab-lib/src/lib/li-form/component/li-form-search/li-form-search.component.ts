import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { FlTableColumnStatic } from '@monorepo/front-core-lib/fl-core';
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

import { LiForm } from '../../model/li-form.entity';
import { LiFormDatasource, LiFormService } from '../../service/li-form.service';
import { LiFormSearch, LiFormSearchFields } from '../../service/li-form-search';
import { LiFormSearchFormComponent } from '../li-form-search-form/li-form-search-form.component';
import { LiFormTableComponent } from '../li-form-table/li-form-table.component';

@Component({
  selector: 'li-form-search',
  templateUrl: './li-form-search.component.html',
  providers: [FlSearchState],
  imports: [
    FlSearchModule,
    LiFormSearchFormComponent,
    FlTextIconModule,
    MatIcon,
    FlIconModule,
    LiFormTableComponent,
    TranslatePipe,
  ],
})
export class LiFormSearchComponent implements OnInit {
  private searchState = inject<FlSearchState<any>>(FlSearchState);
  private formService = inject(LiFormService);
  private themeService = inject(FlThemeService);

  @Input() formSelectable: boolean = false;

  @Input() fullPageSearch: boolean = true;

  @Input() columns: FlTableColumnStatic<LiForm>[] = ['name', 'status', 'tags', 'lastModification'];

  @Output() formSelected: EventEmitter<LiForm> = new EventEmitter();

  datasource: LiFormDatasource<LiFormSearchFields>;

  ngOnInit(): void {
    const config: FlSearchConfig = {
      version: 1,
      buildAdvancedForm: LiFormSearch.getSearchForm,
      advancedFormClass: LiFormSearchFields,
      savedSearch: this.getSavedSearch(),
      advancedFormManager: {
        config: LiFormSearch.searchManagerConfig,
        skipFalseBoolean: true,
      },
      storeSearchInUrl: this.fullPageSearch,
      defaultSort: { key: 'lastModification', direction: 'DESC' },
    };

    this.datasource = this.formService.searchDatasource();
    this.searchState.init(config, this.datasource);

    if (this.fullPageSearch) {
      this.columns.push('actions');
    }
  }

  private getSavedSearch(): FlSavedSearch[] {
    return [
      {
        searchName: 'li-form',
        id: 'draft-forms',
        label: 'Draft forms',
        color: this.themeService.getCurrentThemeDetail().primary,
        version: 1,
        default: true,
        filtersCriteria: { status: 'DRAFT', isArchived: false } as Partial<LiFormSearchFields>,
      },
      {
        searchName: 'li-form',
        id: 'all-forms',
        label: 'All forms',
        color: this.themeService.getCurrentThemeDetail().primary,
        version: 1,
        default: false,
        filtersCriteria: { isArchived: true } as Partial<LiFormSearchFields>,
      },
    ];
  }

  selectForm(form: LiForm): void {
    this.formSelected.next(form);
  }
}
