import { Component, computed, input } from '@angular/core';
import { HaFile, HaFileType } from '../../../ha-file-core/model/ha-file';
import { TeBlockHeaderLevel, TeRichText } from '@monorepo/text-editor';

@Component({
  selector: 'ha-text-editor-right-side-panel',
  templateUrl: './ha-text-editor-right-side-panel.component.html',
  styleUrl: './ha-text-editor-right-side-panel.component.scss',
})
export class HaTextEditorRightSidePanelComponent {
  content = input.required<TeRichText>();

  urlToDownloadFilePrefix = input.required<string>();

  files = input<HaFile[]>();

  filesToShow = computed(() => {
    return this.files()?.filter((file) => file.type === HaFileType.FILE);
  });

  titles = computed(() => {
    return this.content().getHeadersData([TeBlockHeaderLevel.HEADER_1, TeBlockHeaderLevel.HEADER_2]);
  });
}
