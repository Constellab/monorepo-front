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

import { LiFormTemplate } from '../../../li-core/model/entities/form/li-form-template.entity';
import { LiFormTemplateDatasource, LiFormTemplateService } from '../../service/li-form-template.service';
import { LiFormTemplateSearch, LiFormTemplateSearchFields } from '../../service/li-form-template-search';
import {
  LiFormTemplateFormDialogComponent,
  LiFormTemplateFormDialogInput,
} from '../li-form-template-form-dialog/li-form-template-form-dialog.component';
import { LiFormTemplateSearchFormComponent } from '../li-form-template-search-form/li-form-template-search-form.component';
import { LiFormTemplateTableComponent } from '../li-form-template-table/li-form-template-table.component';

@Component({
  selector: 'li-form-template-search',
  templateUrl: './li-form-template-search.component.html',
  providers: [FlSearchState],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    FlSearchModule,
    LiFormTemplateSearchFormComponent,
    FlTextIconModule,
    MatIcon,
    FlIconModule,
    MatIconButton,
    MatTooltip,
    LiFormTemplateTableComponent,
    TranslatePipe,
  ],
})
export class LiFormTemplateSearchComponent implements OnInit {
  private searchState = inject<FlSearchState<any>>(FlSearchState);
  private formTemplateService = inject(LiFormTemplateService);
  private routerService = inject(LiRouterService);
  private dialogService = inject(FlDialogService);
  private themeService = inject(FlThemeService);

  @Input() templateSelectable: boolean = false;

  @Input() fullPageSearch: boolean = true;

  @Input() columns: FlTableColumnStatic<LiFormTemplate>[] = ['name', 'tags', 'lastModification'];

  @Output() templateSelected: EventEmitter<LiFormTemplate> = new EventEmitter();

  datasource: LiFormTemplateDatasource<LiFormTemplateSearchFields>;

  ngOnInit(): void {
    const config: FlSearchConfig = {
      version: 1,
      buildAdvancedForm: LiFormTemplateSearch.getSearchForm,
      advancedFormClass: LiFormTemplateSearchFields,
      savedSearch: this.getSavedSearch(),
      advancedFormManager: {
        config: LiFormTemplateSearch.searchManagerConfig,
        skipFalseBoolean: true,
      },
      storeSearchInUrl: this.fullPageSearch,
      defaultSort: { key: 'lastModification', direction: 'DESC' },
    };

    this.datasource = this.formTemplateService.searchDatasource();
    this.searchState.init(config, this.datasource);

    if (this.fullPageSearch) {
      this.columns.push('actions');
    }
  }

  private getSavedSearch(): FlSavedSearch[] {
    return [
      {
        searchName: 'li-form-template',
        id: 'current-templates',
        label: 'Current templates',
        color: this.themeService.getCurrentThemeDetail().primary,
        version: 1,
        default: true,
        filtersCriteria: { isArchived: false } as Partial<LiFormTemplateSearchFields>,
      },
      {
        searchName: 'li-form-template',
        id: 'all-templates',
        label: 'All templates',
        color: this.themeService.getCurrentThemeDetail().primary,
        version: 1,
        default: false,
        filtersCriteria: { isArchived: true } as Partial<LiFormTemplateSearchFields>,
      },
    ];
  }

  openCreateFormTemplateDialog(): void {
    const input: LiFormTemplateFormDialogInput = {
      mode: 'create',
    };

    this.dialogService
      .openSmallDialog(LiFormTemplateFormDialogComponent, { data: input })
      .afterClosed()
      .subscribe((template) => this.onFormClosed(template));
  }

  private onFormClosed(template?: LiFormTemplate): void {
    if (template) {
      this.routerService.navigateToFormTemplateDetail(template.id);
    }
  }

  selectTemplate(template: LiFormTemplate): void {
    this.templateSelected.next(template);
  }
}
