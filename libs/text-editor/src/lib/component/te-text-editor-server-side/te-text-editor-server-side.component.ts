import { Component, inject, Input, OnInit, Renderer2, ViewEncapsulation } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import DOMPurify from 'dompurify';
import edjsHTML from 'editorjs-html';

import { TeFigureBlock } from '../../block/te-figure-block.class';
import { TeFormulaInlineToolClass } from '../../inline-tool/te-formula-inline-tool.class';
import { TeLinkInlineToolClass } from '../../inline-tool/te-link-inline-tool.class';
import { TeRichText } from '../../model/lib';
import { TeConfig } from '../../model/te-config.class';
import { teVariableTagName } from '../../model/te-variable.class';
import { teMentionTagName } from '../../plugin/te-mention.class';

/**
 * Custom inline tool tags that DOMPurify should allow
 */
const TE_CUSTOM_INLINE_TAGS = [
  TeLinkInlineToolClass.TAG,
  TeFormulaInlineToolClass.TAG,
  teVariableTagName,
  teMentionTagName,
];

@Component({
  selector: 'te-text-editor-server-side',
  templateUrl: './te-text-editor-server-side.component.html',
  styleUrl: './te-text-editor-server-side.component.scss',
  standalone: false,
  encapsulation: ViewEncapsulation.None,
})
export class TeTextEditorServerSideComponent implements OnInit {
  private renderer: Renderer2 = inject(Renderer2);
  private sanitizer: DomSanitizer = inject(DomSanitizer);

  @Input({ required: true }) richText: TeRichText;

  @Input({ required: true }) config: TeConfig;

  htmlValue: SafeHtml;

  ngOnInit(): void {
    if (this.richText != null) {
      const parser = edjsHTML({
        figure: (block: TeFigureBlock) => {
          if (this.config?.figureConfig) {
            const img: HTMLImageElement = this.renderer.createElement('img');
            img.src = this.config.figureConfig.getImageUrl(block.data.filename);
            img.height = block.data.height;
            img.width = block.data.width;
            img.alt = 'Text editor image';
            return `${img.outerHTML}`;
          }
          return '';
        },
      });
      const HTML = parser.parse(this.richText.toHTMLEditorJson());
      const rawHtml = HTML.map((row: any) => (row instanceof Error ? '' : row)).join('<br>');

      const cleanHtml = DOMPurify.sanitize(rawHtml, {
        ADD_TAGS: TE_CUSTOM_INLINE_TAGS,
        ADD_ATTR: ['data-jsondata', 'new-element'],
      });
      this.htmlValue = this.sanitizer.bypassSecurityTrustHtml(cleanHtml);
    }
  }
}
