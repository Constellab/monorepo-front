import { Component, Input } from '@angular/core';
import { FlCardModule } from '@monorepo/front-core-lib/fl-card';
import { FlDateModule } from '@monorepo/front-core-lib/fl-date';
import { TranslatePipe } from '@ngx-translate/core';

import { CaNote } from '../../../../../ca-core/model/entities/folder/ca-note.class';

/**
 * Simple card to display a note
 */
@Component({
  selector: 'ca-note-card',
  templateUrl: './ca-note-card.component.html',
  styleUrls: ['./ca-note-card.component.scss'],
  imports: [FlCardModule, TranslatePipe, FlDateModule],
})
export class CaNoteCardComponent {
  @Input() note: CaNote;
}
