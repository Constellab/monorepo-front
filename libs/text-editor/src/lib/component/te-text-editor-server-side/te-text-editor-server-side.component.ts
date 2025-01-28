import { Component, inject, Input, OnInit, Renderer2, ViewEncapsulation } from '@angular/core';
import edjsHTML from 'editorjs-html';
import { TeRichText } from '../../model/lib';
import { TeConfig } from '../../model/te-config.class';
import { TeFigureBlock } from '../../block/te-figure-block.class';

@Component({
  selector: 'te-text-editor-server-side',
  templateUrl: './te-text-editor-server-side.component.html',
  styleUrl: './te-text-editor-server-side.component.scss',
  standalone: false,
  encapsulation: ViewEncapsulation.None,
})
export class TeTextEditorServerSideComponent implements OnInit {
  private renderer: Renderer2 = inject(Renderer2);

  @Input({ required: true }) richText: TeRichText;

  @Input({ required: true }) config: TeConfig;

  htmlValue: string;

  ngOnInit(): void {
    if (this.richText != null) {
      const parser = edjsHTML({
        figure: (block: TeFigureBlock) => {
          if (this.config?.figureConfig) {
            const img: HTMLImageElement = this.renderer.createElement('img');
            img.src = this.config.figureConfig.getImageUrl(block.data.filename);
            img.height = block.data.height;
            img.width = block.data.width;
            return `${img.outerHTML}`;
          }
          return '';
        },
      });
      const HTML = parser.parse(this.richText.toHTMLEditorJson());
      this.htmlValue = HTML.map((row: any) => (row instanceof Error ? '' : row)).join('<br>');
    }
  }
}
