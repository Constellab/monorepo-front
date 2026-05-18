import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { FlFormDialogInput } from '@monorepo/front-core-lib/fl-core';
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
import {
  LiNoteTemplate,
  LiNoteTemplateDatasource,
  LiNoteTemplateSearch,
  LiNoteTemplateSearchFields,
  LiNoteTemplateSearchFieldsDisabled,
  LiNoteTemplateService,
  LiRouterService,
} from '@monorepo/lab-lib/li-core';
import { TranslatePipe } from '@ngx-translate/core';

import { LiNoteTemplateFormDialogComponent } from '../li-note-template-form-dialog/li-note-template-form-dialog.component';
import { LiNoteTemplateSearchFormComponent } from '../li-note-template-search-form/li-note-template-search-form.component';
import { LiNoteTemplateTableComponent } from '../li-note-template-table/li-note-template-table.component';

@Component({
  selector: 'li-note-template-search',
  templateUrl: './li-note-template-search.component.html',
  styleUrls: ['./li-note-template-search.component.scss'],
  providers: [FlSearchState],
  imports: [
    FlSearchModule,
    LiNoteTemplateSearchFormComponent,
    FlTextIconModule,
    MatIcon,
    FlIconModule,
    MatIconButton,
    MatTooltip,
    LiNoteTemplateTableComponent,
    TranslatePipe,
  ],
})
export class LiNoteTemplateSearchComponent implements OnInit {
  private searchState = inject<FlSearchState<any>>(FlSearchState);
  private noteTemplateService = inject(LiNoteTemplateService);
  private themeService = inject(FlThemeService);
  private dialogService = inject(FlDialogService);
  private routerService = inject(LiRouterService);

  @Input() noteTemplateSelectable: boolean = false;

  @Input() fullPageSearch: boolean = true;

  @Input() defaultFilters: Partial<LiNoteTemplateSearchFields> = null;

  @Input() disabledFilters: LiNoteTemplateSearchFieldsDisabled = null;

  @Output() noteTemplateSelected: EventEmitter<LiNoteTemplate> = new EventEmitter();

  datasource: LiNoteTemplateDatasource<LiNoteTemplateSearchFields>;

  ngOnInit(): void {
    const config: FlSearchConfig = {
      version: 1,
      buildAdvancedForm: LiNoteTemplateSearch.getSearchForm,
      advancedFormClass: LiNoteTemplateSearchFields,
      savedSearch: this.getSavedSearch(),
      advancedFormManager: {
        config: LiNoteTemplateSearch.searchManagerConfig,
        skipFalseBoolean: true,
      },
      storeSearchInUrl: this.fullPageSearch,
      defaultSort: { key: 'lastModification', direction: 'DESC' },
    };

    this.datasource = this.noteTemplateService.getSearchDatasource();
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
  }

  private getSavedSearch(): FlSavedSearch[] {
    return [
      {
        searchName: 'li-doc-template',
        id: 'all-doc-template',
        label: 'All templates',
        color: this.themeService.getCurrentThemeDetail().primary,
        version: 1,
        default: true,
        filtersCriteria: {},
      },
    ];
  }

  selectTemplate(noteTemplate: LiNoteTemplate): void {
    this.noteTemplateSelected.next(noteTemplate);
  }

  openCreateNoteTemplateDialog(): void {
    const data: FlFormDialogInput = {
      mode: 'create',
    };

    this.dialogService
      .openSmallDialog(LiNoteTemplateFormDialogComponent, { data })
      .afterClosed()
      .subscribe((template) => this.onCreateClosed(template));
  }

  private onCreateClosed(noteTemplate?: LiNoteTemplate): void {
    if (noteTemplate) {
      this.routerService.navigateToNoteTemplateDetail(noteTemplate.id);
    }
  }
}
