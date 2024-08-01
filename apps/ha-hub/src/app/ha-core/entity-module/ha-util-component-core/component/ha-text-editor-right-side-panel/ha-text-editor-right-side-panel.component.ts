import {Component, Input} from '@angular/core';
import {HaFile} from '../../../ha-file-core/model/ha-file';
import {TeRichTextContent} from '@monorepo/text-editor';

@Component({
  selector: 'ha-text-editor-right-side-panel',
  templateUrl: './ha-text-editor-right-side-panel.component.html',
  styleUrl: './ha-text-editor-right-side-panel.component.scss'
})
export class HaTextEditorRightSidePanelComponent {
  @Input()
  files: HaFile[];

  @Input({required: true})
  content: TeRichTextContent;

  @Input({required: true})
  urlToDownloadFilePrefix: string;
}
