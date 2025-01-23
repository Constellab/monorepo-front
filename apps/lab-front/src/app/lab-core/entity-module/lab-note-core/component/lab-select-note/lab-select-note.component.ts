import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import { FlFormFieldDirective } from '@monorepo/front-core-lib/fl-core';
import { FlInputSearchAdvancedButton, FlInputSearchModule } from '@monorepo/front-core-lib/fl-input-search';
import { FlInputSearchFilter } from '@monorepo/front-core-lib/fl-core';

import { NgControl } from '@angular/forms';
import { LabNote, LabNoteDatasource } from '../../../../model/entities/lab-note.entity';
import { LabNoteService } from '../../../../entity-service/lab-note.service';
import { LabSelectNoteDialogComponent } from '../lab-note-note-dialog/lab-select-note-dialog.component';
import { LabNoteTemplate } from '../../../../model/entities/lab-note-template.entity';
import { Observable } from 'rxjs';
import { FlUserModule } from '@monorepo/front-core-lib/fl-user';
import { LabNoteInlineComponent } from '../lab-note-inline/lab-note-inline.component';

@Component({
  selector: 'lab-select-note',
  templateUrl: './lab-select-note.component.html',
  styleUrls: ['./lab-select-note.component.scss'],
  providers: [{ provide: FlFormFieldDirective, useExisting: LabSelectNoteComponent }],
  imports: [FlInputSearchModule, FlUserModule, LabNoteInlineComponent],
})
export class LabSelectNoteComponent extends FlFormFieldDirective<LabNote> implements OnInit {
  private noteService = inject(LabNoteService);
  private dialogService = inject(FlDialogService);

  @Input() placeholder: string;

  @Output() valueChange: EventEmitter<LabNote> = new EventEmitter();

  selectedNote: LabNote | Observable<LabNote>;

  datasource: LabNoteDatasource<FlInputSearchFilter>;

  advancedButton: FlInputSearchAdvancedButton<LabNote>;

  constructor() {
    const ngControl = inject(NgControl, { optional: true, self: true });

    super(ngControl);
  }

  ngOnInit(): void {
    this.datasource = this.noteService.searchByNameDatasource();

    this.advancedButton = {
      onClick: () => this.dialogService.openBigDialog(LabSelectNoteDialogComponent).afterClosed(),
    };
  }

  callChangeEvent(value: LabNote): void {
    this.valueChange.emit(value);
    this.selectedNote = value;
  }

  onDisableChange(): void {}

  writeValue(obj: LabNote): void {
    if (obj == null || (typeof obj != 'string' && obj.id == null)) {
      this.selectedNote = null;
      this.value = null;
      return;
    }

    if (typeof obj == 'string') {
      this.selectedNote = this.noteService.getNote(obj);
    } else if (!(obj instanceof LabNoteTemplate)) {
      this.selectedNote = this.noteService.getNote((obj as any).id);
    } else {
      // if the user is complete
      this.selectedNote = obj;
    }

    this.value = obj;
  }
}
