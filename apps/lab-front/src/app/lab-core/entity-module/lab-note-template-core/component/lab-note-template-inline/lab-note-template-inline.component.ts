import { Component, Input } from '@angular/core';
import { LabNoteTemplate } from '../../../../model/entities/lab-note-template.entity';
import { FlUserModule } from '@monorepo/front-core-lib/fl-user';

@Component({
  selector: 'lab-note-template-inline',
  templateUrl: './lab-note-template-inline.component.html',
  styleUrls: ['./lab-note-template-inline.component.scss'],
  imports: [FlUserModule],
})
export class LabNoteTemplateInlineComponent {
  @Input({ required: true }) noteTemplate: LabNoteTemplate;
}
