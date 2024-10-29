import { Component, computed, input } from '@angular/core';
import { HaFile, HaFileType } from '../../../ha-file-core/model/ha-file';
import { TeRichText, TeRichTextContent } from '@monorepo/text-editor';

@Component({
  selector: 'ha-text-editor-right-side-panel',
  templateUrl: './ha-text-editor-right-side-panel.component.html',
  styleUrl: './ha-text-editor-right-side-panel.component.scss',
})
export class HaTextEditorRightSidePanelComponent {
  content = input.required<TeRichTextContent>();

  urlToDownloadFilePrefix = input.required<string>();

  files = input<HaFile[]>();

  filesToShow = computed(() => {
    return this.files()?.filter((file) => file.type === HaFileType.FILE);
  });

  titles = computed(() => {
    return TeRichText.getTitles(this.content(), [2, 3]);
  });
}
