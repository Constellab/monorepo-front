import { Component, Input } from '@angular/core';
import { CaNote } from '../../../../../ca-core/model/entities/folder/ca-note.class';

/**
 * Simple card to display a note
 */
@Component({
  selector: 'ca-note-card',
  templateUrl: './ca-note-card.component.html',
  styleUrls: ['./ca-note-card.component.scss']
})
export class CaNoteCardComponent {

  @Input() note: CaNote;

}
