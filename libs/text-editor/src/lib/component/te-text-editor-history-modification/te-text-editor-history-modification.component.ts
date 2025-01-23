import { Component, Input } from '@angular/core';
import { TeRichTextBlockModificationWithUser } from '../../model/lib';

@Component({
  selector: 'te-text-editor-history-modification',
  templateUrl: './te-text-editor-history-modification.component.html',
  styleUrl: './te-text-editor-history-modification.component.scss',
  standalone: false,
})
export class TeTextEditorHistoryModificationComponent {
  @Input({ required: true }) modification: TeRichTextBlockModificationWithUser;
}
