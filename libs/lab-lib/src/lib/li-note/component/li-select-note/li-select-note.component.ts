import { ChangeDetectionStrategy,Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { NgControl } from '@angular/forms';
import { FlFormFieldDirective, FlInputSearchFilter } from '@monorepo/front-core-lib/fl-core';
import { FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import { FlInputSearchAdvancedButton, FlInputSearchModule } from '@monorepo/front-core-lib/fl-input-search';
import { FlUserModule } from '@monorepo/front-core-lib/fl-user';
import { LiNote, LiNoteDatasource, LiNoteService, LiNoteTemplate } from '@monorepo/lab-lib/li-core';
import { Observable } from 'rxjs';

import { LiNoteInlineComponent } from '../li-note-inline/li-note-inline.component';
import { LiSelectNoteDialogComponent } from '../li-note-note-dialog/li-select-note-dialog.component';

@Component({
  selector: 'li-select-note',
  templateUrl: './li-select-note.component.html',
  styleUrls: ['./li-select-note.component.scss'],
  providers: [{ provide: FlFormFieldDirective, useExisting: LiSelectNoteComponent }],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [FlInputSearchModule, FlUserModule, LiNoteInlineComponent],
})
export class LiSelectNoteComponent extends FlFormFieldDirective<LiNote> implements OnInit {
  private noteService = inject(LiNoteService);
  private dialogService = inject(FlDialogService);

  @Input() placeholder: string;

  @Output() valueChange: EventEmitter<LiNote> = new EventEmitter();

  selectedNote: LiNote | Observable<LiNote>;

  datasource: LiNoteDatasource<FlInputSearchFilter>;

  advancedButton: FlInputSearchAdvancedButton<LiNote>;

  constructor() {
    const ngControl = inject(NgControl, { optional: true, self: true });

    super(ngControl);
  }

  ngOnInit(): void {
    this.datasource = this.noteService.searchByNameDatasource();

    this.advancedButton = {
      onClick: () => this.dialogService.openBigDialog(LiSelectNoteDialogComponent).afterClosed(),
    };
  }

  callChangeEvent(value: LiNote): void {
    this.valueChange.emit(value);
    this.selectedNote = value;
  }

  onDisableChange(): void {}

  writeValue(obj: LiNote): void {
    if (obj == null || (typeof obj != 'string' && obj.id == null)) {
      this.selectedNote = null;
      this.value = null;
      return;
    }

    if (typeof obj == 'string') {
      this.selectedNote = this.noteService.getNote(obj);
    } else if (!(obj instanceof LiNoteTemplate)) {
      this.selectedNote = this.noteService.getNote((obj as any).id);
    } else {
      // if the user is complete
      this.selectedNote = obj;
    }

    this.value = obj;
  }
}
