import { ChangeDetectionStrategy,Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { FlTableColumnStatic } from '@monorepo/front-core-lib/fl-core';
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
import { LiRouterService } from '@monorepo/lab-lib/li-core';
import { TranslatePipe } from '@ngx-translate/core';

import { LiForm } from '../../../li-core/model/entities/form/li-form.entity';
import { LiFormDatasource, LiFormService } from '../../service/li-form.service';
import { LiFormSearch, LiFormSearchFields, LiFormSearchFieldsDisabled } from '../../service/li-form-search';
import { LiCreateFormDialogComponent } from '../li-create-form-dialog/li-create-form-dialog.component';
import { LiFormSearchFormComponent } from '../li-form-search-form/li-form-search-form.component';
import { LiFormTableComponent } from '../li-form-table/li-form-table.component';

@Component({
  selector: 'li-form-search',
  templateUrl: './li-form-search.component.html',
  providers: [FlSearchState],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    FlSearchModule,
    LiFormSearchFormComponent,
    FlTextIconModule,
    MatIcon,
    MatIconButton,
    MatTooltip,
    FlIconModule,
    LiFormTableComponent,
    TranslatePipe,
  ],
})
export class LiFormSearchComponent implements OnInit {
  private searchState = inject<FlSearchState<any>>(FlSearchState);
  private formService = inject(LiFormService);
  private dialogService = inject(FlDialogService);
  private routerService = inject(LiRouterService);
  private themeService = inject(FlThemeService);

  @Input() formSelectable: boolean = false;

  @Input() fullPageSearch: boolean = true;

  @Input() columns: FlTableColumnStatic<LiForm>[] = ['name', 'status', 'template', 'tags'];

  @Input() defaultFilters: Partial<LiFormSearchFields> = null;

  @Input() disabledFilters: LiFormSearchFieldsDisabled = null;

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

    if (this.defaultFilters) {
      this.searchState.advancedSearchFormGroup.patchValue(this.defaultFilters);
    }
    if (this.disabledFilters) {
      Object.entries(this.disabledFilters).forEach(([key, value]) => {
        if (value === true) {
          this.searchState.advancedSearchFormGroup.controls[key]?.disable();
        }
      });
    }

    if (this.fullPageSearch) {
      this.columns.push('actions');
    }
  }

  private getSavedSearch(): FlSavedSearch[] {
    return [
      {
        searchName: 'li-form',
        id: 'active-forms',
        label: 'Active forms',
        color: this.themeService.getCurrentThemeDetail().primary,
        version: 1,
        default: true,
        filtersCriteria: { isArchived: false } as Partial<LiFormSearchFields>,
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

  createForm(): void {
    this.dialogService
      .openSmallDialog(LiCreateFormDialogComponent, {
        data: { mode: 'create' },
      })
      .afterClosed()
      .subscribe((form) => {
        if (form) {
          this.routerService.navigateToFormDetail(form.id);
        }
      });
  }
}
