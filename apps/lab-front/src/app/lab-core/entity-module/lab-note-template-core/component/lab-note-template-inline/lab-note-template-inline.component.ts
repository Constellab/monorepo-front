import { Component, Input } from '@angular/core';
import { LabNoteTemplate } from '../../../../model/entities/lab-note-template.entity';

@Component({
  selector: 'lab-note-template-inline',
  templateUrl: './lab-note-template-inline.component.html',
  styleUrls: ['./lab-note-template-inline.component.scss'],
})
export class LabNoteTemplateInlineComponent {
  @Input({required: true}) noteTemplate: LabNoteTemplate;

}
