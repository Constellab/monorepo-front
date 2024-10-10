import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FlDialogService,
  FlSavedSearch,
  FlSearchConfig,
  FlSearchState,
  FlThemeService
} from '@monorepo/front-core-lib';
import { LabNoteSearch, LabNoteSearchFields } from '../../model/lab-note-search.class';
import { LabNote, LabNoteDatasource } from '../../../../model/entities/lab-note.entity';
import { LabNoteService } from '../../../../entity-service/lab-note.service';
import { LabRouterService } from '../../../../service/lab-router.service';
import {
  LabNoteFormDialogComponent,
  LabNoteFormDialogInput
} from '../lab-note-form-dialog/lab-note-form-dialog.component';
import {
  LabSelectNoteTemplateDialogComponent,
  LabSelectNoteTemplateDialogInput
} from '../../../lab-note-template-core/component/lab-select-note-template-dialog/lab-select-note-template-dialog.component';


@Component({
  selector: 'lab-note-search',
  templateUrl: './lab-note-search.component.html',
  styleUrls: ['./lab-note-search.component.scss'],
  providers: [
    FlSearchState
  ]
})
export class LabNoteSearchComponent implements OnInit {

  @Input() noteSelectable: boolean = false;

  @Input() fullPageSearch: boolean = true;

  @Output() noteSelected: EventEmitter<LabNote> = new EventEmitter();

  datasource: LabNoteDatasource<LabNoteSearchFields>;

  constructor(private searchState: FlSearchState<any>,
              private noteService: LabNoteService,
              private routerService: LabRouterService,
              private dialogService: FlDialogService,
              private themeService: FlThemeService) {
  }

  ngOnInit(): void {
    const config: FlSearchConfig = {
      version: 1,
      buildAdvancedForm: LabNoteSearch.getSearchForm,
      advancedFormClass: LabNoteSearchFields,
      savedSearch: this.getSavedSearch(),
      advancedFormManager: {
        config: LabNoteSearch.searchManagerConfig,
        skipFalseBoolean: true
      },
      storeSearchInUrl: this.fullPageSearch,
      defaultSort: { key: 'lastModification', direction: 'DESC' }
    };

    this.datasource = this.noteService.getSearchDatasource();
    this.searchState.init(config, this.datasource);
  }

  private getSavedSearch(): FlSavedSearch[] {
    return [
      {
        searchName: 'lab-note',
        id: 'current-notes',
        label: 'Current notes',
        color: this.themeService.getCurrentThemeDetail().primary,
        version: 1,
        default: true,
        filtersCriteria: { isNotValidated: false, isArchived: false } as Partial<LabNoteSearchFields>
      },
      {
        searchName: 'lab-note',
        id: 'all-notes',
        label: 'ALl notes',
        color: this.themeService.getCurrentThemeDetail().primary,
        version: 1,
        default: false,
        filtersCriteria: { isNotValidated: true, isArchived: true } as Partial<LabNoteSearchFields>
      }
    ];
  }

  openCreateNoteFormDialog(): void {
    const input: LabNoteFormDialogInput = {
      mode: 'create'
    };

    this.dialogService.openSmallDialog(LabNoteFormDialogComponent, { data: input }).afterClosed().subscribe(
      note => this.onFormClosed(note)
    );
  }

  private onFormClosed(note?: LabNote): void {
    if (note) {
      this.routerService.navigateToNoteDetail(note.id);
    }
  }

  selectNote(note: LabNote): void {
    this.noteSelected.next(note);
  }

  openNoteTemplatesSearch(): void {
    const data: LabSelectNoteTemplateDialogInput = { mode: 'link' };
    this.dialogService.openBigDialog(LabSelectNoteTemplateDialogComponent, { data });
  }
}
