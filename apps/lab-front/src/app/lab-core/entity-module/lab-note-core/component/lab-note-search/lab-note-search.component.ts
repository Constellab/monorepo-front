import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import {
  FlDialogService,
  FlSavedSearch,
  FlSearchConfig,
  FlSearchState,
  FlThemeService,
} from '@monorepo/front-core-lib';
import { LabNoteSearch, LabNoteSearchFields } from '../../model/lab-note-search.class';
import { LabNote, LabNoteDatasource } from '../../../../model/entities/lab-note.entity';
import { LabNoteService } from '../../../../entity-service/lab-note.service';
import { LabRouterService } from '../../../../service/lab-router.service';
import {
  LabNoteFormDialogComponent,
  LabNoteFormDialogInput,
} from '../lab-note-form-dialog/lab-note-form-dialog.component';
import {
  LabSelectNoteTemplateDialogComponent,
  LabSelectNoteTemplateDialogInput,
} from '../../../lab-note-template-core/component/lab-select-note-template-dialog/lab-select-note-template-dialog.component';
import { FlSearchModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-search/fl-search.module';
import { LabNoteSearchFormComponent } from '../lab-note-search-form/lab-note-search-form.component';
import { FlTextIconModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-text-icon/fl-text-icon.module';
import { MatIcon } from '@angular/material/icon';
import { FlIconModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-svg-icon/fl-icon.module';
import { MatIconButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { LabNoteTableComponent } from '../lab-note-table/lab-note-table.component';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'lab-note-search',
  templateUrl: './lab-note-search.component.html',
  styleUrls: ['./lab-note-search.component.scss'],
  providers: [FlSearchState],
  imports: [
    FlSearchModule,
    LabNoteSearchFormComponent,
    FlTextIconModule,
    MatIcon,
    FlIconModule,
    MatIconButton,
    MatTooltip,
    LabNoteTableComponent,
    TranslatePipe,
  ],
})
export class LabNoteSearchComponent implements OnInit {
  private searchState = inject<FlSearchState<any>>(FlSearchState);
  private noteService = inject(LabNoteService);
  private routerService = inject(LabRouterService);
  private dialogService = inject(FlDialogService);
  private themeService = inject(FlThemeService);

  @Input() noteSelectable: boolean = false;

  @Input() fullPageSearch: boolean = true;

  @Output() noteSelected: EventEmitter<LabNote> = new EventEmitter();

  datasource: LabNoteDatasource<LabNoteSearchFields>;

  ngOnInit(): void {
    const config: FlSearchConfig = {
      version: 1,
      buildAdvancedForm: LabNoteSearch.getSearchForm,
      advancedFormClass: LabNoteSearchFields,
      savedSearch: this.getSavedSearch(),
      advancedFormManager: {
        config: LabNoteSearch.searchManagerConfig,
        skipFalseBoolean: true,
      },
      storeSearchInUrl: this.fullPageSearch,
      defaultSort: { key: 'lastModification', direction: 'DESC' },
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
        filtersCriteria: { isNotValidated: false, isArchived: false } as Partial<LabNoteSearchFields>,
      },
      {
        searchName: 'lab-note',
        id: 'all-notes',
        label: 'ALl notes',
        color: this.themeService.getCurrentThemeDetail().primary,
        version: 1,
        default: false,
        filtersCriteria: { isNotValidated: true, isArchived: true } as Partial<LabNoteSearchFields>,
      },
    ];
  }

  openCreateNoteFormDialog(): void {
    const input: LabNoteFormDialogInput = {
      mode: 'create',
    };

    this.dialogService
      .openSmallDialog(LabNoteFormDialogComponent, { data: input })
      .afterClosed()
      .subscribe((note) => this.onFormClosed(note));
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
