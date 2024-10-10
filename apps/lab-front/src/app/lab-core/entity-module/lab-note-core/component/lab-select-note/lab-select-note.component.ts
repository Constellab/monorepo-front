import { Component, EventEmitter, Input, OnInit, Optional, Output, Self } from '@angular/core';
import {
  FlDialogService,
  FlFormFieldDirective,
  FlInputSearchAdvancedButton,
  FlInputSearchFilter
} from '@monorepo/front-core-lib';
import { NgControl } from '@angular/forms';
import { LabNote, LabNoteDatasource } from '../../../../model/entities/lab-note.entity';
import { LabNoteService } from '../../../../entity-service/lab-note.service';
import { LabSelectNoteDialogComponent } from '../lab-note-note-dialog/lab-select-note-dialog.component';
import { LabNoteTemplate } from '../../../../model/entities/lab-note-template.entity';
import { Observable } from 'rxjs';

@Component({
  selector: 'lab-select-note',
  templateUrl: './lab-select-note.component.html',
  styleUrls: ['./lab-select-note.component.scss'],
  providers: [{ provide: FlFormFieldDirective, useExisting: LabSelectNoteComponent }]
})
export class LabSelectNoteComponent extends FlFormFieldDirective<LabNote> implements OnInit {

  @Input() placeholder: string;

  @Output() valueChange: EventEmitter<LabNote> = new EventEmitter();

  selectedNote: LabNote | Observable<LabNote>;

  datasource: LabNoteDatasource<FlInputSearchFilter>;

  advancedButton: FlInputSearchAdvancedButton<LabNote>;

  constructor(private noteService: LabNoteService,
              private dialogService: FlDialogService,
              @Optional() @Self() ngControl: NgControl) {
    super(ngControl);
  }

  ngOnInit(): void {
    this.datasource = this.noteService.searchByNameDatasource();

    this.advancedButton = {
      onClick: () => this.dialogService.openBigDialog(LabSelectNoteDialogComponent).afterClosed()
    };
  }

  callChangeEvent(value: LabNote): void {
    this.valueChange.emit(value);
    this.selectedNote = value;
  }

  onDisableChange(): void {
  }

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
