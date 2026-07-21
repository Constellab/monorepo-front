import { ChangeDetectionStrategy,Component, signal } from '@angular/core';
import { TeBlockType, TeRichTextDTO, TeTools } from '@monorepo/text-editor';

import {
  DcRichTextConfig,
  DcTextEditorComponent,
} from '../../../../dc-components/dc-text-editor/dc-text-editor.component';
import { DcTextEditorToolExampleBlock } from '../../dc-text-editor-tool-example';

@Component({
  selector: 'dc-text-editor-dev',
  imports: [DcTextEditorComponent],
  templateUrl: './dc-text-editor-dev.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: '../dc-dev-examples.scss',
})
export class DcTextEditorDevComponent {
  textEditorConfig = signal<DcRichTextConfig>({
    placeholder: 'Enter your text here...',
    initialValue: {
      version: 2,
      editorVersion: '2.30.2',
      blocks: [
        {
          id: 'sample-block-1',
          type: TeBlockType.PARAGRAPH,
          data: {
            text: 'This is a sample text editor with some initial content.',
          },
        },
      ],
    },
    minHeight: '500px',
    maxHeight: '1000px',
    changeEventDebounceTime: 2500,
  });

  textEditorCustomTools: TeTools = { test: DcTextEditorToolExampleBlock };

  onTextEditorOutput(data: TeRichTextDTO): void {
    console.log('Text editor output:', data);
  }

  updateTextEditorValue(): void {
    this.textEditorConfig.set({
      placeholder: 'Enter your text here...',
      initialValue: null,
      value: {
        version: 2,
        editorVersion: '2.30.2',
        blocks: [
          {
            id: 'sample-block-1',
            type: TeBlockType.PARAGRAPH,
            data: {
              text: 'This is the UPDATED text editor content with new value!',
            },
          },
          {
            id: 'sample-block-2',
            type: TeBlockType.PARAGRAPH,
            data: {
              text: 'This is a second paragraph added after update.',
            },
          },
        ],
      },
      disabled: false,
      minHeight: '200px',
      maxHeight: '500px',
    });
  }

  toggleTextEditorDisabled(): void {
    const currentConfig = this.textEditorConfig();
    this.textEditorConfig.set({
      ...currentConfig,
      disabled: !currentConfig.disabled,
    });
  }
}
