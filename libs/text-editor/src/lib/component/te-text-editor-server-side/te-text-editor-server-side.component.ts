import { Component, Input, OnInit, Renderer2 } from '@angular/core';
import edjsHTML from 'editorjs-html';
import { TeRichText } from '../../model/lib';
import { TeConfig } from '../../model/te-config.class';
import { TeFigureBlock } from '../../block/te-figure-block.class';

@Component({
    selector: 'te-text-editor-server-side',
    templateUrl: './te-text-editor-server-side.component.html',
    styleUrl: './te-text-editor-server-side.component.scss',
    standalone: false
})
export class TeTextEditorServerSideComponent implements OnInit {
  @Input({ required: true }) richText: TeRichText;

  @Input({ required: true }) config: TeConfig;

  htmlValue: string;

  constructor(private renderer: Renderer2) {}

  ngOnInit(): void {
    if (this.richText != null) {
      const parser = edjsHTML({
        figure: (block: TeFigureBlock) => {
          if (this.config?.figureConfig)
            // eslint-disable-next-line max-len
            return `<img src="${this.config.figureConfig.getImageUrl(block.data.filename)}" height="${block.data.height}" width="${block.data.width}" />`;
          return '';
        },
      });
      const HTML = parser.parse(this.richText.toHTMLEditorJson());
      this.htmlValue = HTML.map((row: any) => (row instanceof Error ? '' : row)).join('<br>');
    }
  }
}
