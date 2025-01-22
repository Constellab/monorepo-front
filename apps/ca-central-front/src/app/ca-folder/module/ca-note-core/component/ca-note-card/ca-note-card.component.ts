import { Component, Input } from '@angular/core';
import { CaNote } from '../../../../../ca-core/model/entities/folder/ca-note.class';
import { FlCardModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-card/fl-card.module';
import { TranslatePipe } from '@ngx-translate/core';
import { FlDateModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-date/fl-date.module';

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
