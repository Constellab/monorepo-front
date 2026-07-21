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
import {
  LiNote,
  LiNoteDatasource,
  LiNoteSearch,
  LiNoteSearchFields,
  LiNoteSearchFieldsDisabled,
  LiNoteService,
  LiRouterService,
} from '@monorepo/lab-lib/li-core';
import { TranslatePipe } from '@ngx-translate/core';

import {
  LiNoteFormDialogComponent,
  LiNoteFormDialogInput,
} from '../li-note-form-dialog/li-note-form-dialog.component';
import { LiNoteSearchFormComponent } from '../li-note-search-form/li-note-search-form.component';
import { LiNoteTableComponent } from '../li-note-table/li-note-table.component';

@Component({
  selector: 'li-note-search',
  templateUrl: './li-note-search.component.html',
  styleUrls: ['./li-note-search.component.scss'],
  providers: [FlSearchState],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    FlSearchModule,
    LiNoteSearchFormComponent,
    FlTextIconModule,
    MatIcon,
    FlIconModule,
    MatIconButton,
    MatTooltip,
    LiNoteTableComponent,
    TranslatePipe,
  ],
})
export class LiNoteSearchComponent implements OnInit {
  private searchState = inject<FlSearchState<any>>(FlSearchState);
  private noteService = inject(LiNoteService);
  private routerService = inject(LiRouterService);
  private dialogService = inject(FlDialogService);
  private themeService = inject(FlThemeService);

  @Input() noteSelectable: boolean = false;

  @Input() fullPageSearch: boolean = true;

  @Input() columns: FlTableColumnStatic<LiNote>[] = ['title', 'tags', 'creation', 'lastModification'];

  @Input() defaultFilters: Partial<LiNoteSearchFields> = null;

  @Input() disabledFilters: LiNoteSearchFieldsDisabled = null;

  @Output() noteSelected: EventEmitter<LiNote> = new EventEmitter();

  datasource: LiNoteDatasource<LiNoteSearchFields>;

  ngOnInit(): void {
    const config: FlSearchConfig = {
      version: 1,
      buildAdvancedForm: LiNoteSearch.getSearchForm,
      advancedFormClass: LiNoteSearchFields,
      savedSearch: this.getSavedSearch(),
      advancedFormManager: {
        config: LiNoteSearch.searchManagerConfig,
        skipFalseBoolean: true,
      },
      storeSearchInUrl: this.fullPageSearch,
      defaultSort: { key: 'lastModification', direction: 'DESC' },
    };

    this.datasource = this.noteService.getSearchDatasource();
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
        searchName: 'li-note',
        id: 'current-notes',
        label: 'Current notes',
        color: this.themeService.getCurrentThemeDetail().primary,
        version: 1,
        default: true,
        filtersCriteria: { isNotValidated: false, isArchived: false } as Partial<LiNoteSearchFields>,
      },
      {
        searchName: 'li-note',
        id: 'all-notes',
        label: 'ALl notes',
        color: this.themeService.getCurrentThemeDetail().primary,
        version: 1,
        default: false,
        filtersCriteria: { isNotValidated: true, isArchived: true } as Partial<LiNoteSearchFields>,
      },
    ];
  }

  openCreateNoteFormDialog(): void {
    const input: LiNoteFormDialogInput = {
      mode: 'create',
    };

    this.dialogService
      .openSmallDialog(LiNoteFormDialogComponent, { data: input })
      .afterClosed()
      .subscribe((note) => this.onFormClosed(note));
  }

  private onFormClosed(note?: LiNote): void {
    if (note) {
      this.routerService.navigateToNoteDetail(note.id);
    }
  }

  selectNote(note: LiNote): void {
    this.noteSelected.next(note);
  }
}
