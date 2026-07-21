import { ChangeDetectionStrategy,Component, Input } from '@angular/core';
import { FlUserModule } from '@monorepo/front-core-lib/fl-user';
import { LiNoteTemplate } from '@monorepo/lab-lib/li-core';

@Component({
  selector: 'li-note-template-inline',
  templateUrl: './li-note-template-inline.component.html',
  styleUrls: ['./li-note-template-inline.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [FlUserModule],
})
export class LiNoteTemplateInlineComponent {
  @Input({ required: true }) noteTemplate: LiNoteTemplate;
}
