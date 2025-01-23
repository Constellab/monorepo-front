import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import { FlFormDialogInput } from '@monorepo/front-core-lib/fl-core';
import { FlSavedSearch } from '@monorepo/front-core-lib/fl-search';
import { FlSearchConfig } from '@monorepo/front-core-lib/fl-search';
import { FlSearchState } from '@monorepo/front-core-lib/fl-search';
import { FlThemeService } from '@monorepo/front-core-lib/fl-theme';

import {
  LabNoteTemplate,
  LabNoteTemplateDatasource,
} from '../../../../model/entities/lab-note-template.entity';
import { LabNoteTemplateService } from '../../../../entity-service/lab-note-template.service';
import { LabNoteTemplateSearch, LabNoteTemplateSearchFields } from '../../lab-note-template-search.class';
import { LabRouterService } from '../../../../service/lab-router.service';
import { LabNoteTemplateFormDialogComponent } from '../lab-note-template-form-dialog/lab-note-template-form-dialog.component';
import { FlSearchModule } from '@monorepo/front-core-lib/fl-search';
import { LabNoteTemplateSearchFormComponent } from '../lab-note-template-search-form/lab-note-template-search-form.component';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { MatIcon } from '@angular/material/icon';
import { FlIconModule } from '@monorepo/front-core-lib/fl-svg-icon';
import { MatIconButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { LabNoteTemplateTableComponent } from '../lab-note-template-table/lab-note-template-table.component';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'lab-note-template-search',
  templateUrl: './lab-note-template-search.component.html',
  styleUrls: ['./lab-note-template-search.component.scss'],
  providers: [FlSearchState],
  imports: [
    FlSearchModule,
    LabNoteTemplateSearchFormComponent,
    FlTextIconModule,
    MatIcon,
    FlIconModule,
    MatIconButton,
    MatTooltip,
    LabNoteTemplateTableComponent,
    TranslatePipe,
  ],
})
export class LabNoteTemplateSearchComponent implements OnInit {
  private searchState = inject<FlSearchState<any>>(FlSearchState);
  private noteTemplateService = inject(LabNoteTemplateService);
  private themeService = inject(FlThemeService);
  private dialogService = inject(FlDialogService);
  private routerService = inject(LabRouterService);

  @Input() noteTemplateSelectable: boolean = false;

  @Input() fullPageSearch: boolean = true;

  @Output() noteTemplateSelected: EventEmitter<LabNoteTemplate> = new EventEmitter();

  datasource: LabNoteTemplateDatasource<LabNoteTemplateSearchFields>;

  ngOnInit(): void {
    const config: FlSearchConfig = {
      version: 1,
      buildAdvancedForm: LabNoteTemplateSearch.getSearchForm,
      advancedFormClass: LabNoteTemplateSearchFields,
      savedSearch: this.getSavedSearch(),
      advancedFormManager: {
        config: LabNoteTemplateSearch.searchManagerConfig,
        skipFalseBoolean: true,
      },
      storeSearchInUrl: this.fullPageSearch,
      defaultSort: { key: 'lastModification', direction: 'DESC' },
    };

    this.datasource = this.noteTemplateService.getSearchDatasource();
    this.searchState.init(config, this.datasource);
  }

  private getSavedSearch(): FlSavedSearch[] {
    return [
      {
        searchName: 'lab-doc-template',
        id: 'all-doc-template',
        label: 'All templates',
        color: this.themeService.getCurrentThemeDetail().primary,
        version: 1,
        default: true,
        filtersCriteria: {},
      },
    ];
  }

  selectTemplate(noteTemplate: LabNoteTemplate): void {
    this.noteTemplateSelected.next(noteTemplate);
  }

  openCreateNoteTemplateDialog(): void {
    const data: FlFormDialogInput = {
      mode: 'create',
    };

    this.dialogService
      .openSmallDialog(LabNoteTemplateFormDialogComponent, { data })
      .afterClosed()
      .subscribe((template) => this.onCreateClosed(template));
  }

  private onCreateClosed(noteTemplate?: LabNoteTemplate): void {
    if (noteTemplate) {
      this.routerService.navigateToNoteTemplateDetail(noteTemplate.id);
    }
  }
}
