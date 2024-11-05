import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FlDialogService,
  FlFormDialogInput,
  FlSavedSearch,
  FlSearchConfig,
  FlSearchState,
  FlThemeService,
} from '@monorepo/front-core-lib';
import {
  LabNoteTemplate,
  LabNoteTemplateDatasource,
} from '../../../../model/entities/lab-note-template.entity';
import { LabNoteTemplateService } from '../../../../entity-service/lab-note-template.service';
import { LabNoteTemplateSearch, LabNoteTemplateSearchFields } from '../../lab-note-template-search.class';
import { LabRouterService } from '../../../../service/lab-router.service';
import { LabNoteTemplateFormDialogComponent } from '../lab-note-template-form-dialog/lab-note-template-form-dialog.component';

@Component({
  selector: 'lab-note-template-search',
  templateUrl: './lab-note-template-search.component.html',
  styleUrls: ['./lab-note-template-search.component.scss'],
  providers: [FlSearchState],
})
export class LabNoteTemplateSearchComponent implements OnInit {
  @Input() noteTemplateSelectable: boolean = false;

  @Input() fullPageSearch: boolean = true;

  @Output() noteTemplateSelected: EventEmitter<LabNoteTemplate> = new EventEmitter();

  datasource: LabNoteTemplateDatasource<LabNoteTemplateSearchFields>;

  constructor(
    private searchState: FlSearchState<any>,
    private noteTemplateService: LabNoteTemplateService,
    private themeService: FlThemeService,
    private dialogService: FlDialogService,
    private routerService: LabRouterService
  ) {}

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
