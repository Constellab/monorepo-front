import {Component, Input} from '@angular/core';
import {TeTextEditorHistoryBlockModification} from '../../model/te-text-editor-history-modification.class';



@Component({
  selector: 'te-text-editor-history-modification',
  templateUrl: './te-text-editor-history-modification.component.html',
  styleUrl: './te-text-editor-history-modification.component.scss'
})
export class TeTextEditorHistoryModificationComponent {
  @Input({required: true}) modification: TeTextEditorHistoryBlockModification;
}
