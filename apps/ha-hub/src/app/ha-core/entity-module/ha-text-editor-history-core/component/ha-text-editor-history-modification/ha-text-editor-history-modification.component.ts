import {Component, Input} from '@angular/core';
import {HaTextEditorHistoryModification} from '../../model/ha-text-editor-history-modification.class';

@Component({
  selector: 'ha-text-editor-history-modification',
  templateUrl: './ha-text-editor-history-modification.component.html',
  styleUrl: './ha-text-editor-history-modification.component.scss'
})
export class HaTextEditorHistoryModificationComponent {
  @Input({required: true}) modification: HaTextEditorHistoryModification;
}
