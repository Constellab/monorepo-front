import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  LabNoteTemplate,
  LabNoteTemplateDatasource,
} from '../../../../model/entities/lab-note-template.entity';
import { FlTableColumnStatic } from '@monorepo/front-core-lib';

@Component({
    selector: 'lab-note-template-table',
    templateUrl: './lab-note-template-table.component.html',
    styleUrls: ['./lab-note-template-table.component.scss'],
    standalone: false
})
export class LabNoteTemplateTableComponent {
  // when true, the row become clickable and resourceSelected event is trigger
  @Input() rowSelectable: boolean = false;

  @Input({ required: true }) datasource: LabNoteTemplateDatasource<any>;

  @Input() columns: FlTableColumnStatic<LabNoteTemplate>[] = ['title', 'creation', 'lastModification'];

  @Output() noteTemplateSelected: EventEmitter<LabNoteTemplate> = new EventEmitter();

  rowClicked(noteTemplate: LabNoteTemplate): void {
    if (this.rowSelectable) {
      this.noteTemplateSelected.next(noteTemplate);
    }
  }
}
